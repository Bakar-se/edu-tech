"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
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
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Teacher {
  id: string;
  name: string;
  surname: string;
}

const Schema = z.object({
  name: z
    .string()
    .min(3, { message: "name must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  capacity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: "Capacity must be at least 1" })
  ),
  gradeId: z.number().nullable(),
  supervisorId: z.string(),
});
type FormData = z.infer<typeof Schema>;

const ManageClass = () => {
  const router = useRouter();
  const [action, setAction] = React.useState<string>("create");
  const search = useSearchParams();
  const path = search.get("action");
  const id = search.get("id");

  const fetchTeachers = async () => {
    const response = await axios.get("/api/teachers/getallteachers");
    return response.data.data;
  };

  const {
    data: teachers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  console.log(teachers);

  const queryClient = useQueryClient();

  const [date, setDate] = React.useState<Date>(new Date());

  useEffect(() => {
    const fetchTeacher = async () => {
      if (action === "edit" && id) {
        try {
          // get single teacher api
          const response = await axios.get(`/api/classes/getsingleclass/${id}`);
          const classData = response.data.data;
          console.log(classData);

          // Convert birthday string to Date object if it exists
          const birthday = classData.birthday
            ? new Date(classData.birthday)
            : undefined;
          console.log(classData);
          // Reset form values with the fetched data
          form.reset({
            name: classData.name || "",
            capacity: classData.capacity || 0,
            supervisorId: classData.supervisorId || "",
            gradeId: classData.gradeId !== null ? classData.gradeId : 0,
          });
        } catch (error) {
          console.error("Error fetching teacher:", error);
        }
      }
    };

    fetchTeacher();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id]);

  useEffect(() => {
    if (path) {
      setAction(path);
    }
  }, [path]);

  const form = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      capacity: 0,
      supervisorId: "",
      gradeId: null,
    },
  });

  const classMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (action === "create") {
        // create class api
        console.log(data);
        return await axios.post("/api/classes/create", data);
      } else if (action === "edit" && id) {
        // update class api
        return await axios.put(`/api/classes/update/${id}`, data);
      } else {
        throw new Error("Invalid action");
      }
    },
    onSuccess: () => {
      toast.success(
        `Class ${action === "create" ? "created" : "updated"} successfully!`
      );
      router.push("/list/classes");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["classes"] });
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

  // Usage
  const onSubmit = (data: FormData) => {
    classMutation.mutate(data);
  };

  return (
    <div className="p-4">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {action === "create" ? "Create Teacher" : "Edit Teacher"}
      </h1>

      <Form {...form}>
        <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="name"
                render={() => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Type here"
                      {...form.register("name")}
                    />
                    <FormMessage>
                      {form.formState.errors.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="capacity"
                render={() => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <Input
                      type="number"
                      placeholder="Type here"
                      {...form.register("capacity")}
                    />
                    <FormMessage>
                      {form.formState.errors.capacity?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="gradeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          "A+",
                          "A",
                          "A-",
                          "B+",
                          "B",
                          "B-",
                          "C+",
                          "C",
                          "C-",
                          "D+",
                          "D",
                          "D-",
                          "E",
                          "F",
                        ].map((type, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {form.formState.errors.gradeId?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="supervisorId"
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
                        {isLoading && (
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
                      {form.formState.errors.supervisorId?.message}
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

export default ManageClass;
