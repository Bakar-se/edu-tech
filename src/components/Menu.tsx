import { Book, BookA, BookCheck, BookOpenCheck, Calendar, CircleUserRound, FileUser, House, ListCheck, LogOut, Megaphone, MessageCircle, PersonStanding, Presentation, Settings, UserRoundPen, UsersRound } from "lucide-react";

export const menuItems = [
    {
        title: "MENU",
        items: [
            {
                icon: <House />,
                label: "Home",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: <UserRoundPen />,
                label: "Teachers",
                href: "/list/teachers",
                visible: ["admin", "teacher"],
            },
            {
                icon: <PersonStanding />,
                label: "Students",
                href: "/list/students",
                visible: ["admin", "teacher"],
            },
            {
                icon: <UsersRound />,
                label: "Parents",
                href: "/list/parents",
                visible: ["admin", "teacher"],
            },
            {
                icon: <Book />,
                label: "Subjects",
                href: "/list/subjects",
                visible: ["admin"],
            },
            {
                icon: <Presentation />,
                label: "Classes",
                href: "/list/classes",
                visible: ["admin", "teacher"],
            },
            {
                icon: <BookCheck />,
                label: "Lessons",
                href: "/list/lessons",
                visible: ["admin", "teacher"],
            },
            {
                icon: <BookOpenCheck />,
                label: "Exams",
                href: "/list/exams",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: <BookA />,
                label: "Assignments",
                href: "/list/assignments",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: <FileUser />,
                label: "Results",
                href: "/list/results",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: <ListCheck />,
                label: "Attendance",
                href: "/list/attendance",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: <Calendar />,
                label: "Events",
                href: "/list/events",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: <MessageCircle />,
                label: "Messages",
                href: "/list/conversations",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: <Megaphone />,
                label: "Announcements",
                href: "/list/announcements",
                visible: ["admin", "teacher", "student", "parent"],
            },
        ],
    },
    {
        title: "OTHER",
        items: [
            {
                icon: <CircleUserRound />,
                label: "Profile",
                href: "/profile",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: <Settings />,
                label: "Settings",
                href: "/settings",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: <LogOut />,
                label: "Logout",
                href: "/logout",
                visible: ["admin", "teacher", "student", "parent"],
            },
        ],
    },
];
