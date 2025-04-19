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
});
type FormData = z.infer<typeof Schema>;

const ManageTeacher = () => {
  const router = useRouter();
  const [action, setAction] = React.useState<string>("create");
  const search = useSearchParams();
  const path = search.get("action");
  const id = search.get("id");
  console.log(path, id);

  const [date, setDate] = React.useState<Date>(new Date());

  useEffect(() => {
    const fetchTeacher = async () => {
      if (action === "edit" && id) {
        try {
          const response = await axios.get(`/api/teachers/getteacher/${id}`);
          const teacherData = response.data.data;

          // Convert birthday string to Date object if it exists
          const birthday = teacherData.birthday
            ? new Date(teacherData.birthday)
            : undefined;
          console.log(teacherData);
          // Reset form values with the fetched data
          form.reset({
            username: teacherData.username || "",
            firstname: teacherData.name || "",
            lastname: teacherData.surname || "",
            email: teacherData.email || "",
            phone: teacherData.phone || "",
            address: teacherData.address || "",
            bloodType: teacherData.bloodType || "",
            password: teacherData.password || "",
            sex: teacherData.sex || undefined,
            birthday: birthday,
          });
          setDate(birthday || new Date());
          form.setValue("sex", teacherData.sex); // Set the gender value
          form.setValue("bloodType", teacherData.bloodType);
        } catch (error) {
          console.error("Error fetching teacher:", error);
        }
      }
    };

    fetchTeacher();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id]);

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

  const handleSelect = (selectedData: Date | undefined) => {
    if (selectedData) {
      setDate(selectedData);
      form.setValue("birthday", selectedData);
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log(data);
    try {
      let response;
      if (action === "create") {
        // Create teacher
        response = await axios.post("/api/teachers/create", data);
        toast.success("Teacher created successfully!");
        router.push("/list/teachers");
      } else if (action === "edit" && id) {
        // Update teacher (ensure id exists)
        response = await axios.put(`/api/teachers/update/${id}`, data);
        toast.success("Teacher updated successfully!");
        router.push("/list/teachers");
      } else {
        throw new Error("Invalid action");
      }

      console.log("API response:", response.data);
      form.reset(); // Reset the form after submission
    } catch (error: any) {
      console.error("Error submitting data:", error);

      // Extract the most specific error message
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "An unexpected error occurred";

      toast.error(message);
    }
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

export default ManageTeacher;
