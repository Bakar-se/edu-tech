"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeviceColumns } from "./columns";
import axios from "axios";
import { toast } from "sonner"; // or any toast library you use
import { useQuery } from "@tanstack/react-query";

const DevicesList = () => {
  const router = useRouter();
  const columns = useDeviceColumns();

  const fetchDevices = async () => {
    const response = await axios.get("/api/devices/getalldevices");
    console.log(response.data);
    return response.data;
  };

  const {
    data: devices,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
  });

  console.log(devices);
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Devices</h1>
        <Button
          className="mb-4 flex items-center"
          onClick={() => router.push("/list/devices/manage?action=create")}
        >
          <PlusCircle /> Register Device
        </Button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          data={devices}
          filterableColumns={["name", "deviceId"]}
        />
      )}
    </div>
  );
};

export default DevicesList;
