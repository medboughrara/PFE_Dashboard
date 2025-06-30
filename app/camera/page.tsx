"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Camera, Play, Pause, Settings, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DetectedCube {
  id: string
  color: string
  confidence: number
  x: number
  y: number
  width: number
  height: number
  timestamp: string
}

export default function CameraVision() {
  // Set default URL and connect by default
  const defaultCameraUrl = "http://192.168.100.84:8080/video"
  const [cameraUrl, setCameraUrl] = useState(defaultCameraUrl)
  const [connected, setConnected] = useState(true)
  const [streamUrl, setStreamUrl] = useState(defaultCameraUrl)
  const [detectedCubes, setDetectedCubes] = useState<DetectedCube[]>([])
  const [visionParams, setVisionParams] = useState({
    redThreshold: [120, 255],
    greenThreshold: [100, 255],
    blueThreshold: [110, 255],
    minArea: 500,
    maxArea: 5000,
    brightness: 50,
    contrast: 50,
    saturation: 50,
  })
  const [detectionMode, setDetectionMode] = useState("color")
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true)
  const [isProcessing, setIsProcessing] = useState(true)

  // For polling detections
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  // Connect to camera and backend
  const handleConnect = () => {
    setStreamUrl(cameraUrl)
    setConnected(true)
  }

  // Poll backend for detections if connected
  useEffect(() => {
    if (!connected || !isProcessing) return

    // Example: backend endpoint returns [{id, color, confidence, x, y, width, height, timestamp}]
    const pollDetections = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8500/api/detections")
        if (res.ok) {
          const data = await res.json()
          setDetectedCubes(data)
        }
      } catch {
        // fallback to empty or previous
      }
    }

    pollingRef.current = setInterval(pollDetections, 1000)
    pollDetections()

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [connected, isProcessing])

  const getCubeColor = (color: string) => {
    switch (color) {
      case "red":
        return "#ef4444"
      case "green":
        return "#22c55e"
      case "blue":
        return "#3b82f6"
      case "yellow":
        return "#eab308"
      default:
        return "#6b7280"
    }
  }

  // Only show detected red, blue, and green cubes
  const filteredCubes = detectedCubes.filter(
    (cube) =>
      cube.color === "red" ||
      cube.color === "blue" ||
      cube.color === "green"
  )

  // Show the most recent detection of each color at the top of the list
  // Use a unique key for each detection (color + timestamp + x/y)
  const recentDetections: DetectedCube[] = []
  const seenColors = new Set<string>()
  for (const cube of filteredCubes) {
    if (!seenColors.has(cube.color)) {
      recentDetections.push(cube)
      seenColors.add(cube.color)
    }
    if (seenColors.size === 3) break
  }

  // Helper to generate a unique key for each detection
  const getDetectionKey = (cube: DetectedCube) =>
    `${cube.color}_${cube.timestamp}_${cube.x}_${cube.y}`

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Camera & Vision System</h1>
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          <Badge variant={isProcessing ? "default" : "secondary"}>{isProcessing ? "Processing" : "Paused"}</Badge>
        </div>
      </div>

      {/* Camera connection controls */}
      <Card className="mb-4 shadow-md">
        <CardHeader>
          <CardTitle>Connect to HTTP Camera</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <Input
              placeholder="http://192.168.100.84:8080/mjpeg"
              value={cameraUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCameraUrl(e.target.value)}
              className="flex-1"
              disabled={connected}
            />
            <Button onClick={handleConnect} disabled={connected || !cameraUrl}>
              Connect
            </Button>
            {connected && (
              <Button
                variant="outline"
                onClick={() => {
                  setConnected(false)
                  setStreamUrl("")
                  setDetectedCubes([])
                }}
              >
                Disconnect
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Example: <code>http://192.168.1.100:8080/video</code> (MJPEG stream)
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Camera Feed */}
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Live Camera Feed</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsProcessing(!isProcessing)}
                  variant={isProcessing ? "default" : "outline"}
                  size="sm"
                >
                  {isProcessing ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isProcessing ? "Pause" : "Resume"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-900 rounded-lg h-80 overflow-hidden">
              {/* Camera stream or simulated background */}
              {connected && streamUrl ? (
                <img
                  src={streamUrl}
                  alt="Camera Stream"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ zIndex: 1 }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
              )}

              {/* Detection zone overlay */}
              <div className="absolute inset-4 border-2 border-green-400 rounded-lg opacity-50 z-10">
                <div className="absolute top-2 left-2 text-green-400 text-xs font-mono">DETECTION ZONE</div>
              </div>

              {/* Detected cubes with bounding boxes */}
              {showBoundingBoxes &&
                filteredCubes.slice(0, 3).map((cube) => (
                  <div
                    key={getDetectionKey(cube)}
                    className="absolute border-2 border-yellow-400 rounded"
                    style={{
                      left: cube.x,
                      top: cube.y,
                      width: cube.width ?? 40,
                      height: cube.height ?? 40,
                      zIndex: 20,
                    }}
                  >
                    <div className="w-full h-full rounded" style={{ backgroundColor: getCubeColor(cube.color), opacity: 0.5 }}></div>
                    <div className="absolute -top-6 left-0 text-yellow-400 text-xs font-mono bg-black bg-opacity-50 px-1 rounded">
                      {cube.color} ({cube.confidence.toFixed(1)}%)
                    </div>
                  </div>
                ))}

              {/* Crosshair */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="w-8 h-0.5 bg-red-500"></div>
                <div className="w-0.5 h-8 bg-red-500 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4"></div>
              </div>

              {/* Status overlay */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded text-xs font-mono z-40">
                <div>FPS: 30</div>
                <div>Resolution: 640x480</div>
                <div>Mode: {detectionMode}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detection Results */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Detections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentDetections.map((cube) => (
                <div key={getDetectionKey(cube)} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: getCubeColor(cube.color) }}></div>
                    <div>
                      <div className="font-medium text-sm capitalize">{cube.color}</div>
                      <div className="text-xs text-muted-foreground">{cube.timestamp}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {cube.confidence.toFixed(1)}%
                  </Badge>
                </div>
              ))}
              {recentDetections.length === 0 && (
                <div className="text-center text-muted-foreground py-8">No cubes detected</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vision Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Color Detection Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Red Threshold</Label>
              <div className="mt-2">
                <Slider
                  value={visionParams.redThreshold}
                  onValueChange={(value) => setVisionParams((prev) => ({ ...prev, redThreshold: value }))}
                  max={255}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{visionParams.redThreshold[0]}</span>
                  <span>{visionParams.redThreshold[1]}</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Green Threshold</Label>
              <div className="mt-2">
                <Slider
                  value={visionParams.greenThreshold}
                  onValueChange={(value) => setVisionParams((prev) => ({ ...prev, greenThreshold: value }))}
                  max={255}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{visionParams.greenThreshold[0]}</span>
                  <span>{visionParams.greenThreshold[1]}</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Blue Threshold</Label>
              <div className="mt-2">
                <Slider
                  value={visionParams.blueThreshold}
                  onValueChange={(value) => setVisionParams((prev) => ({ ...prev, blueThreshold: value }))}
                  max={255}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{visionParams.blueThreshold[0]}</span>
                  <span>{visionParams.blueThreshold[1]}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Min Area</Label>
                <Slider
                  value={[visionParams.minArea]}
                  onValueChange={(value) => setVisionParams((prev) => ({ ...prev, minArea: value[0] }))}
                  max={2000}
                  min={100}
                  step={50}
                  className="w-full mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">{visionParams.minArea}px</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Max Area</Label>
                <Slider
                  value={[visionParams.maxArea]}
                  onValueChange={(value) => setVisionParams((prev) => ({ ...prev, maxArea: value[0] }))}
                  max={10000}
                  min={1000}
                  step={100}
                  className="w-full mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">{visionParams.maxArea}px</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Camera Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Brightness</Label>
              <Slider
                value={[visionParams.brightness]}
                onValueChange={(value) =>
                  setVisionParams((prev) => ({ ...prev, brightness: value[0] }))
                }
                max={100}
                min={0}
                step={1}
                className="w-full mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {visionParams.brightness}%
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Contrast</Label>
              <Slider
                value={[visionParams.contrast]}
                onValueChange={(value) =>
                  setVisionParams((prev) => ({ ...prev, contrast: value[0] }))
                }
                max={100}
                min={0}
                step={1}
                className="w-full mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {visionParams.contrast}%
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Saturation</Label>
              <Slider
                value={[visionParams.saturation]}
                onValueChange={(value) =>
                  setVisionParams((prev) => ({ ...prev, saturation: value[0] }))
                }
                max={100}
                min={0}
                step={1}
                className="w-full mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {visionParams.saturation}%
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label htmlFor="detection-mode" className="text-sm font-medium">
                  Detection Mode
                </Label>
                <select
                  id="detection-mode"
                  value={detectionMode}
                  onChange={(e) => setDetectionMode(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="color">Color Detection</option>
                  <option value="shape">Shape Detection</option>
                  <option value="size">Size Detection</option>
                  <option value="combined">Combined Mode</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="bounding-boxes" className="text-sm font-medium">
                  Show Bounding Boxes
                </Label>
                <Switch
                  id="bounding-boxes"
                  checked={showBoundingBoxes}
                  onCheckedChange={setShowBoundingBoxes}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
