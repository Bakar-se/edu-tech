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
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface Lesson {
    id: string;
    name: string;
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
    const [action, setAction] = React.useState<string>("create");
    const search = useSearchParams();
    const path = search.get("action");
    const id = search.get("id");
    const queryClient = useQueryClient();

    const { data: lessons } = useQuery({
        queryKey: ["lessons"],
        queryFn: async () => {
            const res = await axios.get("/api/lessons/getalllessons");
            return res.data.data;
        },
    });

    const form = useForm<FormData>({
        resolver: zodResolver(Schema),
        defaultValues: {
            title: "",
            startTime: "",
            endTime: "",
            lessonId: "",
        },
    });

    const examMutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (action === "create") {
                // create exam api
                return await axios.post("/api/exams/create", data);
            } else if (action === "edit" && id) {
                // update exams api
                return await axios.put(`/api/exams/update/${id}`, data);
            } else {
                throw new Error("Invalid action");
            }
        },
        onSuccess: () => {
            toast.success(
                `Exam ${action === "create" ? "created" : "updated"} successfully!`
            );
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

    const minDateTime = new Date().toISOString().slice(0, 16); // format: YYYY-MM-DDTHH:MM

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold">Create Exam</h1>
            <Form {...form}>
                <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                                <FormLabel>Select Lesson</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="border p-2 rounded w-full"
                                        disabled={!lessons}
                                    >
                                        <option value="">Select lesson</option>
                                        {lessons?.map((lesson: any) => (
                                            <option key={lesson.id} value={lesson.id}>
                                                {lesson.name || lesson.title}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Creating..." : "Create Exam"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ManageExam;
