"use client";
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import { Performance } from "@/components/Performance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { convertToCalendarEvents } from "@/lib/convertToCalendarEvents";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Calendar,
  Droplet,
  Mail,
  MailIcon,
  Phone,
  Presentation,
  Shapes,
  Split,
  UserRoundCheck,
} from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export interface Teacher {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img: string | null;
  bloodType: string;
  sex: "MALE" | "FEMALE";
  createdAt: string; // ISO date string
  birthday: string; // ISO date string
  password: string;
  subjects: any[]; // You can replace 'any' with a proper Subject type if available
  classes: any[]; // You can replace 'any' with a proper Class type if available
  lessons: any[]; // You can replace 'any' with a proper Lesson type if available
}

const SingleTeacherPage = () => {
  const search = useSearchParams();
  const id = search.get("id");
  const [teacher, setTeacher] = useState<Teacher>();

  useEffect(() => {
    const fetchTeacher = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/teachers/getteacher/${id}`);
          const teacherData = response.data.data;
          setTeacher(teacherData);
          console.log(teacherData);
        } catch (error) {
          console.error("Error fetching teacher:", error);
        }
      }
    };

    fetchTeacher();
  }, [id]);

  const events = convertToCalendarEvents(teacher?.lessons || []);
  console.log(events);
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* USER INFO CARD */}
        <Card className="flex-1">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex justify-center items-center">
              <Avatar className="w-40 h-40 border-2 border-border">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>LS</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col justify-between gap-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <h1 className="text-xl font-semibold">{`${teacher?.name} ${teacher?.surname}`}</h1>
              </div>
              {/* <p className="text-sm text-muted-foreground">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-medium">
                <div className="flex justify-center md:justify-start items-center gap-2">
                  <Droplet className="h-4 w-4 text-primary" />
                  <span>{teacher?.bloodType}</span>
                </div>
                <div className="flex justify-center md:justify-start items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>
                    {teacher?.birthday
                      ? moment(teacher.birthday).format("DD MMMM YYYY")
                      : ""}
                  </span>
                </div>
                <div className="flex justify-center md:justify-start items-center gap-2 w-full">
                  <MailIcon className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate w-full">{teacher?.email}</span>
                </div>
                <div className="flex justify-center md:justify-start items-center gap-2 w-full">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate w-full">{teacher?.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMALL CARDS */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ATTENDANCE CARD */}
          <Card className="col-span-2">
            <CardContent className="p-4 flex items-center gap-4">
              <UserRoundCheck className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">90%</h2>
                <span className="text-sm text-muted-foreground">
                  Attendance
                </span>
              </div>
            </CardContent>
          </Card>

          {/* LESSONS CARD */}
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <Presentation className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">6</h2>
                <span className="text-sm text-muted-foreground">Lessons</span>
              </div>
            </CardContent>
          </Card>

          {/* CLASSES CARD */}
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <Shapes className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">6</h2>
                <span className="text-sm text-muted-foreground">Classes</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
          {/* TOP */}

          {/* BOTTOM */}
          <div className="mt-4 bg-white rounded-md p-4 h-full">
            <h1 className="leading-none font-semibold">
              Teacher&apos;s Schedule
            </h1>
            <BigCalendar events={events} />
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
          <div className=" rounded-md">
            <h1 className="text-xl font-semibold">Shortcuts</h1>
            <Card className="p-4">
              <div className="flex gap-4 flex-wrap text-xs text-gray-500">
                <Link className="" href="/">
                  <Badge>Teacher&apos;s Classes</Badge>
                </Link>
                <Link className="" href="/">
                  <Badge>Teacher&apos;s Students</Badge>
                </Link>
                <Link className="" href="/">
                  <Badge>Teacher&apos;s Lessons</Badge>
                </Link>
                <Link className="" href="/">
                  <Badge>Teacher&apos;s Exams</Badge>
                </Link>
                <Link className="" href="/">
                  <Badge>Teacher&apos;s Assignments</Badge>
                </Link>
              </div>
            </Card>
          </div>
          <Performance />
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default SingleTeacherPage;
