"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Subject } from "../../subjects/column";
import { Teacher } from "../../teachers/columns";
import { Class } from "../../classes/column";

const Schema = z.object({
    name: z.string().min(3).max(50),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    subjectId: z.string().min(1),
    teacherId: z.string().min(1),
    classId: z.number().nullable().optional(),
});

type FormData = z.infer<typeof Schema>;
const ManageLesson = () => {
    const router = useRouter();
    const [action, setAction] = React.useState("create");
    const search = useSearchParams();
    const path = search.get("action");
    const id = search.get("id");
    const queryClient = useQueryClient();

    const form = useForm<FormData>({
        resolver: zodResolver(Schema),
        defaultValues: {
            name: "",
            startTime: "",
            endTime: "",
            subjectId: "",
            teacherId: "",
            classId: null,
        },
    });

    const fetchTeachers = async () => {
        const response = await axios.get("/api/teachers/getallteachers");
        return response.data.data;
    };

    const fetchSubjects = async () => {
        const response = await axios.get("/api/subjects/getallsubjects");
        return response.data;
    };

    const fetchClasses = async () => {
        const response = await axios.get("/api/classes/getallclasses");
        return response.data.data;
    };

    const { data: teachers } = useQuery({ queryKey: ["teachers"], queryFn: fetchTeachers });
    const { data: subjects } = useQuery({ queryKey: ["subjects"], queryFn: fetchSubjects });
    console.log(subjects);
    const { data: classes } = useQuery({ queryKey: ["classes"], queryFn: fetchClasses });

    useEffect(() => {
        if (path) setAction(path);
    }, [path]);

    useEffect(() => {
        const fetchLesson = async () => {
            if (action === "edit" && id) {
                try {
                    const response = await axios.get(`/api/lessons/getlesson/${id}`);
                    const lessonData = response.data.data;
                    form.reset({
                        name: lessonData.name,
                        startTime: lessonData.startTime,
                        endTime: lessonData.endTime,
                        subjectId: lessonData.subjectId,
                        teacherId: lessonData.teacherId,
                        classId: lessonData.classId ?? null,
                    });
                } catch (error) {
                    console.error("Error fetching lesson:", error);
                }
            }
        };
        fetchLesson();
    }, [action, id, form]);

    const lessonMutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (action === "create") {
                return await axios.post("/api/lessons/create", data);
            } else if (action === "edit" && id) {
                return await axios.put(`/api/lessons/update/${id}`, data);
            } else {
                throw new Error("Invalid action");
            }
        },
        onSuccess: () => {
            toast.success(`Lesson ${action === "create" ? "created" : "updated"} successfully!`);
            router.push("/list/lessons");
            form.reset();
            queryClient.invalidateQueries({ queryKey: ["lessons"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error?.message || "An error occurred");
        },
    });

    const onSubmit = (data: FormData) => {
        lessonMutation.mutate(data);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold">
                {action === "create" ? "Create Lesson" : "Edit Lesson"}
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col gap-2">
                            <FormField control={form.control} name="name"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Lesson Name</FormLabel>
                                        <Input {...form.register("name")} placeholder="Enter lesson name" />
                                        <FormMessage >
                                            {form.formState.errors.name?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <FormField control={form.control} name="startTime"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <Input type="time" {...form.register("startTime")} />
                                        <FormMessage >
                                            {form.formState.errors.startTime?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <FormField control={form.control} name="endTime"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>End Time</FormLabel>
                                        <Input type="time" {...form.register("endTime")} />
                                        <FormMessage >
                                            {form.formState.errors.endTime?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="subjectId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select subject" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>

                                                {subjects?.map((subject: Subject) => (

                                                    <SelectItem key={subject.id} value={subject.id.toString()}>
                                                        {`${subject.name}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage>
                                            {form.formState.errors.teacherId?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="teacherId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Supervisor</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select supervisor" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {teachers?.map((teacher: Teacher) => (
                                                    <SelectItem key={teacher.id} value={teacher.id}>
                                                        {`${teacher.name}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage>
                                            {form.formState.errors.teacherId?.message}
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

                    <Button type="submit" className="mt-4" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : action === "create" ? "Create Lesson" : "Update Lesson"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ManageLesson;
