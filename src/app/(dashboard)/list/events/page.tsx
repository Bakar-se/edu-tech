"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner"; // or any toast library you use
import { useQuery } from "@tanstack/react-query";
import { useEventColumns } from "./column";
import { eventsData } from "@/lib/data";

const StudentList = () => {
  const router = useRouter();
  const columns = useEventColumns();

  const fetchEvents = async () => {
    const response = await axios.get("/api/events/getallevents");
    return response.data.data;
  };

  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
  console.log(events)
  return (
    <div className="container mx-auto px-4 py-10">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-semibold mb-4">Events</h1>
        <Button
          className="mb-4 flex items-center"
          onClick={() => router.push("/list/events/manage?action=create")}
        >
          <PlusCircle /> Register Event</Button>
      </div>
      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        <DataTable
          columns={columns}
          data={events}
          filterableColumns={["title", "class", "date", "startTime", "endTime"]}
        />)}
    </div>
  )
}

export default StudentList
