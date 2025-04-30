"use client";
import React, { useEffect, useState } from "react";
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { convertToCalendarEvents } from "@/lib/convertToCalendarEvents";

const Parent = () => {
  const [parent, setParent] = useState<any>(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchParent = async () => {
      if (userId) {
        try {
          const response = await axios.get(`/api/parents/getparent/${userId}`);
          const parentData = response.data.data;
          setParent(parentData);
        } catch (error) {
          console.error("Error fetching parent:", error);
        }
      }
    };

    fetchParent();
  }, [userId]);
  console.log(parent);
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      <div className="w-full xl:w-2/3">
        <h1 className="text-2xl font-bold mb-6">Schedules</h1>
        {parent?.students?.map((student: any) => {
          // Enrich lesson data with dummy subject/class fields
          const lessons = (student.class?.lessons || []).map((lesson: any) => ({
            ...lesson,
            subject: {
              id: lesson.subjectId,
              name: lesson.subject.name, // Replace with real name if available
            },
            class: {
              id: student.class?.id,
              name: student.class?.name,
              capacity: student.class?.capacity,
              supervisorId: student.class?.supervisorId,
            },
          }));

          const events = convertToCalendarEvents(lessons);

          return (
            <div key={student.id} className="mb-10">
              <h2 className="text-xl font-semibold mb-2">
                {student.name}&apos;s Schedule
              </h2>
              <BigCalendar events={events} />
            </div>
          );
        })}
      </div>
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default Parent;
