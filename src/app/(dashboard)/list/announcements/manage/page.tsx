"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
    FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Class } from "../../classes/column";

// Define the Schema for Announcement
const Schema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(100, { message: "Title must be at most 100 characters long" }),

    description: z
        .string()
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(1000, { message: "Description must be at most 1000 characters long" }),

    date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
        .transform((val) => new Date(val)),

    classId: z
        .number()
        .nullable()
        .optional(), // Optional foreign key to Class
});

type FormData = z.infer<typeof Schema>;

const ManageAnnouncement = () => {
    const router = useRouter();
    const [action, setAction] = React.useState<string>("create");
    const search = useSearchParams();
    const path = search.get("action");
    const id = search.get("id");
    console.log(path, id);

    const queryClient = useQueryClient();

    const [date, setDate] = React.useState<Date>(new Date());

    // Fetch classes to populate the class dropdown
    const fetchClasses = async () => {
        const response = await axios.get("/api/classes/getallclasses");
        return response.data.data;
    };

    const {
        data: classes,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["classes"],
        queryFn: fetchClasses,
    });



    useEffect(() => {
        if (path) {
            setAction(path);
        }
    }, [path]);

    const form = useForm<FormData>({
        resolver: zodResolver(Schema),
        defaultValues: {
            title: "",
            description: "",
            date: new Date(),
            classId: null,
        },
    });

    const announcementMutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (action === "create") {
                return await axios.post("/api/announcements/create", data);
            } else if (action === "edit" && id) {
                return await axios.put(`/api/announcements/update/${id}`, data);
            } else {
                throw new Error("Invalid action");
            }
        },
        onSuccess: () => {
            toast.success(
                `${action === "create" ? "Created" : "Updated"} announcement successfully!`
            );
            router.push("/list/announcements");
            form.reset();
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "An unexpected error occurred";
            toast.error(message);
        },
    });

    const onSubmit = (data: FormData) => {
        announcementMutation.mutate(data);
    };

    return (
        <div className="p-4">
            <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {action === "create" ? "Create Announcement" : "Edit Announcement"}
            </h1>

            <Form {...form}>
                <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Type here"
                                            {...form.register("title")}
                                        />
                                        <FormMessage>
                                            {form.formState.errors.title?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="description"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Type here"
                                            {...form.register("description")}
                                        />
                                        <FormMessage>
                                            {form.formState.errors.description?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="date"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <Input
                                            type="date"
                                            placeholder="Select Date"
                                            {...form.register("date")}
                                        />
                                        <FormMessage>
                                            {form.formState.errors.date?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="classId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {classes?.map((cls: Class) => (
                                                    <SelectItem key={cls.id} value={cls.id.toString()}>
                                                        {cls.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage>
                                            {form.formState.errors.classId?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="mt-4"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {action === "create" ? "Creating..." : "Updating..."}
                            </>
                        ) : action === "create" ? (
                            "Create"
                        ) : (
                            "Update"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ManageAnnouncement;
