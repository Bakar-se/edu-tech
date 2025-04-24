"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Student {
    id: string;
    name: string;
}

interface Exam {
    [x: string]: any;
    id: number;
    title: string;
}

interface Assignment {
    id: number;
    name: string;
}

const Schema = z.object({
    score: z.number().min(0, { message: "Score must be at least 0" }),
    studentId: z.string().min(1, { message: "Student is required" }),
    examId: z.number().nullable(),
    assignmentId: z.number().nullable(),
});

type FormData = z.infer<typeof Schema>;

const ResultForm = () => {
    const router = useRouter();
    const [action, setAction] = React.useState<string>("create");
    const search = useSearchParams();
    const path = search.get("action");
    const id = search.get("id");

    const fetchStudents = async () => {
        const response = await axios.get("/api/students/getallstudents");
        return response.data.data;
    };

    const fetchExams = async () => {
        const response = await axios.get("/api/exams/getallexams");
        return response.data.data;
    };

    const fetchAssignments = async () => {
        const response = await axios.get("/api/assignments/getallassignments");
        return response.data.data;
    };

    const { data: students, isLoading: studentsLoading } = useQuery({
        queryKey: ["students"],
        queryFn: fetchStudents,
    });

    const { data: exams, isLoading: examsLoading } = useQuery({
        queryKey: ["exams"],
        queryFn: fetchExams,
    });

    const { data: assignments, isLoading: assignmentsLoading } = useQuery({
        queryKey: ["assignments"],
        queryFn: fetchAssignments,
    });

    const queryClient = useQueryClient();

    useEffect(() => {
        if (path) {
            setAction(path);
        }
    }, [path]);

    const form = useForm<FormData>({
        resolver: zodResolver(Schema),
        defaultValues: {
            score: 0,
            studentId: "",
            examId: null,
            assignmentId: null,
        },
    });

    const resultMutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (action === "create") {
                return await axios.post("/api/results/create", data);
            } else if (action === "edit" && id) {
                return await axios.put(`/api/results/update/${id}`, data);
            } else {
                throw new Error("Invalid action");
            }
        },
        onSuccess: () => {
            toast.success(`Result ${action === "create" ? "created" : "updated"} successfully!`);
            router.push("/list/results");
            form.reset();
            queryClient.invalidateQueries({ queryKey: ["results"] });
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
                <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Score Field */}
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="score"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Score</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter score"
                                                {...form.register("score")}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        {/* Student Field */}
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="studentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select student" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {studentsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {students?.map((student: Student) => (
                                                    <SelectItem key={student.id} value={student.id}>
                                                        {`${student.name}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage>{form.formState.errors.studentId?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Exam Field */}
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="examId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Exam</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value !== null ? field.value.toString() : undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select exam" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {examsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {exams?.map((exam: Exam) => (
                                                    <SelectItem key={exam.id} value={exam.id.toString()}>
                                                        {exam.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage>{form.formState.errors.studentId?.message}</FormMessage>
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

export default ResultForm;
