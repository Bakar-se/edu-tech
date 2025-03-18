"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
const chartData = [
  { day: "Monday", male: 186, female: 175 },
  { day: "Tuesday", male: 205, female: 190 },
  { day: "Wednesday", male: 237, female: 220 },
  { day: "Thursday", male: 173, female: 190 },
  { day: "Friday", male: 159, female: 165 },
  { day: "Saturday", male: 84, female: 95 },
  { day: "Sunday", male: 60, female: 70 },
]

const chartConfig = {
  male: {
    label: "Male",
    color: "hsl(220, 15%, 40%)",
  },
  female: {
    label: "Female",
    color: "hsl(220, 15%, 60%)",
  },
} satisfies ChartConfig

export function AttendanceChart() {
  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle>Student Attendance</CardTitle>
        <CardDescription>Male vs Female Attendance by Weekday (2024)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="male" fill="var(--color-male)" radius={4} />
            <Bar dataKey="female" fill="var(--color-female)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Mid-week attendance highest overall <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing average student attendance patterns by day of week
        </div>
      </CardFooter>
    </Card>
  )
}

