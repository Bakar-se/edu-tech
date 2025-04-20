"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const subjectSchema = z.object({
    name: z.string().min(3, "First name must be at least 3 characters"),
    teachers: z.array(z.string(), {
        required_error: "At least one teacher must be selected",
    }),
});

type SubjectSchema = z.infer<typeof subjectSchema>;

const ManageSubject = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get("action") || "create";
    const id = searchParams.get("id");

    const queryClient = useQueryClient();
    const [teachers, setTeachers] = useState<
        { id: string; name: string; surname: string }[]
    >([]);
    const [initialData, setInitialData] = useState<any>(null);

    const form = useForm<SubjectSchema>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: "",
            teachers: [],
        },
    });

    // Fetch teachers list
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await axios.get("/api/teachers/list");
                setTeachers(res.data.teachers);
            } catch (err) {
                toast.error("Failed to fetch teachers");
            }
        };
        fetchTeachers();
    }, []);

    // Fetch subject details if editing
    useEffect(() => {
        if (action === "edit" && id) {
            const fetchSubject = async () => {
                try {
                    const res = await axios.get(`/api/subjects/getsubject/${id}`);
                    const subject = res.data.data;

                    setInitialData(subject);
                    form.reset({
                        name: subject.name,
                        teachers: subject.teachers || [],
                    });
                } catch (err) {
                    toast.error("Failed to fetch subject data");
                }
            };
            fetchSubject();
        }
    }, [action, id, form]);

    const subjectMutation = useMutation({
        mutationFn: async (data: SubjectSchema) => {
            if (action === "create") {
                return await axios.post("/api/subjects/create", data);
            } else if (action === "edit" && id) {
                return await axios.put(`/api/subjects/update/${id}`, data);
            } else {
                throw new Error("Invalid action");
            }
        },
        onSuccess: () => {
            toast.success(`Subject ${action === "create" ? "created" : "updated"} successfully!`);
            router.push("/list/subjects");
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
        },
        onError: (err: any) => {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "An unexpected error occurred";
            toast.error(message);
        },
    });

    const onSubmit = (data: SubjectSchema) => {
        subjectMutation.mutate(data);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">
                {action === "create" ? "Create Subject" : "Edit Subject"}
            </h1>

            <Form {...form}>
                <form className="mt-6 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    {/* First Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Teachers Multi-Select */}
                    <FormField
                        control={form.control}
                        name="teachers"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teachers</FormLabel>
                                <FormControl>
                                    <select
                                        multiple
                                        className="w-full p-2 border rounded-md"
                                        value={field.value}
                                        onChange={(e) =>
                                            field.onChange(
                                                Array.from(e.target.selectedOptions, (option) => option.value)
                                            )
                                        }
                                    >
                                        {teachers.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name} {teacher.surname}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button type="submit" disabled={form.formState.isSubmitting}>
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

export default ManageSubject;
