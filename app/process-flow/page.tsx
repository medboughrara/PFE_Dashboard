"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"
import { useSystem } from "../clientLayout"

interface CubePosition {
  id: string
  x: number
  y: number
  color: string
  stage: "cap3" | "conv1" | "cap2" | "conv2" | "cap1" | "pickup" | "sorting" | "complete"
}

export default function ProcessFlow() {
  const { isRunning, systemStatus } = useSystem()
  const [cubes, setCubes] = useState<CubePosition[]>([])
  const [isAnimating, setIsAnimating] = useState(true)
  const [robotPosition, setRobotPosition] = useState({ x: 450, y: 150 })
  const [robotStatus, setRobotStatus] = useState("Idle")
  const [lastCubeTime, setLastCubeTime] = useState(Date.now())

  const colors = ["red", "blue", "green", "defected"]

  useEffect(() => {
    if (!isAnimating || !isRunning || systemStatus === "Error") return

    const interval = setInterval(() => {
      const now = Date.now()

      // Add new cubes every 2 seconds at CAP3
      if (now - lastCubeTime >= 2000) {
        const newCube: CubePosition = {
          id: Date.now().toString(),
          x: 520, // CAP3 position
          y: 280,
          color: colors[Math.floor(Math.random() * colors.length)],
          stage: "cap3",
        }
        setCubes((prev) => [...prev, newCube])
        setLastCubeTime(now)
      }

      // Move existing cubes through the process
      setCubes((prev) =>
        prev
          .map((cube) => {
            const newCube = { ...cube }

            switch (cube.stage) {
              case "cap3":
                // Move from CAP3 to CONV1
                newCube.stage = "conv1"
                newCube.x = 500
                break
              case "conv1":
                // Move along CONV1 towards CAP2
                newCube.x -= 8
                if (newCube.x <= 80) {
                  newCube.stage = "cap2"
                  newCube.x = 80
                }
                break
              case "cap2":
                // Move from CAP2 to CONV2
                newCube.stage = "conv2"
                newCube.y = 260
                break
              case "conv2":
                // Move up CONV2 towards CAP1
                newCube.y -= 8
                if (newCube.y <= 80) {
                  newCube.stage = "cap1"
                  newCube.y = 80
                }
                break
              case "cap1":
                // Wait for robot pickup at CAP1 (camera detection)
                if (Math.random() < 0.2) {
                  newCube.stage = "pickup"
                  setRobotStatus("Moving to pickup")
                }
                break
              case "pickup":
                newCube.stage = "sorting"
                setRobotStatus("Sorting cube")
                break
              case "sorting":
                // Move to appropriate basket above CONV1
                const basketPositions = {
                  red: { x: 120, y: 200 },
                  blue: { x: 160, y: 200 },
                  green: { x: 200, y: 200 },
                  defected: { x: 240, y: 200 },
                }
                const targetPos = basketPositions[cube.color as keyof typeof basketPositions]
                newCube.x = targetPos.x
                newCube.y = targetPos.y
                newCube.stage = "complete"
                setRobotStatus("Returning to home")
                break
            }

            return newCube
          })
          .filter((cube) => cube.stage !== "complete" || Math.random() > 0.1),
      )

      // Update robot position based on activity
      setRobotPosition((prev) => ({
        x: 450 + Math.sin(Date.now() / 1000) * 15,
        y: 150 + Math.cos(Date.now() / 1000) * 10,
      }))
    }, 300)

    return () => clearInterval(interval)
  }, [isAnimating, isRunning, systemStatus, lastCubeTime])

  const resetAnimation = () => {
    setCubes([])
    setRobotPosition({ x: 450, y: 150 })
    setRobotStatus("Idle")
    setLastCubeTime(Date.now())
  }

  // Stop animation when system is in error state
  useEffect(() => {
    if (systemStatus === "Error") {
      setIsAnimating(false)
      setRobotStatus("Error - System Stopped")
    } else if (systemStatus === "Active" && isRunning) {
      setIsAnimating(true)
      setRobotStatus("Active")
    } else {
      setRobotStatus("Idle")
    }
  }, [systemStatus, isRunning])

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Process Flow Visualization</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAnimating(!isAnimating)}
            variant={isAnimating ? "default" : "outline"}
            disabled={systemStatus === "Error"}
          >
            {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAnimating ? "Pause" : "Start"}
          </Button>
          <Button onClick={resetAnimation} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3 shadow-md">
          <CardHeader>
            <CardTitle>Live Process Flow - CAP3 → CONV1 → CAP2 → CONV2 → CAP1 → Robot Sorting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-50 rounded-lg h-96 overflow-hidden">
              {/* CONV1 - Horizontal conveyor */}
              <div
                className={`absolute bottom-20 left-16 w-80 h-16 rounded flex items-center justify-center border-2 transition-colors ${
                  systemStatus === "Error" ? "bg-red-200 border-red-300" : "bg-yellow-200 border-yellow-300"
                }`}
              >
                <span className="text-sm font-medium">CONV1</span>
                {isRunning && systemStatus === "Active" && (
                  <div className="absolute right-4 top-1/2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>

              {/* CONV2 - Vertical conveyor */}
              <div
                className={`absolute left-16 top-16 w-16 h-48 rounded flex items-center justify-center border-2 transition-colors ${
                  systemStatus === "Error" ? "bg-red-200 border-red-300" : "bg-yellow-200 border-yellow-300"
                }`}
              >
                <span className="text-sm font-medium transform -rotate-90">CONV2</span>
                {isRunning && systemStatus === "Active" && (
                  <div className="absolute top-4 right-1/2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>

              {/* CAP3 - Entry point */}
              <div className="absolute bottom-20 right-16 w-20 h-16 bg-blue-200 rounded flex items-center justify-center border-2 border-blue-300">
                <span className="text-sm font-bold">CAP3</span>
                <div className="text-xs">Entry</div>
              </div>

              {/* CAP2 - Connection point */}
              <div className="absolute bottom-20 left-4 w-20 h-16 bg-blue-200 rounded flex items-center justify-center border-2 border-blue-300">
                <span className="text-sm font-bold">CAP2</span>
              </div>

              {/* CAP1 - Camera detection */}
              <div className="absolute left-16 top-4 w-20 h-16 bg-purple-200 rounded flex items-center justify-center border-2 border-purple-300">
                <div className="text-center">
                  <div className="text-sm font-bold">CAP1</div>
                  <div className="text-xs">Camera</div>
                </div>
                {systemStatus === "Active" && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>

              {/* KUKA Robot */}
              <div
                className={`absolute w-20 h-20 rounded border-4 flex items-center justify-center transition-all duration-300 ${
                  systemStatus === "Error" ? "bg-red-200 border-red-400" : "bg-orange-200 border-orange-400"
                }`}
                style={{ left: robotPosition.x, top: robotPosition.y }}
              >
                <span className="text-xs font-bold text-center">
                  KUKA
                  <br />
                  Robot
                </span>
              </div>

              {/* Sorting Baskets above CONV1 */}
              <div className="absolute bottom-40 left-20 flex gap-4">
                <div className="w-12 h-12 bg-red-300 rounded border-2 border-red-400 flex items-center justify-center">
                  <span className="text-xs font-bold">Red</span>
                </div>
                <div className="w-12 h-12 bg-blue-300 rounded border-2 border-blue-400 flex items-center justify-center">
                  <span className="text-xs font-bold">Blue</span>
                </div>
                <div className="w-12 h-12 bg-green-300 rounded border-2 border-green-400 flex items-center justify-center">
                  <span className="text-xs font-bold">Green</span>
                </div>
                <div className="w-12 h-12 bg-gray-300 rounded border-2 border-gray-400 flex items-center justify-center">
                  <span className="text-xs font-bold">Defect</span>
                </div>
              </div>

              {/* Cubes */}
              {cubes.map((cube) => (
                <div
                  key={cube.id}
                  className={`absolute w-4 h-4 rounded transition-all duration-300 border border-gray-400 z-10`}
                  style={{
                    left: cube.x,
                    top: cube.y,
                    backgroundColor:
                      cube.color === "red"
                        ? "#ef4444"
                        : cube.color === "blue"
                          ? "#3b82f6"
                          : cube.color === "green"
                            ? "#22c55e"
                            : "#6b7280",
                  }}
                />
              ))}

              {/* Flow direction arrows */}
              <div className="absolute bottom-12 right-40 text-xs text-gray-600 flex items-center">
                <span>Flow Direction</span>
                <div className="ml-2 w-6 h-0.5 bg-gray-600">
                  <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
              </div>

              {/* Robot working range */}
              <div className="absolute" style={{ left: robotPosition.x - 30, top: robotPosition.y - 30 }}>
                <div className="w-20 h-20 border-2 border-dashed border-orange-300 rounded-full opacity-30"></div>
              </div>

              {/* System Error Overlay */}
              {systemStatus === "Error" && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                  <div className="bg-red-600 text-white px-4 py-2 rounded font-bold animate-pulse">
                    SYSTEM ERROR - ALL OPERATIONS STOPPED
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Robot Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={systemStatus === "Error" ? "destructive" : systemStatus === "Active" ? "default" : "secondary"}
                className="mb-2"
              >
                {robotStatus}
              </Badge>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Position X:</span>
                  <span>{robotPosition.x.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Position Y:</span>
                  <span>{robotPosition.y.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Cubes:</span>
                  <span>{cubes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cube Interval:</span>
                  <span>2.0s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Process Stage Counts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>At CAP3:</span>
                  <span>{cubes.filter((c) => c.stage === "cap3").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>On CONV1:</span>
                  <span>{cubes.filter((c) => c.stage === "conv1").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>At CAP2:</span>
                  <span>{cubes.filter((c) => c.stage === "cap2").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>On CONV2:</span>
                  <span>{cubes.filter((c) => c.stage === "conv2").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>At CAP1:</span>
                  <span>{cubes.filter((c) => c.stage === "cap1").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Being Sorted:</span>
                  <span>{cubes.filter((c) => c.stage === "pickup" || c.stage === "sorting").length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Color Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {colors.map((color) => (
                  <div key={color} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded`}
                        style={{
                          backgroundColor:
                            color === "red"
                              ? "#ef4444"
                              : color === "blue"
                                ? "#3b82f6"
                                : color === "green"
                                  ? "#22c55e"
                                  : "#6b7280",
                        }}
                      />
                      <span className="capitalize">{color}:</span>
                    </div>
                    <span>{cubes.filter((c) => c.color === color).length}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
