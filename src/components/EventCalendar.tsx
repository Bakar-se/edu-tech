"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import { Card } from "./ui/card"

export function EventCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const events = [
    { id: 1, title: "Event 1", time: "10:00 AM", description: "This is event 1", date: new Date(2025, 2, 19) },
    { id: 2, title: "Event 2", time: "12:00 PM", description: "This is event 2", date: new Date(2025, 2, 20) },
    { id: 3, title: "Event 3", time: "2:00 PM", description: "This is event 3", date: new Date(2025, 2, 18) },
    { id: 4, title: "Event 4", time: "4:00 PM", description: "This is event 4", date: new Date(2025, 2, 17) },
  ]

  const filteredEvents = events.filter(event => {
    return (
      event.date.getDate() === date?.getDate() &&
      event.date.getMonth() === date?.getMonth() &&
      event.date.getFullYear() === date?.getFullYear()
    )
  })

  return (
    <div className="rounded-md w-full">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow w-full"
      classNames={{
        months:
          "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
        month: "space-y-4 w-full flex flex-col",
        table: "w-full h-full border-collapse space-y-1",
        head_row: "",
        row: "w-full mt-2",
      }}
    />
    <div className="flex flex-col mt-4 gap-4">
      <h1 className="text-xl font-semibold">Events</h1>
      <div className="flex flex-col gap-4">
      {filteredEvents.length === 0 ? (
            <p>No events for the selected date.</p>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event.id} className="flex flex-col gap-2 p-4">
                <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <p className="text-muted-foreground">{event.time}</p>
                </div>

                <p>{event.description}</p>

              </Card>
            ))
          )}
      </div>
    </div>
    </div>
  )
}
