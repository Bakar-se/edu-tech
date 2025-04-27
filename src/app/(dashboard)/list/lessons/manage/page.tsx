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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const Schema = z.object({
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  subjectId: z.string().min(1, { message: "Subject is required" }),
  teacherId: z.string().min(1, { message: "Teacher is required" }),
});

type FormData = z.infer<typeof Schema>;

interface Teacher {
  id: string;
  name: string;
  surname: string;
}

interface Subject {
  id: string;
  name: string;
}
const ManageLesson = () => {
  const router = useRouter();
  const [action, setAction] = React.useState<string>("create");
  const search = useSearchParams();
  const path = search.get("action");
  const id = search.get("id");

  const fetchTeachers = async () => {
    const response = await axios.get("/api/teachers/getallteachers");
    return response.data.data;
  };

  const fetchSubjects = async () => {
    const response = await axios.get("/api/subjects/getallsubjects");
    return response.data.data;
  };

  const {
    data: teachers,
    isLoading: isTeachersLoading,
    isError: isTeachersError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  const {
    data: subjects,
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
  });

  const queryClient = useQueryClient();

  const [date, setDate] = React.useState<Date>(new Date());

  useEffect(() => {
    if (path) {
      setAction(path);
    }
  }, [path]);

  const form = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      startTime: "",
      endTime: "",
      subjectId: "",
      teacherId: "",
    },
  });

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
      toast.success(
        `Lesson ${action === "create" ? "created" : "updated"} successfully!`
      );
      router.push("/list/lessons");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
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
    lessonMutation.mutate(data);
  };

  return (
    <div className="p-4">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {action === "create" ? "Create Lesson" : "Edit Lesson"}
      </h1>

      <Form {...form}>
        <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="startTime"
                render={() => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Input
                      type="time"
                      placeholder="Select start time"
                      {...form.register("startTime")}
                    />
                    <FormMessage>
                      {form.formState.errors.startTime?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="endTime"
                render={() => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <Input
                      type="time"
                      placeholder="Select end time"
                      {...form.register("endTime")}
                    />
                    <FormMessage>
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
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isSubjectsLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin flex justify-center" />
                        )}
                        {subjects?.map((subject: Subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {`${subject.id} ${subject.name}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {form.formState.errors.subjectId?.message}
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
                    <FormLabel>Teacher</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isTeachersLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin flex justify-center" />
                        )}
                        {teachers?.map((teacher: Teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {`${teacher.name} ${teacher.surname}`}
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

export default ManageLesson;
