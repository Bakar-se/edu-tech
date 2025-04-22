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
  name: z
    .string()
    .min(3, { message: "Device name must be at least 3 characters long" })
    .max(20, { message: "Device name must be at most 20 characters long" }),
  deviceId: z
    .string()
    .min(3, { message: "Device ID must be at least 3 characters long" }),
});
type FormData = z.infer<typeof Schema>;

const ManageDevice = () => {
  const router = useRouter();
  const [action, setAction] = React.useState<string>("create");
  const search = useSearchParams();
  const path = search.get("action");
  const id = search.get("id");
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchDevice = async () => {
      if (action === "edit" && id) {
        try {
          const response = await axios.get(
            `/api/devices/getsingledevice/${id}`
          );
          const deviceData = response.data;

          console.log(deviceData);
          // Reset form values with the fetched data
          form.reset({
            name: deviceData.name || "",
            deviceId: deviceData.deviceId || "",
          });
        } catch (error) {
          console.error("Error fetching device:", error);
        }
      }
    };

    fetchDevice();
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
      deviceId: "",
    },
  });

  const deviceMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (action === "create") {
        console.log(data);
        return await axios.post("/api/devices/create", data);
      } else if (action === "edit" && id) {
        return await axios.put(`/api/devices/update/${id}`, data);
      } else {
        throw new Error("Invalid action");
      }
    },
    onSuccess: () => {
      toast.success(
        `Device ${action === "create" ? "created" : "updated"} successfully!`
      );
      router.push("/list/devices");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["device"] });
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
    deviceMutation.mutate(data);
  };

  return (
    <div className="p-4">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {action === "create" ? "Create Device" : "Edit Device"}
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
                    <FormLabel>Device Name</FormLabel>
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
                name="deviceId"
                render={() => (
                  <FormItem>
                    <FormLabel>Device ID</FormLabel>
                    <Input
                      type="text"
                      placeholder="Type here"
                      {...form.register("deviceId")}
                    />
                    <FormMessage>
                      {form.formState.errors.deviceId?.message}
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

export default ManageDevice;
