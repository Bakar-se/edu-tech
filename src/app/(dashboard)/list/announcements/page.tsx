"use client";
import { announcementsData } from '@/lib/data';
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAnnouncementColumns } from './column';
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";

const AnnouncementList = () => {
  const router = useRouter();
  const columns = useAnnouncementColumns();

  const fetchAnnouncements = async () => {
    const response = await axios.get("/api/announcements/getallannouncements");
    return response.data.data;
  };

  const {
    data: announcements,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["announcements"],
    queryFn: fetchAnnouncements,
  });
  console.log(announcements)

  return (
    <div className="container mx-auto px-4 py-10">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-semibold mb-4">Announcements</h1>
        <Button className='mb-4 flex items-center'
          onClick={() => router.push("/list/announcements/manage?action=create")}
        ><PlusCircle className="mr-2" /> Register Announcement</Button>
      </div>
      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        <DataTable
          columns={columns}
          data={announcements}
          filterableColumns={["title", "classId", "date"]}
        />)}
    </div>
  )
};

export default AnnouncementList
