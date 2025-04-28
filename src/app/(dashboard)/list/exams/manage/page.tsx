"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // <-- corrected import
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

interface Lesson {
    id: string;
    name: string;
    title: string;
}

const Schema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    startTime: z.string(),
    endTime: z.string(),
    lessonId: z.string().min(1, "Lesson is required"),
});

type FormData = z.infer<typeof Schema>;

const ManageExam = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const search = useSearchParams();
    const path = search.get("action");
    const id = search.get("id");

    const [action, setAction] = React.useState<string>("create");

    const form = useForm<FormData>({
        resolver: zodResolver(Schema),
        defaultValues: {
            title: "",
            startTime: "",
            endTime: "",
            lessonId: "",
        },
    });

    useEffect(() => {
        if (path) setAction(path);
    }, [path]);

    const fetchLessons = async () => {
        const response = await axios.get("/api/lessons/getalllessons");
        return response.data;
    };

    const { data: lessons, isLoading } = useQuery({
        queryKey: ["lessons"],
        queryFn: fetchLessons,
    });

    useEffect(() => {
        const fetchExam = async () => {
            if (action === "edit" && id) {
                try {
                    const response = await axios.get(`/api/exams/getexam/${id}`);
                    const examData = response.data.data;
                    form.reset({
                        title: examData.title || "",
                        startTime: examData.startTime || "",
                        endTime: examData.endTime || "",
                        lessonId: examData.lessonId || "",
                    });
                } catch (error) {
                    console.error("Error fetching exam:", error);
                }
            }
        };

        fetchExam();
    }, [action, id, form]);

    const examMutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (action === "create") {
                return await axios.post("/api/exams/create", data);
            } else if (action === "edit" && id) {
                return await axios.put(`/api/exams/update/${id}`, data);
            } else {
                throw new Error("Invalid action");
            }
        },
        onSuccess: () => {
            toast.success(`Exam ${action === "create" ? "created" : "updated"} successfully!`);
            router.push("/list/exams");
            form.reset();
            queryClient.invalidateQueries({ queryKey: ["exams"] });
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
        const now = new Date().toISOString();
        if (data.startTime < now || data.endTime < now) {
            toast.error("Start and end time must be in the future");
            return;
        }
        if (data.startTime >= data.endTime) {
            toast.error("End time must be after start time");
            return;
        }
        examMutation.mutate(data);
    };

    const minDateTime = new Date().toISOString().slice(0, 16);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold tracking-tight">
                {action === "create" ? "Create Exam" : "Edit Exam"}
            </h1>
            <Form {...form}>
                <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Exam Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter title" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} min={minDateTime} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Time</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} min={minDateTime} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lessonId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lesson</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Lesson" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoading ? (
                                                <div className="flex justify-center p-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                </div>
                                            ) : (
                                                lessons?.map((lesson: Lesson) => (
                                                    <SelectItem key={lesson.id} value={lesson.id}>
                                                        {lesson.title}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="mt-6" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting
                            ? action === "create" ? "Creating..." : "Updating..."
                            : action === "create" ? "Create Exam" : "Update Exam"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ManageExam;
