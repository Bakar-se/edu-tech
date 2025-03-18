"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
const chartData = [
  { month: "January", income: 4250, expenses: 3200 },
  { month: "February", income: 5100, expenses: 3800 },
  { month: "March", income: 4800, expenses: 3600 },
  { month: "April", income: 5300, expenses: 3900 },
  { month: "May", income: 5800, expenses: 4100 },
  { month: "June", income: 6200, expenses: 4300 },
]

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(220, 15%, 40%)",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(220, 15%, 60%)",
  },
} satisfies ChartConfig

export function FinanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Performance</CardTitle>
        <CardDescription>Income vs Expenses (Jan - Jun 2024)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="income" type="monotone" stroke="var(--color-income)" strokeWidth={2} dot={false} />
            <Line dataKey="expenses" type="monotone" stroke="var(--color-expenses)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Net profit increased by 12.5% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing monthly financial performance for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

