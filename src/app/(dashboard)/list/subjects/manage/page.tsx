"use client";
import React, { useEffect, useState } from "react";
import moment from "moment"; // Import moment
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Loader2, ChevronsUpDown, XCircle } from "lucide-react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils"; // assuming you have a cn utility
import { Teacher } from "../../teachers/columns";
import { Badge } from "@/components/ui/badge";

const subjectSchema = z.object({
  name: z.string().min(3, "Subject name is required"),
  teacherIds: z.array(z.string().min(1, "Teacher ID is required")),
  startTime: z.string().min(1, "Start time is required"), // Add startTime
  endTime: z.string().min(1, "End time is required"), // Add endTime
});

type SubjectSchema = z.infer<typeof subjectSchema>;

const ManageSubject = () => {
  const router = useRouter();
  const search = useSearchParams();
  const path = search.get("action");
  const id = search.get("id");

  const [action, setAction] = useState<string>("create");

  const queryClient = useQueryClient();
  const form = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      teacherIds: [],
      startTime: moment().format("YYYY-MM-DDTHH:mm"), // Set default start time to current date/time
      endTime: moment().add(1, "hour").format("YYYY-MM-DDTHH:mm"), // Set default end time 1 hour after start time
    },
  });

  const fetchTeachers = async () => {
    const response = await axios.get("/api/teachers/getallteachers");
    return response.data.data;
  };

  const {
    data: teachers = [],
    isLoading: isTeachersLoading,
    isError: isTeachersError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  useEffect(() => {
    setAction(path || "create");
    const fetchSubject = async () => {
      if (action === "edit" && id) {
        try {
          const response = await axios.get(`/api/subjects/getsubject/${id}`);
          const subject = response.data.data;
          form.setValue("name", subject.name || "");
          form.setValue(
            "teacherIds",
            subject.teachers?.map((t: Teacher) => t.id) || []
          );
          form.setValue(
            "startTime",
            moment(subject.startTime).format("YYYY-MM-DDTHH:mm")
          );
          form.setValue(
            "endTime",
            moment(subject.endTime).format("YYYY-MM-DDTHH:mm")
          );
        } catch (error) {
          console.error("Error fetching subject:", error);
        }
      }
    };

    fetchSubject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id]);

  const subjectMutation = useMutation({
    mutationFn: async (data: SubjectSchema) => {
      if (action === "create") {
        console.log(data);
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
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      router.push("/list/subjects");
      form.reset();
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
      <h1 className="text-2xl font-semibold mb-6">
        {action === "create" ? "Create Subject" : "Edit Subject"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Subject Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subject name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Multi-select Teachers */}
          <FormField
            control={form.control}
            name="teacherIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teachers</FormLabel>
                <FormControl>
                  {isTeachersLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span>Loading teachers...</span>
                    </div>
                  ) : isTeachersError ? (
                    <div className="text-red-500">Failed to load teachers.</div>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value.length && "text-muted-foreground"
                          )}
                        >
                          {/* Show selected teachers as chips */}
                          {field.value.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {teachers
                                .filter((teacher: any) =>
                                  field.value.includes(teacher.id)
                                )
                                .map((teacher: any) => (
                                  <Badge
                                    key={teacher.id}
                                    className="flex items-center gap-2 px-2 py-1 rounded-md"
                                  >
                                    {teacher.name} {teacher.surname}
                                  </Badge>
                                ))}
                            </div>
                          ) : (
                            "Select teachers"
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search teacher..." />
                          <CommandList>
                            {teachers.map((teacher: Teacher) => (
                              <CommandItem
                                key={teacher.id}
                                onSelect={() => {
                                  const isSelected = field.value.includes(
                                    teacher.id
                                  );
                                  if (isSelected) {
                                    field.onChange(
                                      field.value.filter(
                                        (id) => id !== teacher.id
                                      )
                                    );
                                  } else {
                                    field.onChange([
                                      ...field.value,
                                      teacher.id,
                                    ]);
                                  }
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={field.value.includes(teacher.id)}
                                    onCheckedChange={() => {
                                      const isSelected = field.value.includes(
                                        teacher.id
                                      );
                                      if (isSelected) {
                                        field.onChange(
                                          field.value.filter(
                                            (id) => id !== teacher.id
                                          )
                                        );
                                      } else {
                                        field.onChange([
                                          ...field.value,
                                          teacher.id,
                                        ]);
                                      }
                                    }}
                                  />
                                  {teacher.name} {teacher.surname}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Time */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    placeholder="Select start time"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Time */}
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    placeholder="Select end time"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
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
