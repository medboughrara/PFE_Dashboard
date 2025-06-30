"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Camera, CombineIcon as Conveyor, BarChart3 } from "lucide-react"
import { useSystem } from "./clientLayout"

interface CubeCounts {
  red: number
  blue: number
  green: number
  defected: number
  total: number
}

export default function Dashboard() {
  const { isRunning, systemStatus } = useSystem()
  const [cubeCounts, setCubeCounts] = useState<CubeCounts>({
    red: 12,
    blue: 8,
    green: 15,
    defected: 3,
    total: 38,
  })

  const [cycleTime, setCycleTime] = useState(2.3)
  const [efficiency, setEfficiency] = useState(94)
  const [conveyorStatus, setConveyorStatus] = useState({
    conveyor1: true,
    conveyor2: true,
    camera: true,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning && systemStatus === "Active") {
        setCubeCounts((prev) => ({
          red: prev.red + Math.floor(Math.random() * 2),
          blue: prev.blue + Math.floor(Math.random() * 2),
          green: prev.green + Math.floor(Math.random() * 2),
          defected: prev.defected + Math.floor(Math.random() * 1),
          total: prev.total + Math.floor(Math.random() * 3),
        }))

        setCycleTime((prev) => 2.0 + Math.random() * 0.8)
        setEfficiency((prev) => Math.max(85, Math.min(98, prev + (Math.random() - 0.5) * 2)))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isRunning, systemStatus])

  // Update conveyor status based on system status
  useEffect(() => {
    if (systemStatus === "Error") {
      setConveyorStatus({
        conveyor1: false,
        conveyor2: false,
        camera: false,
      })
    } else if (systemStatus === "Active") {
      setConveyorStatus({
        conveyor1: true,
        conveyor2: true,
        camera: true,
      })
    }
  }, [systemStatus])

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 p-4 md:p-8">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Robot Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus}</div>
            <Badge
              variant={systemStatus === "Active" ? "default" : systemStatus === "Error" ? "destructive" : "secondary"}
            >
              {systemStatus}
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conveyors</CardTitle>
            <Conveyor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">CONV1:</span>
                <Badge variant={conveyorStatus.conveyor1 ? "default" : "secondary"}>
                  {conveyorStatus.conveyor1 ? "ON" : "OFF"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">CONV2:</span>
                <Badge variant={conveyorStatus.conveyor2 ? "default" : "secondary"}>
                  {conveyorStatus.conveyor2 ? "ON" : "OFF"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Camera System</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">CAP1 {conveyorStatus.camera ? "Active" : "Offline"}</div>
            <Badge variant={conveyorStatus.camera ? "default" : "destructive"}>
              {conveyorStatus.camera ? "Online" : "Offline"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{efficiency.toFixed(1)}%</div>
            <Progress value={efficiency} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Live Cube Counts */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Live Cube Classification Counts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-red-500 rounded mx-auto mb-2"></div>
              <div className="text-2xl font-bold">{cubeCounts.red}</div>
              <div className="text-sm text-muted-foreground">Red</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-500 rounded mx-auto mb-2"></div>
              <div className="text-2xl font-bold">{cubeCounts.blue}</div>
              <div className="text-sm text-muted-foreground">Blue</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-500 rounded mx-auto mb-2"></div>
              <div className="text-2xl font-bold">{cubeCounts.green}</div>
              <div className="text-sm text-muted-foreground">Green</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-500 rounded mx-auto mb-2"></div>
              <div className="text-2xl font-bold">{cubeCounts.defected}</div>
              <div className="text-sm text-muted-foreground">Defected</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-500 rounded mx-auto mb-2"></div>
              <div className="text-2xl font-bold">{cubeCounts.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Schematic - Updated Layout */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>System Schematic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg p-8 h-80">
            {/* CONV1 - Horizontal at bottom */}
            <div className="absolute bottom-16 left-8 w-48 h-8 bg-yellow-200 rounded flex items-center justify-center border-2 border-yellow-400">
              <span className="text-sm font-bold">CONV1</span>
              {conveyorStatus.conveyor1 && (
                <div className="absolute -top-2 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>

            {/* CONV2 - Vertical on left */}
            <div className="absolute left-8 top-8 w-8 h-32 bg-yellow-200 rounded flex items-center justify-center border-2 border-yellow-400">
              <span className="text-xs font-bold transform -rotate-90">CONV2</span>
              {conveyorStatus.conveyor2 && (
                <div className="absolute -right-2 top-4 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>

            {/* CAP3 - Entry point */}
            <div className="absolute bottom-16 right-8 w-12 h-8 bg-blue-200 rounded flex items-center justify-center border-2 border-blue-400">
              <span className="text-xs font-bold">CAP3</span>
            </div>

            {/* CAP2 - Connection point */}
            <div className="absolute bottom-16 left-2 w-12 h-8 bg-blue-200 rounded flex items-center justify-center border-2 border-blue-400">
              <span className="text-xs font-bold">CAP2</span>
            </div>

            {/* CAP1 - Camera detection point */}
            <div className="absolute left-8 top-2 w-12 h-8 bg-purple-200 rounded flex items-center justify-center border-2 border-purple-400">
              <span className="text-xs font-bold">CAP1</span>
              <Camera className="w-3 h-3 ml-1" />
              {conveyorStatus.camera && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>

            {/* KUKA Robot */}
            <div className="absolute right-20 top-20 w-16 h-16 bg-orange-200 rounded flex items-center justify-center border-2 border-orange-400">
              <span className="text-xs text-center font-bold">
                KUKA
                <br />
                Robot
              </span>
              {systemStatus === "Active" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>

            {/* Sorting Baskets - Above CONV1 */}
            <div className="absolute bottom-28 left-12 flex gap-2">
              <div className="w-8 h-8 bg-red-300 rounded border-2 border-red-400 flex items-center justify-center">
                <span className="text-xs font-bold">R</span>
              </div>
              <div className="w-8 h-8 bg-blue-300 rounded border-2 border-blue-400 flex items-center justify-center">
                <span className="text-xs font-bold">B</span>
              </div>
              <div className="w-8 h-8 bg-green-300 rounded border-2 border-green-400 flex items-center justify-center">
                <span className="text-xs font-bold">G</span>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded border-2 border-gray-400 flex items-center justify-center">
                <span className="text-xs font-bold">D</span>
              </div>
            </div>

            {/* Flow arrows */}
            <div className="absolute bottom-20 right-20 w-8 h-0.5 bg-gray-600">
              <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
            </div>
            <div className="absolute left-12 bottom-8 w-0.5 h-8 bg-gray-600">
              <div className="absolute top-0 left-0 w-0 h-0 border-b-4 border-b-gray-600 border-l-2 border-r-2 border-l-transparent border-r-transparent"></div>
            </div>
            <div className="absolute left-20 top-12 w-8 h-0.5 bg-gray-600">
              <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
            </div>

            {/* Robot working range indicator */}
            <div className="absolute right-12 top-12 w-24 h-24 border-2 border-dashed border-orange-300 rounded-full opacity-50"></div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cycle Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cycleTime.toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">Average per cube</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Uptime Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2h</div>
            <p className="text-xs text-muted-foreground">89% efficiency</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Defect Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((cubeCounts.defected / cubeCounts.total) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Defected cubes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

