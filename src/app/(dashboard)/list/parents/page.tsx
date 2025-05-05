"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { parentsData } from "@/lib/data";
import { useParentColumns } from "./column";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

const ParentList = () => {
  const router = useRouter();
  const columns = useParentColumns();
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

  const fetchParents = async () => {
    const response = await axios.get("/api/parents/getallparents");
    return response.data.data;
  };

  const {
    data: parents,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["parents"],
    queryFn: fetchParents,
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Parents</h1>
        {role === "admin" && (
          <Button
            className="mb-4 flex items-center"
            onClick={() => router.push("/list/parents/manage?action=create")}
          >
            <PlusCircle className="mr-2" /> Register Parent
          </Button>
        )}
      </div>

      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        <DataTable
          columns={columns}
          data={parents}
          filterableColumns={["name", "email", "students", "phone"]}
        />
      )}
    </div>
  );
};

export default ParentList;
