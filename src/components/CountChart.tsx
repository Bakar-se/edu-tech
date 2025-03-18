"use client"

import { CardDescription } from "@/components/ui/card"

import { CardFooter } from "@/components/ui/card"

import { TrendingUp } from "lucide-react"
import { RadialBar, RadialBarChart } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Simplified data with just male and female categories
const chartData = [
  { gender: "Male", students: 480, fill: "hsl(220, 15%, 40%)" },
  { gender: "Female", students: 520, fill: "hsl(220, 15%, 60%)" },
]

const chartConfig = {
  students: {
    label: "Students",
  },
  male: {
    label: "Male",
    color: "hsl(220, 15%, 40%)", // Dark gray
  },
  female: {
    label: "Female",
    color: "hsl(220, 15%, 60%)", // Light gray
  },
} satisfies ChartConfig

export function CountChart() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Student Gender Distribution</CardTitle>
        <CardDescription>Academic Year 2023-2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="gender" />} />
            <RadialBar dataKey="students" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Female enrollment up by 8.3% this year <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total enrollment: 1,000 students (52% female, 48% male)
        </div>
      </CardFooter>
    </Card>
  )
}

