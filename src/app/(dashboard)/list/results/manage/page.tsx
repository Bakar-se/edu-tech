"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Student {
    id: string;
    name: string;
    surname: string;

}

interface Exam {
    id: number;
    title: string;
}

const formSchema = z.object({
    grade: z.string().min(1, { message: "Grade is required" }),
    studentId: z.string().min(1, { message: "Student is required" }),
    examId: z.string().nullable(), // keep string because Select returns string
});

type FormData = z.infer<typeof formSchema>;

const ResultForm = () => {
    const router = useRouter();
    const search = useSearchParams();
    const queryClient = useQueryClient();
    const [action, setAction] = React.useState<"create" | "edit">("create");

    const id = search.get("id");
    const pathAction = search.get("action");

    useEffect(() => {
        if (pathAction === "edit") {
            setAction("edit");
        }
    }, [pathAction]);

    const { data: students, isLoading: studentsLoading } = useQuery({
        queryKey: ["students"],
        queryFn: async () => {
            const res = await axios.get("/api/students/getallstudents");
            return res.data.data;
        },
    });

    const { data: exams, isLoading: examsLoading } = useQuery({
        queryKey: ["exams"],
        queryFn: async () => {
            const res = await axios.get("/api/exams/getallexams");
            return res.data;
        },
    });

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            grade: "",
            studentId: "",
            examId: null,
        },
    });

    const resultMutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (action === "create") {
                return await axios.post("/api/results/create", data);
            }
            if (action === "edit" && id) {
                return await axios.put(`/api/results/update/${id}`, data);
            }
            throw new Error("Invalid action");
        },
        onSuccess: () => {
            toast.success(`Result ${action === "create" ? "created" : "updated"} successfully!`);
            queryClient.invalidateQueries({ queryKey: ["results"] });
            router.push("/list/results");
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
        resultMutation.mutate(data);
    };

    return (
        <div className="p-4">
            <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {action === "create" ? "Create Result" : "Edit Result"}
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Grade Field */}
                    <FormField
                        control={form.control}
                        name="grade"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Grade</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter grade (e.g., A+, B, C-)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Student Field */}
                    <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Student</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select student" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {studentsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {students?.map((student: Student) => (
                                            <SelectItem key={student.id} value={student.id}>
                                                {`${student.name} ${student.surname}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Exam Field (optional) */}
                    <FormField
                        control={form.control}
                        name="examId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Exam</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(value || null)}
                                    value={field.value ?? undefined}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select exam" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {examsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {exams?.map((exam: Exam) => (
                                            <SelectItem key={exam.id} value={exam.id.toString()}>
                                                {exam.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="col-span-full mt-4"
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

export default ResultForm;
