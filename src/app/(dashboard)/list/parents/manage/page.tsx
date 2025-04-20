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
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

    birthday: z
        .union([z.date(), z.string().transform((val) => new Date(val))])
        .optional()
        .refine((date) => !date || date < new Date(), {
            message: "Birthday cannot be in the future",
        }),

    sex: z.enum(["MALE", "FEMALE"]).optional(),

    bloodType: z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .optional(),

    occupation: z.string().optional(),

    relationship: z.string().optional(), // optional field for parent/guardian relationship

    emergencyContact: z.string().optional(), // optional field for emergency contact

    nationality: z.string().optional(), // optional field for nationality
});

type FormData = z.infer<typeof Schema>;


const ManageParent = () => {
    const router = useRouter();
    const [action, setAction] = React.useState<string>("create");
    const search = useSearchParams();
    const path = search.get("action");
    const id = search.get("id");
    console.log(path, id);

    const queryClient = useQueryClient();

    const [date, setDate] = React.useState<Date>(new Date());

    useEffect(() => {
        const fetchParent = async () => {
            if (action === "edit" && id) {
                try {
                    // get single parent api
                    const response = await axios.get(`/api/parents/getparent/${id}`);
                    const parentData = response.data.data;

                    // Convert birthday string to Date object if it exists
                    const birthday = parentData.birthday
                        ? new Date(parentData.birthday)
                        : undefined;
                    console.log(parentData);
                    // Reset form values with the fetched data
                    form.reset({
                        username: parentData.username || "",
                        firstname: parentData.name || "",
                        lastname: parentData.surname || "",
                        email: parentData.email || "",
                        phone: parentData.phone || "",
                        address: parentData.address || "",
                        occupation: parentData.occupation || "",
                        relationship: parentData.relationship || "",
                        sex: parentData.sex || undefined,
                        birthday: parentData.birthday || "", // optional but good for records
                        password: parentData.password || "",
                        emergencyContact: parentData.emergencyContact || "", // different from personal phone
                        nationality: parentData.nationality || "",
                        bloodType: parentData.bloodType || "",
                    });

                    setDate(birthday || new Date());
                    form.setValue("sex", parentData.sex); // Set the gender value
                    form.setValue("bloodType", parentData.bloodType);
                } catch (error) {
                    console.error("Error fetching parent:", error);
                }
            }
        };

        fetchParent();
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
            username: "", // Default value for the username
            email: "", // Default value for the email
            password: "", // Default value for the password
            firstname: "", // Default value for the first name
            lastname: "", // Default value for the last name
            phone: "", // Default value for the phone number
            address: "", // Default value for the address
            birthday: undefined, // The birthday is optional, can be undefined
            sex: undefined, // The sex is optional, can be undefined
            bloodType: undefined, // The blood type is optional, can be undefined
            occupation: "", // Occupation is optional, empty string if not set
            relationship: "", // Relationship is optional, empty string if not set
            emergencyContact: "", // Emergency contact is optional, empty string if not set
            nationality: "", // Nationality is optional, empty string if not set
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

    const parentMutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (action === "create") {
                // create parent api
                return await axios.post("/api/parents/create", data);
            } else if (action === "edit" && id) {
                // update parent api
                return await axios.put(`/api/parents/update/${id}`, data);
            } else {
                throw new Error("Invalid action");
            }
        },
        onSuccess: () => {
            toast.success(
                `Parent ${action === "create" ? "created" : "updated"} successfully!`
            );
            router.push("/list/parents");
            form.reset();
            queryClient.invalidateQueries({ queryKey: ["parents"] });
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
        parentMutation.mutate(data);
    };

    return (
        <div className="p-4">
            <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {action === "create" ? "Create Parent" : "Edit Parent"}
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
                                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <div className="flex justify-between p-2">
                                                    <Select onValueChange={handleMonthChange} value={months[getMonth(date)]}>
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
                                                    <Select onValueChange={handleYearChange} value={getYear(date).toString()}>
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
                                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage>
                                            {form.formState.errors.bloodType?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Additional fields */}
                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="occupation"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Occupation</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Type here"
                                            {...form.register("occupation")}
                                        />
                                        <FormMessage>
                                            {form.formState.errors.occupation?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="relationship"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Relationship</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Type here"
                                            {...form.register("relationship")}
                                        />
                                        <FormMessage>
                                            {form.formState.errors.relationship?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="emergencyContact"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Emergency Contact</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Type here"
                                            {...form.register("emergencyContact")}
                                        />
                                        <FormMessage>
                                            {form.formState.errors.emergencyContact?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="nationality"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Nationality</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Type here"
                                            {...form.register("nationality")}
                                        />
                                        <FormMessage>
                                            {form.formState.errors.nationality?.message}
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

export default ManageParent;
