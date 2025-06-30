"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Download, Calendar, TrendingUp, Package, Clock } from "lucide-react"

interface StatisticsData {
  totalCubes: number
  cubesByColor: { color: string; count: number; percentage: number }[]
  hourlyData: { hour: string; cubes: number; efficiency: number }[]
  dailyData: { day: string; cubes: number }[]
  errorRate: number
  avgCycleTime: number
  uptime: number
}

export default function Statistics() {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today")
  const [statistics, setStatistics] = useState<StatisticsData>({
    totalCubes: 1247,
    cubesByColor: [
      { color: "Red", count: 312, percentage: 25 },
      { color: "Green", count: 298, percentage: 24 },
      { color: "Blue", count: 387, percentage: 31 },
      { color: "Defected", count: 250, percentage: 20 },
    ],
    hourlyData: [
      { hour: "08:00", cubes: 45, efficiency: 92 },
      { hour: "09:00", cubes: 52, efficiency: 94 },
      { hour: "10:00", cubes: 48, efficiency: 89 },
      { hour: "11:00", cubes: 55, efficiency: 96 },
      { hour: "12:00", cubes: 38, efficiency: 85 },
      { hour: "13:00", cubes: 42, efficiency: 88 },
      { hour: "14:00", cubes: 58, efficiency: 97 },
      { hour: "15:00", cubes: 51, efficiency: 93 },
    ],
    dailyData: [
      { day: "Mon", cubes: 456 },
      { day: "Tue", cubes: 523 },
      { day: "Wed", cubes: 478 },
      { day: "Thu", cubes: 612 },
      { day: "Fri", cubes: 589 },
      { day: "Sat", cubes: 234 },
      { day: "Sun", cubes: 189 },
    ],
    errorRate: 0.3,
    avgCycleTime: 2.4,
    uptime: 94.2,
  })

  const colors = {
    Red: "#ef4444",
    Green: "#22c55e",
    Blue: "#3b82f6",
    Defected: "#6b7280",
  }

  const exportData = (format: "csv" | "json") => {
    const data = {
      timestamp: new Date().toISOString(),
      timeRange,
      statistics,
    }

    if (format === "csv") {
      // Convert to CSV format
      const csvContent = [
        "Color,Count,Percentage",
        ...statistics.cubesByColor.map((item) => `${item.color},${item.count},${item.percentage}%`),
        "",
        "Hour,Cubes,Efficiency",
        ...statistics.hourlyData.map((item) => `${item.hour},${item.cubes},${item.efficiency}%`),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cube-sorting-statistics-${timeRange}.csv`
      a.click()
    } else {
      // Export as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cube-sorting-statistics-${timeRange}.json`
      a.click()
    }
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatistics((prev) => ({
        ...prev,
        totalCubes: prev.totalCubes + Math.floor(Math.random() * 3),
        cubesByColor: prev.cubesByColor.map((item) => ({
          ...item,
          count: item.count + Math.floor(Math.random() * 2),
        })),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Statistics & History</h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {(["today", "week", "month"] as const).map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
          <Button onClick={() => exportData("csv")} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => exportData("json")} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cubes Sorted</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalCubes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cycle Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.avgCycleTime}s</div>
            <p className="text-xs text-muted-foreground">-0.2s from yesterday</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.uptime}%</div>
            <p className="text-xs text-muted-foreground">Target: 95%</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.errorRate}%</div>
            <p className="text-xs text-muted-foreground">Classification errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Distribution Pie Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Cube Distribution by Color</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                },
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statistics.cubesByColor}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ color, percentage }) => `${color}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {statistics.cubesByColor.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[entry.color as keyof typeof colors]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statistics.cubesByColor.map((item) => (
                <div key={item.color} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: colors[item.color as keyof typeof colors] }}
                  />
                  <span className="text-sm">
                    {item.color}: {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Production Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Hourly Production</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cubes: {
                  label: "Cubes",
                  color: "#3b82f6",
                },
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="cubes" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Production Trend */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Weekly Production Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cubes: {
                  label: "Cubes",
                  color: "#22c55e",
                },
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statistics.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="cubes" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Efficiency Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>System Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                efficiency: {
                  label: "Efficiency %",
                  color: "#f59e0b",
                },
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statistics.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[80, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics Table */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Detailed Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Time Period</th>
                  <th className="text-left p-2">Cubes Processed</th>
                  <th className="text-left p-2">Efficiency</th>
                  <th className="text-left p-2">Errors</th>
                  <th className="text-left p-2">Avg Cycle Time</th>
                </tr>
              </thead>
              <tbody>
                {statistics.hourlyData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{item.hour}</td>
                    <td className="p-2">{item.cubes}</td>
                    <td className="p-2">
                      <Badge variant={item.efficiency > 90 ? "default" : "secondary"}>{item.efficiency}%</Badge>
                    </td>
                    <td className="p-2">{Math.floor(item.cubes * 0.003)}</td>
                    <td className="p-2">{(2.0 + Math.random() * 0.8).toFixed(1)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Best Performance</h4>
              <div className="space-y-1 text-sm">
                <div>Highest hourly output: 58 cubes</div>
                <div>Best efficiency: 97%</div>
                <div>Fastest cycle time: 1.8s</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Current Targets</h4>
              <div className="space-y-1 text-sm">
                <div>Daily target: 500 cubes</div>
                <div>Efficiency target: 95%</div>
                <div>Max cycle time: 3.0s</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Improvement Areas</h4>
              <div className="space-y-1 text-sm">
                <div>Reduce lunch break downtime</div>
                <div>Optimize conveyor speeds</div>
                <div>Improve vision accuracy</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
