import React from "react"
import { Card } from "@/components/ui/card" // Assuming this is the path to the Card component from `shadcn`

const Announcements = () => {
  // Dummy announcement data
  const announcements = [
    {
      id: 1,
      title: "New Feature Release",
      description: "We are excited to announce the launch of our new feature, which allows you to integrate third-party apps with our platform.",
      date: "March 7, 2025",
    },
    {
      id: 2,
      title: "Maintenance Window",
      description: "Scheduled maintenance will take place on March 10, 2025 from 1:00 AM to 3:00 AM. During this time, the website will be unavailable.",
      date: "March 6, 2025",
    },
    {
      id: 3,
      title: "Security Update",
      description: "A critical security update is available for all users. Please ensure you update your account settings immediately to maintain security.",
      date: "March 5, 2025",
    },
  ]

  return (
    <div className="">
      <h1 className="text-xl font-semibold mb-4">Announcements</h1>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="p-4">
            <h2 className="text-xl font-semibold">{announcement.title}</h2>
            <p className="text-sm text-muted-foreground">{announcement.date}</p>
            <p className="mt-2">{announcement.description}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Announcements
