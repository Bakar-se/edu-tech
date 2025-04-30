"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useDeviceColumns } from "./column";

const Devices = () => {
  const router = useRouter();
  const columns = useDeviceColumns();

  const fetchDevices = async () => {
    const response = await axios.get("/api/devices/getalldevices");
    const devices = response.data;

    return devices.map((device: any) => ({
      id: device.id,
      deviceId: device.deviceId,
      name: device.name || "Unnamed",
      createdAt: new Date(device.createdAt).toLocaleString(),
    }));
  };

  const {
    data: devices,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Devices</h1>
        <Button
          onClick={() => router.push("/list/devices/manage?action=create")}
          className="mb-4 flex items-center"
        >
          <PlusCircle className="mr-2" /> Register Device
        </Button>
      </div>

      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        <DataTable
          columns={columns}
          data={devices || []}
          filterableColumns={["deviceId", "name"]}
        />
      )}
    </div>
  );
};

export default Devices;
