"use client";
import React, { useEffect, useState } from "react";
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
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(100, { message: "Title must be at most 100 characters long" }),

    description: z
        .string()
        .min(10, { message: "Description must be at least 10 characters long" }),

    startTime: z
        .date({ required_error: "Start time is required" })
        .refine((date) => date > new Date(), {
            message: "Start time must be in the future",
        }),

    endTime: z
        .date({ required_error: "End time is required" })
        .refine((date) => date > new Date(), {
            message: "End time must be in the future",
        }),

    classId: z
        .number()
        .optional()
        .nullable()
        .refine((id) => id === null || id === undefined || id >= 1, {
            message: "Invalid class ID",
        }),
});

type FormData = z.infer<typeof Schema>;

const ManageEvent = () => {
    const router = useRouter();
    const [action, setAction] = React.useState<string>("create");
    const search = useSearchParams();
    const path = search.get("action");
    const id = search.get("id");

    const queryClient = useQueryClient();

    const form = useForm<FormData>({
        resolver: zodResolver(Schema),
        defaultValues: {
            title: "",
            description: "",
            startTime: undefined,
            endTime: undefined,
            classId: null,
        },
    });

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

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

    useEffect(() => {
        const fetchEvent = async () => {
            if (action === "edit" && id) {
                try {
                    const response = await axios.get(`/api/events/getevent/${id}`);
                    const eventData = response.data.data;

                    const startTime = eventData.startTime ? new Date(eventData.startTime) : new Date();
                    const endTime = eventData.endTime ? new Date(eventData.endTime) : new Date();

                    form.reset({
                        title: eventData.title || "",
                        description: eventData.description || "",
                        startTime,
                        endTime,
                        classId: eventData.classId ?? null,
                    });

                    setStartDate(startTime);
                    setEndDate(endTime);
                } catch (error) {
                    console.error("Error fetching event:", error);
                }
            }
        };

        fetchEvent();
    }, [action, id, form]);

    const handleMonthChange = (month: string, isStart = true) => {
        const newDate = setMonth(isStart ? startDate : endDate, months.indexOf(month));
        isStart ? setStartDate(newDate) : setEndDate(newDate);
        form.setValue(isStart ? "startTime" : "endTime", newDate);
    };

    const handleYearChange = (year: string, isStart = true) => {
        const newDate = setYear(isStart ? startDate : endDate, parseInt(year));
        isStart ? setStartDate(newDate) : setEndDate(newDate);
        form.setValue(isStart ? "startTime" : "endTime", newDate);
    };

    const handleSelect = (selectedData: Date | undefined, isStart = true) => {
        if (selectedData) {
            isStart ? setStartDate(selectedData) : setEndDate(selectedData);
            form.setValue(isStart ? "startTime" : "endTime", selectedData);
        }
    };

    const eventMutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (action === "create") {
                return await axios.post("/api/events/create", data);
            } else if (action === "edit" && id) {
                return await axios.put(`/api/events/update/${id}`, data);
            } else {
                throw new Error("Invalid action");
            }
        },
        onSuccess: () => {
            toast.success(`Event ${action === "create" ? "created" : "updated"} successfully!`);
            router.push("/list/events");
            form.reset();
            queryClient.invalidateQueries({ queryKey: ["events"] });
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
        eventMutation.mutate(data);
    };

    return (
        <div className="p-4">
            <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {action === "create" ? "Create Event" : "Edit Event"}
            </h1>

            <Form {...form}>
                <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Event Title</FormLabel>
                                    <Input placeholder="Enter title" {...form.register("title")} />
                                    <FormMessage>{form.formState.errors.title?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="Event description"
                                        {...form.register("description")}
                                    />
                                    <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="startTime"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <div className="flex justify-between p-2">
                                                <Select value={months[getMonth(startDate)]} onValueChange={(m) => handleMonthChange(m, true)}>
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
                                                <Select value={getYear(startDate).toString()} onValueChange={(y) => handleYearChange(y, true)}>
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
                                            <Calendar mode="single" selected={startDate} onSelect={(d) => handleSelect(d, true)} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage>{form.formState.errors.startTime?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endTime"
                            render={() => (
                                <FormItem>
                                    <FormLabel>End Time</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <div className="flex justify-between p-2">
                                                <Select value={months[getMonth(endDate)]} onValueChange={(m) => handleMonthChange(m, false)}>
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
                                                <Select value={getYear(endDate).toString()} onValueChange={(y) => handleYearChange(y, false)}>
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
                                            <Calendar mode="single" selected={endDate} onSelect={(d) => handleSelect(d, false)} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage>{form.formState.errors.endTime?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="mt-4" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {action === "create" ? "Creating..." : "Updating..."}
                            </>
                        ) : action === "create" ? "Create" : "Update"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ManageEvent;
