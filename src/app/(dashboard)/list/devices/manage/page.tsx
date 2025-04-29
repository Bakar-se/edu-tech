"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const Schema = z.object({
  deviceId: z.string().min(3, "Device ID must be at least 3 characters"),
  name: z.string().optional(),
});

type FormData = z.infer<typeof Schema>;

const ManageDevice = () => {
  const router = useRouter();
  const search = useSearchParams();
  const path = search.get("action");
  const id = search.get("id");
  const [action, setAction] = React.useState<string>("create");

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchDevice = async () => {
      if (action === "edit" && id) {
        try {
          // get single teacher api
          console.log(id);
          const response = await axios.get(`/api/devices/getdevice/${id}`);
          const deviceData = response.data;
          console.log(deviceData);
          form.reset({
            name: deviceData.name || "",
            deviceId: deviceData.deviceId || "",
          });
        } catch (error) {
          console.error("Error fetching teacher:", error);
        }
      }
    };

    fetchDevice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, id]);

  const form = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      deviceId: "",
      name: "",
    },
  });

  useEffect(() => {
    if (path) setAction(path);
  }, [path]);

  const deviceMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (action === "create") {
        return await axios.post("/api/devices/create", data);
      } else if (action === "edit" && id) {
        return await axios.put(`/api/devices/update/${id}`, data);
      } else {
        throw new Error("Invalid action");
      }
    },
    onSuccess: () => {
      toast.success(
        `Device ${action === "create" ? "added" : "updated"} successfully`
      );
      router.push("/list/devices");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["devices"] });
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
    // console.log(data);
    deviceMutation.mutate(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        {action === "create" ? "Add Device" : "Edit Device"}
      </h1>
      <Form {...form}>
        <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Optional name (e.g. Front Gate)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter device ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="mt-6"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? action === "create"
                ? "Adding..."
                : "Updating..."
              : action === "create"
                ? "Add Device"
                : "Update Device"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ManageDevice;
