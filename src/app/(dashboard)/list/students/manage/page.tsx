"use client";
import { useEffect, useState } from "react";
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
import React from "react";
import { Class } from "../../classes/column";

const Schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  firstname: z
    .string()
    .min(3, { message: "First name must be at least 3 characters long" }),
  lastname: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters long" }),
  phone: z
    .string()
    .min(11, { message: "Phone number must be at least 11 characters long" }),
  address: z
    .string()
    .min(10, { message: "Address must be at least 10 characters long" }),
  birthday: z.date().refine((date) => date < new Date(), {
    message: "Birthday cannot be in the future",
  }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    message: "Blood type is required",
  }),
  parentId: z.string().min(1, { message: "Parent ID is required" }),
  classId: z.number().nullable().optional(), // Optional foreign key to Class
});
type FormData = z.infer<typeof Schema>;

const userRole =
  typeof window !== "undefined" ? localStorage.getItem("role") : null;

interface Parent {
  id: string;
  name: string;
  surname: string;
}
const ManageStudent = () => {
  const router = useRouter();
  const [action, setAction] = React.useState<string>("create");
  const search = useSearchParams();
  const path = search.get("action");
  const id = search.get("id");

  const queryClient = useQueryClient();

  const [date, setDate] = React.useState<Date>(new Date());

  // Fetch parents
  const fetchParents = async () => {
    const response = await axios.get("/api/parents/getallparents");
    return response.data.data;
  };

  // Fetch classes
  const fetchClasses = async () => {
    const response = await axios.get("/api/classes/getallclasses");
    return response.data.data;
  };

  const {
    data: parents,
    isLoading: isParentsLoading,
    isError: isParentsError,
  } = useQuery({
    queryKey: ["parents"],
    queryFn: fetchParents,
  });

  const {
    data: classes,
    isLoading: isClassesLoading,
    isError: isClassesError,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  useEffect(() => {
    const fetchStudent = async () => {
      if (action === "edit" && id) {
        try {
          const response = await axios.get(`/api/students/getstudent/${id}`);
          const studentData = response.data.data;

          const birthday = studentData.birthday
            ? new Date(studentData.birthday)
            : undefined;

          form.reset({
            firstname: studentData.firstname || "",
            lastname: studentData.lastname || "",
            username: studentData.username || "",
            email: studentData.email || "",
            password: studentData.password || "",
            phone: studentData.phone || "",
            address: studentData.address || "",
            birthday: studentData.birthday
              ? new Date(studentData.birthday)
              : undefined,
            sex: studentData.sex || undefined,
            bloodType: studentData.bloodType || undefined,
            parentId: studentData.parentId || "",
            classId: studentData.classId ?? null,
          });

          setDate(birthday || new Date());
          form.setValue("sex", studentData.sex); // Set the gender value
          form.setValue("bloodType", studentData.bloodType);
        } catch (error) {
          console.error("Error fetching student:", error);
        }
      }
    };

    fetchStudent();
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
      username: "",
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      phone: "",
      address: "",
      birthday: undefined,
      sex: undefined,
      bloodType: undefined,
      parentId: "",
      classId: null,
    },
  });

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date, months.indexOf(month));
    setDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(date, parseInt(year));
    setDate(newDate);
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      form.setValue("birthday", selectedDate);
    }
  };

  const studentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        birthday: data.birthday
          ? new Date(data.birthday).toISOString()
          : undefined,
      };

      if (action === "create") {
        return await axios.post("/api/students/create", data);
      } else if (action === "edit" && id) {
        return await axios.put(`/api/students/update/${id}`, data);
      } else {
        throw new Error("Invalid action");
      }
    },
    onSuccess: () => {
      toast.success(
        `Student ${action === "create" ? "created" : "updated"} successfully!`
      );

      if (userRole === "admin") {
        router.push("/list/students");
      } else if (userRole === "student" && id) {
        router.push(`/list/students/profile?id=${id}`);
      } else {
        router.push("/list/students");
      }

      form.reset();
      queryClient.invalidateQueries({ queryKey: ["students"] });
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
    studentMutation.mutate(data);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const startYear = getYear(new Date()) - 100;
  const endYear = getYear(new Date()) + 100;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  return (
    <div className="p-4">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {action === "create" ? "Create Student" : "Edit Student"}
      </h1>

      <Form {...form}>
        <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="firstname"
                render={() => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Type here"
                      {...form.register("firstname")}
                    />
                    <FormMessage>
                      {form.formState.errors.firstname?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="lastname"
                render={() => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Type here"
                      {...form.register("lastname")}
                    />
                    <FormMessage>
                      {form.formState.errors.lastname?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="username"
                render={() => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      placeholder="Type here"
                      {...form.register("username")}
                    />
                    <FormMessage>
                      {form.formState.errors.username?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="email"
                render={() => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Type here"
                      {...form.register("email")}
                    />
                    <FormMessage>
                      {form.formState.errors.email?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="password"
                render={() => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="text"
                      placeholder="Type here"
                      {...form.register("password")}
                    />
                    <FormMessage>
                      {form.formState.errors.password?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="phone"
                render={() => (
                  <FormItem>
                    <FormLabel>Phone #</FormLabel>
                    <Input
                      type="text"
                      placeholder="Type here"
                      {...form.register("phone")}
                    />
                    <FormMessage>
                      {form.formState.errors.phone?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="address"
                render={() => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <Input
                      type="text"
                      placeholder="Type here"
                      {...form.register("address")}
                    />
                    <FormMessage>
                      {form.formState.errors.address?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="birthday"
                render={() => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <div className="flex justify-between p-2">
                          <Select
                            onValueChange={handleMonthChange}
                            value={months[getMonth(date)]}
                          >
                            <SelectTrigger className="w-[110px]">
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            onValueChange={handleYearChange}
                            value={getYear(date).toString()}
                          >
                            <SelectTrigger className="w-[110px]">
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleSelect}
                          initialFocus
                          month={date}
                          onMonthChange={setDate}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage>
                      {form.formState.errors.birthday?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isParentsLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin flex justify-center" />
                        )}
                        {parents?.map((parent: Parent) => (
                          <SelectItem key={parent.id} value={parent.id}>
                            {`${parent.name} ${parent.surname}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {form.formState.errors.parentId?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {form.formState.errors.sex?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {form.formState.errors.bloodType?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <FormControl>
                    {isClassesLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Loading classes...</span>
                      </div>
                    ) : isClassesError ? (
                      <div className="text-red-500">Failed to load classes.</div>
                    ) : (
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls: Class) => (
                            <SelectItem key={cls.id} value={cls.id.toString()}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>

                      </Select>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default ManageStudent;
