"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Square, AlertTriangle, Wrench, Activity } from "lucide-react"

interface ConveyorStatus {
  id: number
  name: string
  isRunning: boolean
  speed: number
  cubeDetected: boolean
  jamDetected: boolean
  motorTemp: number
  vibration: number
  runtime: number
}

export default function ConveyorManagement() {
  const [conveyors, setConveyors] = useState<ConveyorStatus[]>([
    {
      id: 1,
      name: "Conveyor 1",
      isRunning: true,
      speed: 75,
      cubeDetected: false,
      jamDetected: false,
      motorTemp: 42,
      vibration: 0.2,
      runtime: 7.5,
    },
    {
      id: 2,
      name: "Conveyor 2",
      isRunning: true,
      speed: 80,
      cubeDetected: false,
      jamDetected: false,
      motorTemp: 38,
      vibration: 0.15,
      runtime: 7.2,
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConveyors((prev) =>
        prev.map((conveyor) => ({
          ...conveyor,
          cubeDetected: conveyor.isRunning ? Math.random() < 0.3 : false,
          jamDetected: conveyor.isRunning ? Math.random() < 0.05 : false,
          motorTemp: conveyor.isRunning
            ? 35 + Math.random() * 15 + conveyor.speed / 10
            : Math.max(25, conveyor.motorTemp - 0.5),
          vibration: conveyor.isRunning ? 0.1 + Math.random() * 0.3 + conveyor.speed / 500 : 0,
          runtime: conveyor.isRunning ? conveyor.runtime + 0.1 / 60 : conveyor.runtime,
        })),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const toggleConveyor = (id: number) => {
    setConveyors((prev) =>
      prev.map((conveyor) => (conveyor.id === id ? { ...conveyor, isRunning: !conveyor.isRunning } : conveyor)),
    )
  }

  const updateSpeed = (id: number, speed: number) => {
    setConveyors((prev) => prev.map((conveyor) => (conveyor.id === id ? { ...conveyor, speed: speed } : conveyor)))
  }

  const clearJam = (id: number) => {
    setConveyors((prev) =>
      prev.map((conveyor) => (conveyor.id === id ? { ...conveyor, jamDetected: false } : conveyor)),
    )
  }

  const emergencyStop = () => {
    setConveyors((prev) =>
      prev.map((conveyor) => ({
        ...conveyor,
        isRunning: false,
        speed: 0,
      })),
    )
  }

  const startAll = () => {
    setConveyors((prev) =>
      prev.map((conveyor) => ({
        ...conveyor,
        isRunning: true,
        speed: conveyor.speed || 75,
      })),
    )
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={startAll} className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4 mr-2" />
            Start All
          </Button>
          <Button onClick={emergencyStop} variant="destructive">
            <Square className="w-4 h-4 mr-2" />
            Emergency Stop
          </Button>
        </div>
      </div>

      {/* System Alerts */}
      {conveyors.some((c) => c.jamDetected) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Jam detected on{" "}
            {conveyors
              .filter((c) => c.jamDetected)
              .map((c) => c.name)
              .join(", ")}
            . Check conveyor and clear obstruction.
          </AlertDescription>
        </Alert>
      )}

      {conveyors.some((c) => c.motorTemp > 50) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            High motor temperature detected on{" "}
            {conveyors
              .filter((c) => c.motorTemp > 50)
              .map((c) => c.name)
              .join(", ")}
            .
          </AlertDescription>
        </Alert>
      )}

      {/* Conveyor Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {conveyors.map((conveyor) => (
          <Card key={conveyor.id} className={`${conveyor.jamDetected ? "border-red-500" : ""} shadow-md`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {conveyor.name}
                </CardTitle>
                <Badge variant={conveyor.isRunning ? "default" : "secondary"}>
                  {conveyor.isRunning ? "Running" : "Stopped"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Control Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => toggleConveyor(conveyor.id)}
                  variant={conveyor.isRunning ? "destructive" : "default"}
                  className="flex-1"
                >
                  {conveyor.isRunning ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                {conveyor.jamDetected && (
                  <Button onClick={() => clearJam(conveyor.id)} variant="outline">
                    <Wrench className="w-4 h-4 mr-2" />
                    Clear Jam
                  </Button>
                )}
              </div>

              {/* Speed Control */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">Speed Control</Label>
                  <span className="text-sm text-muted-foreground">{conveyor.speed}%</span>
                </div>
                <Slider
                  value={[conveyor.speed]}
                  onValueChange={(value) => updateSpeed(conveyor.id, value[0])}
                  max={100}
                  min={0}
                  step={5}
                  disabled={!conveyor.isRunning}
                  className="w-full"
                />
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cube Detected:</span>
                    <div className={`w-3 h-3 rounded-full ${conveyor.cubeDetected ? "bg-green-500" : "bg-gray-300"}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Jam Status:</span>
                    <div className={`w-3 h-3 rounded-full ${conveyor.jamDetected ? "bg-red-500" : "bg-green-500"}`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Motor Temp:</span>
                    <span className={`text-sm ${conveyor.motorTemp > 50 ? "text-red-500" : "text-green-600"}`}>
                      {conveyor.motorTemp.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Vibration:</span>
                    <span className={`text-sm ${conveyor.vibration > 0.5 ? "text-blue-500" : "text-green-600"}`}>
                      {" "}
                      {/* Changed from yellow-500 to blue-500 */}
                      {conveyor.vibration.toFixed(2)}g
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Runtime Today:</span>
                    <div className="font-medium">{conveyor.runtime.toFixed(1)}h</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Efficiency:</span>
                    <div className="font-medium">{conveyor.isRunning ? "98.5%" : "0%"}</div>
                  </div>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="relative">
                  <div className="h-8 bg-blue-200 rounded flex items-center justify-center border-2 border-blue-300">
                    {" "}
                    {/* Changed from blue-200/blue-300 to blue */}
                    <span className="text-xs font-medium">{conveyor.name}</span>
                  </div>
                  {conveyor.isRunning && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  )}
                  {conveyor.cubeDetected && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-3 h-3 bg-blue-500 rounded animate-bounce" />{" "}
                      {/* Changed from orange-500 to blue-500 */}
                    </div>
                  )}
                  {conveyor.jamDetected && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Overview */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {conveyors.filter((c) => c.isRunning).length}/{conveyors.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Conveyors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {(conveyors.reduce((sum, c) => sum + c.speed, 0) / conveyors.length).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Average Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{conveyors.filter((c) => c.cubeDetected).length}</div>
              <div className="text-sm text-muted-foreground">Cubes Detected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{conveyors.filter((c) => c.jamDetected).length}</div>
              <div className="text-sm text-muted-foreground">Active Jams</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
