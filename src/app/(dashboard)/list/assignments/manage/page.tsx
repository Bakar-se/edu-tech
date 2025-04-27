"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Subject {
  id: string;
  name: string;
}

const Schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  startDate: z.date(),
  dueDate: z.date(),
  subjectId: z.string().min(1, { message: "Lesson ID is required" }),
});

type FormData = z.infer<typeof Schema>;

const ManageAssignment = () => {
  const router = useRouter();
  const search = useSearchParams();
  const action = search.get("action") || "create";
  const id = search.get("id");

  const fetchSubjects = async () => {
    const response = await axios.get("/api/subjects/getallsubjects");
    return response.data;
  };

  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: "",
      startDate: new Date(),
      dueDate: new Date(),
      subjectId: "",
    },
  });

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
  });

  const assignmentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (action === "create") {
        return await axios.post("/api/assignments/create", data);
      } else if (action === "edit" && id) {
        return await axios.put(`/api/assignments/update/${id}`, data);
      } else {
        throw new Error("Invalid action");
      }
    },
    onSuccess: () => {
      toast.success(
        `Assignment ${action === "create" ? "created" : "updated"} successfully!`
      );
      router.push("/list/assignments");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
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
    const now = new Date();

    if (data.startDate < now || data.dueDate < now) {
      toast.error("Start and end date must be in the future");
      return;
    }
    if (data.startDate >= data.dueDate) {
      toast.error("End Date must be after Start Date");
      return;
    }

    assignmentMutation.mutate(data);
  };

  const minDateTime = new Date().toISOString().slice(0, 16);

  useEffect(() => {
    if (action === "edit" && id) {
      const fetchAssignment = async () => {
        const response = await axios.get(`/api/assignments/${id}`);
        const data = response.data.data;
        form.reset({
          title: data.title,
          startDate: new Date(data.startDate),
          dueDate: new Date(data.dueDate),
          subjectId: data.subjectId,
        });
      };
      fetchAssignment();
    }
  }, [action, id, form]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">
        {action === "edit" ? "Edit" : "Create"} Assignment
      </h1>
      <Form {...form}>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <Input placeholder="Enter title" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(field.value, "PPP")}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                      }}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(field.value, "PPP")}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                      }}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjectsLoading && (
                      <Loader2 className="animate-spin mx-auto" />
                    )}
                    {subjects?.map((subject: Subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {action === "edit" ? "Updating..." : "Creating..."}
              </>
            ) : action === "edit" ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ManageAssignment;
