import { Event } from "react-big-calendar"; // Import Event type from react-big-calendar

interface ClassData {
  id: string;
  startTime: string;
  endTime: string;
  day: string[];
  subjectId: string;
  teacherId: string;
  classId: number;
  class: {
    id: number;
    name: string;
    capacity: number;
    supervisorId: string;
  };
  subject: {
    id: string;
    name: string;
  };
}

export const convertToCalendarEvents = (data: ClassData[]): Event[] => {
  return data.flatMap((item) => {
    return item.day.map((day) => {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);

      // Adjust the date based on the selected day of the week
      const dayMap: { [key: string]: number } = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 0,
      };

      // Set the correct day of the week
      const currentDay = start.getDay();
      const diff = (dayMap[day] - currentDay + 7) % 7; // Calculate the difference to get the correct day
      start.setDate(start.getDate() + diff);
      end.setDate(end.getDate() + diff);

      return {
        title: item.subject.name, // Subject name as the title
        start: start,
        end: end,
        allDay: false, // Set to false for scheduled events
        resourceId: item.teacherId, // If you'd like to associate the teacher with the event
        extendedProps: {
          className: item.class.name, // Optional: you can add the class name or other details
          subjectId: item.subjectId,
          teacherId: item.teacherId,
          classId: item.classId,
          subjectName: item.subject.name,
        },
      };
    });
  });
};
