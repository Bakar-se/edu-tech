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
import { Teacher } from "../../teachers/columns";

const subjectSchema = z.object({
    name: z.string().min(3, "Subject name is required"), // Subject name validation
    teacherId: z.string().min(1, "Teacher ID is required"), // Teacher ID validation
});



type SubjectSchema = z.infer<typeof subjectSchema>;

const ManageSubject = () => {
    const router = useRouter();
    const [action, setAction] = useState<string>("create");
    const search = useSearchParams();
    const path = search.get("action");
    const id = search.get("id");

    const queryClient = useQueryClient();

    const [teachers, setTeachers] = useState<
        { id: string; name: string; surname: string }[] | null
    >(null); // Initialize as null to handle undefined gracefully

    const [initialData, setInitialData] = useState<any>(null);

    const form = useForm<SubjectSchema>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: "",
            teacherId: "",
        }
    });

    // Fetch teachers list
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('/api/teachers');
                console.log('API response:', response.data); // Log the API response
                // Ensure the response is an array before setting it
                if (Array.isArray(response.data)) {
                    setTeachers(response.data);
                } else {
                    console.error('Response is not an array', response.data);
                    setTeachers([]); // Set an empty array if response is not an array
                }
            } catch (error) {
                console.error("Error fetching teachers:", error);
                setTeachers([]); // Set empty array in case of error
            }
        };

        fetchTeachers(); // Call the function inside useEffect
    }, []);



    // Fetch subject if editing
    useEffect(() => {
        if (path === "edit" && id) {
            setAction("edit");
            const fetchSubject = async () => {
                try {
                    const response = await axios.get(`/api/subjects/getsubject/${id}`);
                    const subject = response.data.data;
                    setInitialData(subject);
                    form.reset({
                        name: subject.name,
                        teacherId: subject.teachers?.[0]?.id || "", // get first teacher's ID
                    });

                } catch (error) {
                    console.error("Failed to fetch subject data", error);
                }
            };
            fetchSubject();
        }
    }, [path, id, form]);

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
            toast.success(
                `Subject ${action === "create" ? "created" : "updated"} successfully!`
            );
            router.push("/list/subjects");
            form.reset();
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
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
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter subject name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Teachers Multi-Select */}
                    <FormField
                        control={form.control}
                        name="teacherId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teacher</FormLabel>

                                {Array.isArray(teachers) && teachers.length > 0 ? (
                                    // ✅ Dropdown if parents are available
                                    <select
                                        {...field}
                                        className="border rounded p-2 w-full"
                                        required
                                    >
                                        <option value="">Select a teacher</option>
                                        {teachers.map((teacher: any) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {parent.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    // ✅ Text input fallback if no teacher
                                    <input
                                        {...field}
                                        type="text"
                                        className="border rounded p-2 w-full"
                                        placeholder="Enter Teacher ID"
                                        required
                                    />
                                )}

                                <FormMessage />
                            </FormItem>
                        )}
                    />



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


export default ManageSubject;
