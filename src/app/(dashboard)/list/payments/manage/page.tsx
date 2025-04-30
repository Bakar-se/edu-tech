"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";


interface Billing {
    id: string;
    billName: string;
}

const Schema = z.object({
    transactionId: z.string().min(1, "Transaction ID is required"),
    image: z.any().refine(file => file instanceof File || typeof file === "string", "Image is required"),
    billingId: z.string().min(1, "Billing ID is required"),
});

type FormData = z.infer<typeof Schema>;

const ManagePayment = () => {
    const router = useRouter();
    const search = useSearchParams();
    const [action, setAction] = useState("create");
    const id = search.get("id");
    const path = search.get("action");
    const queryClient = useQueryClient();

    const fetchBillings = async () => {
        const response = await axios.get("/api/billings/getallbillings");
        return response.data;
    };

    const form = useForm<FormData>({
        resolver: zodResolver(Schema),
        defaultValues: {
            transactionId: "",
            image: "",
            billingId: "",
        },
    });

    useEffect(() => {
        if (path) setAction(path);
    }, [path]);

    const { data: billings, isLoading: billingsLoading } = useQuery({
        queryKey: ["billings"],
        queryFn: fetchBillings,
    });

    useEffect(() => {
        const fetchPayment = async () => {
            if (action === "edit" && id) {
                try {
                    const res = await axios.get(`/api/payments/getpayment/${id}`);
                    const payment = res.data.data;

                    form.reset({
                        transactionId: payment.transactionId,
                        billingId: payment.billingId,
                        image: payment.image, // optional if image not editable
                    });
                } catch {
                    toast.error("Failed to load payment data.");
                }
            }
        };
        fetchPayment();
    }, [action, id, form]);

    const paymentMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const formData = new FormData();
            formData.append("transactionId", data.transactionId);
            formData.append("billingId", data.billingId);
            formData.append("image", data.image);

            if (action === "create") {
                return await axios.post("/api/payments/create", formData);
            } else if (action === "edit" && id) {
                return await axios.put(`/api/payments/update/${id}`, formData);
            }
            throw new Error("Invalid action");
        },
        onSuccess: () => {
            toast.success(`Payment ${action === "create" ? "created" : "updated"} successfully`);
            form.reset();
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Something went wrong");
        },
    });

    const onSubmit = (data: FormData) => {
        paymentMutation.mutate(data);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold">
                {action === "create" ? "Create Payment" : "Edit Payment"}
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">

                    <FormField
                        control={form.control}
                        name="transactionId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transaction ID</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Enter Transaction ID" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Image</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col gap-2">
                        <FormField
                            control={form.control}
                            name="billingId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billing</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select billing" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billingsLoading && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin flex justify-center" />
                                            )}
                                            {billings?.map((billing: Billing) => (
                                                <SelectItem key={billing.id} value={billing.id}>
                                                    {`${billing.billName} ${billing.id}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage>
                                        {form.formState.errors.billingId?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {action === "create" ? "Creating..." : "Updating..."}
                            </>
                        ) : action === "create" ? "Create" : "Update"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ManagePayment;
