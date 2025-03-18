import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import { Performance } from "@/components/Performance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Droplet, Mail, Phone, Presentation, Shapes, Split, UserRoundCheck } from "lucide-react";
import Link from "next/link";

const SingleStudentPage = () => {
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <Card>
          <div className="py-6 px-4 rounded-md flex-1 flex flex-col md:flex-row items-center gap-4">
            <div className="w-1/3 flex justify-center items-center">
              <Avatar className="w-40 h-40">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 text-center md:text-left">
                <h1 className="text-xl font-semibold ">Leonard Snyder</h1>
                {/* {role === "admin" && <FormModal
                  table="teacher"
                  type="update"
                  data={{
                    id: 1,
                    username: "deanguerrero",
                    email: "deanguerrero@gmail.com",
                    password: "password",
                    firstName: "Dean",
                    lastName: "Guerrero",
                    phone: "+1 234 567 89",
                    address: "1234 Main St, Anytown, USA",
                    bloodType: "A+",
                    dateOfBirth: "2000-01-01",
                    sex: "male",
                    img: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200",
                  }}
                />} */}
              </div>
              <p className="text-sm text-gray-500">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="flex w-full items-center gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex justify-center md:justify-start items-center gap-2">
                  <Droplet width={14} height={14} />
                  <span>A+</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex justify-center md:justify-start items-center gap-2">
                  <Calendar width={14} height={14} />
                  <span>January 2025</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex justify-center md:justify-start items-center gap-2">
                  <Mail width={14} height={14} />
                  <span>user@gmail.com</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex justify-center md:justify-start items-center gap-2">
                  <Phone width={14} height={14} />
                  <span>+1 234 567</span>
                </div>
              </div>
            </div>
          </div>
          </Card>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <Card className="w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
            <div className=" p-4 rounded-md flex items-center gap-4">
              <UserRoundCheck
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            </Card>
            {/* CARD */}
            <Card className="w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
            <div className=" p-4 rounded-md flex items-center gap-4">
              <Split
                width={24}
                height={24}
              />
              <div className="">
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            </Card>
            {/* CARD */}
            <Card className="w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
            <div className="p-4 rounded-md flex items-center gap-4 ">
              <Presentation
                width={24}
                height={24}
              />
              <div className="">
                <h1 className="text-xl font-semibold">18</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            </Card>
            {/* CARD */}
            <Card className="w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
            <div className="p-4 rounded-md flex items-center gap-4">
              <Shapes
                width={24}
                height={24}
              />
              <div className="">
                <h1 className="text-xl font-semibold">6A</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
            </Card>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className=" rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <Card className="p-4">
          <div className="flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="" href="/">
              <Badge>Student&apos;s Classes</Badge>
            </Link>
            <Link className="" href="/">
              <Badge>Student&apos;s Lessons</Badge>
            </Link>
            <Link className="" href="/">
              <Badge>Student&apos;s Exams</Badge>
            </Link>
            <Link className="" href="/">
              <Badge>Student&apos;s Assignments</Badge>
            </Link>
          </div>
          </Card>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
