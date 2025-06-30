"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle, XCircle, Clock, Search, RefreshCw } from "lucide-react"
import { useSystem } from "../clientLayout"

interface ErrorLog {
  id: string
  timestamp: string
  severity: "Critical" | "Warning" | "Info"
  component: string
  code: string
  description: string
  status: "Active" | "Acknowledged" | "Resolved"
  instructions?: string
}

export default function ErrorsAlerts() {
  const { criticalErrors, acknowledgedErrors, resolveError, acknowledgeError, addError } = useSystem()
  const [errors, setErrors] = useState<ErrorLog[]>([
    {
      id: "E001",
      timestamp: "2024-01-15 14:23:15",
      severity: "Critical",
      component: "KUKA Robot",
      code: "ROB_001",
      description: "Robot arm position sensor malfunction",
      status: "Active",
      instructions: "Check sensor connections and recalibrate robot arm",
    },
    {
      id: "E002",
      timestamp: "2024-01-15 13:45:22",
      severity: "Warning",
      component: "Conveyor 1",
      code: "CNV_003",
      description: "Motor temperature above normal range",
      status: "Acknowledged",
      instructions: "Monitor temperature and reduce speed if necessary",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState<string>("All")
  const [filterStatus, setFilterStatus] = useState<string>("All")
  const [isFlashing, setIsFlashing] = useState(false)
  const [currentUser] = useState({ role: "Maintenance" }) // Simulated user

  // Flash effect for critical errors
  useEffect(() => {
    const activeCriticalErrors = errors.filter((e) => e.severity === "Critical" && e.status === "Active").length
    if (activeCriticalErrors > 0) {
      setIsFlashing(true)
      const flashInterval = setInterval(() => {
        setIsFlashing((prev) => !prev)
      }, 500)
      return () => clearInterval(flashInterval)
    } else {
      setIsFlashing(false)
    }
  }, [errors])

  // Simulate new errors
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.05) {
        // 5% chance every 10 seconds
        const severities = ["Critical", "Warning", "Info"]
        const components = ["KUKA Robot", "Conveyor 1", "Conveyor 2", "Camera System", "Vision System"]
        const severity = severities[Math.floor(Math.random() * severities.length)] as "Critical" | "Warning" | "Info"

        const newError: ErrorLog = {
          id: `E${String(Date.now()).slice(-3)}`,
          timestamp: new Date().toLocaleString(),
          severity,
          component: components[Math.floor(Math.random() * components.length)],
          code: `SYS_${Math.floor(Math.random() * 999)
            .toString()
            .padStart(3, "0")}`,
          description: [
            "Unexpected system behavior detected",
            "Communication timeout",
            "Sensor reading out of range",
            "Performance degradation detected",
          ][Math.floor(Math.random() * 4)],
          status: "Active",
          instructions: "Investigate and take appropriate action",
        }

        setErrors((prev) => [newError, ...prev])
        addError(newError)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [addError])

  const handleAcknowledgeError = (id: string) => {
    setErrors((prev) => prev.map((error) => (error.id === id ? { ...error, status: "Acknowledged" } : error)))
    acknowledgeError(id)
  }

  const handleResolveError = (id: string) => {
    setErrors((prev) => prev.map((error) => (error.id === id ? { ...error, status: "Resolved" } : error)))
    resolveError(id)
  }

  const clearResolvedErrors = () => {
    setErrors((prev) => prev.filter((error) => error.status !== "Resolved"))
  }

  const filteredErrors = errors.filter((error) => {
    const matchesSearch =
      error.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === "All" || error.severity === filterSeverity
    const matchesStatus = filterStatus === "All" || error.status === filterStatus

    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive"
      case "Warning":
        return "default" // Changed from default to secondary for blue
      case "Info":
        return "secondary" // Changed from secondary to default for green
      default:
        return "secondary"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <XCircle className="w-4 h-4" />
      case "Warning":
        return <AlertTriangle className="w-4 h-4" />
      case "Info":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "Acknowledged":
        return <Clock className="w-4 h-4 text-blue-500" /> // Changed from yellow-500 to blue-500
      case "Resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const activeErrors = errors.filter((e) => e.status === "Active").length
  const activeCriticalErrors = errors.filter((e) => e.severity === "Critical" && e.status === "Active").length

  return (
    <div className={`p-6 space-y-6 pb-24 transition-colors duration-500 ${isFlashing ? "bg-red-50" : "bg-white"}`}>
      <div className="flex items-center justify-between">
        <h1
          className={`text-3xl font-bold transition-colors duration-500 ${isFlashing ? "text-red-600" : "text-black"}`}
        >
          Error & Alert Management
        </h1>
        <div className="flex gap-2">
          <Button onClick={clearResolvedErrors} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Resolved
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {activeCriticalErrors > 0 && (
        <Alert variant="destructive" className={`${isFlashing ? "animate-pulse" : ""}`}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {activeCriticalErrors} critical error{activeCriticalErrors > 1 ? "s" : ""} require immediate attention!
            System has been automatically stopped.
          </AlertDescription>
        </Alert>
      )}

      {/* Maintenance User Controls */}
      {currentUser.role === "Maintenance" && acknowledgedErrors > 0 && (
        <Alert className="bg-blue-50 border-blue-200">
          {" "}
          {/* Changed from yellow-50/yellow-200 to blue */}
          <Clock className="h-4 w-4 text-blue-600" /> {/* Changed from yellow-600 to blue-600 */}
          <AlertDescription className="flex items-center justify-between">
            <span>
              You have {acknowledgedErrors} acknowledged error{acknowledgedErrors > 1 ? "s" : ""} to resolve.
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Continue Operation
              </Button>
              <Button size="sm" variant="destructive">
                Stop System
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Error Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={isFlashing ? "border-red-300" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isFlashing ? "text-red-600" : "text-red-500"}`}>{activeErrors}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" /> {/* Changed from yellow-500 to blue-500 */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{acknowledgedErrors}</div>{" "}
            {/* Changed from yellow-500 to blue-500 */}
            <p className="text-xs text-muted-foreground">Being addressed</p>
          </CardContent>
        </Card>

        <Card className={isFlashing ? "border-red-300" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isFlashing ? "text-red-600 animate-pulse" : "text-red-600"}`}>
              {activeCriticalErrors}
            </div>
            <p className="text-xs text-muted-foreground">System stopped</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errors.length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search errors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="severity">Severity</Label>
              <select
                id="severity"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="Warning">Warning</option>
                <option value="Info">Info</option>
              </select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setFilterSeverity("All")
                  setFilterStatus("All")
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error List */}
      <Card className={isFlashing ? "border-red-300" : ""}>
        <CardHeader>
          <CardTitle>Error Log ({filteredErrors.length} entries)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredErrors.map((error) => (
              <div
                key={error.id}
                className={`border rounded-lg p-4 space-y-3 transition-colors ${
                  error.severity === "Critical" && error.status === "Active" && isFlashing
                    ? "border-red-400 bg-red-50"
                    : error.status === "Acknowledged"
                      ? "border-blue-300 bg-blue-50" // Changed from yellow-300/yellow-50 to blue
                      : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(error.severity)}
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(error.severity) as any}>{error.severity}</Badge>
                        <Badge variant="outline">{error.code}</Badge>
                        <span className="text-sm font-medium">{error.component}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{error.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(error.status)}
                    <Badge
                      variant={
                        error.status === "Active"
                          ? "destructive"
                          : error.status === "Acknowledged"
                            ? "default" // Changed from default to secondary for blue
                            : "secondary"
                      }
                    >
                      {error.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="font-medium">{error.description}</p>
                  {error.instructions && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Instructions:</strong> {error.instructions}
                    </p>
                  )}
                </div>

                {error.status === "Active" && (
                  <div className="flex gap-2">
                    <Button onClick={() => handleAcknowledgeError(error.id)} variant="outline" size="sm">
                      Acknowledge
                    </Button>
                    {currentUser.role === "Maintenance" && (
                      <Button onClick={() => handleResolveError(error.id)} variant="default" size="sm">
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                )}

                {error.status === "Acknowledged" && currentUser.role === "Maintenance" && (
                  <div className="flex gap-2">
                    <Button onClick={() => handleResolveError(error.id)} variant="default" size="sm">
                      Mark Resolved
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {filteredErrors.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No errors found matching the current filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
