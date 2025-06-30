"use client"

import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Home,
  Activity,
  Camera,
  CombineIcon as Conveyor,
  BarChart3,
  AlertTriangle,
  User,
  Play,
  Square,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, createContext, useContext, useEffect } from "react"
import "./globals.css"

// System Context for global state management
interface SystemContextType {
  isRunning: boolean
  systemStatus: "Active" | "Idle" | "Error"
  criticalErrors: number
  acknowledgedErrors: number
  startSystem: () => void
  stopSystem: () => void
  emergencyStop: () => void
  addError: (error: any) => void
  resolveError: (id: string) => void
  acknowledgeError: (id: string) => void
}

const SystemContext = createContext<SystemContextType | null>(null)

export const useSystem = () => {
  const context = useContext(SystemContext)
  if (!context) {
    throw new Error("useSystem must be used within SystemProvider")
  }
  return context
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Process Flow",
    url: "/process-flow",
    icon: Activity,
  },
  {
    title: "Camera & Vision",
    url: "/camera",
    icon: Camera,
  },
  {
    title: "Conveyors",
    url: "/conveyors",
    icon: Conveyor,
  },
  {
    title: "Statistics",
    url: "/statistics",
    icon: BarChart3,
  },
  {
    title: "Errors & Alerts",
    url: "/errors",
    icon: AlertTriangle,
  },
  {
    title: "User & Roles",
    url: "/login",
    icon: User,
  },
]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isRunning, setIsRunning] = useState(true)
  const [systemStatus, setSystemStatus] = useState<"Active" | "Idle" | "Error">("Active")
  const [criticalErrors, setCriticalErrors] = useState(0)
  const [acknowledgedErrors, setAcknowledgedErrors] = useState(0)
  const [errors, setErrors] = useState<any[]>([])

  // Add state for current time to avoid hydration mismatch
  const [currentTime, setCurrentTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<string>("")

  useEffect(() => {
    // Set initial values
    const now = new Date()
    setCurrentTime(now.toLocaleTimeString())
    setCurrentDate(now.toLocaleDateString())

    // Update time every second
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())
      setCurrentDate(now.toLocaleDateString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const startSystem = () => {
    if (criticalErrors === 0) {
      setIsRunning(true)
      setSystemStatus("Active")
    }
  }

  const stopSystem = () => {
    setIsRunning(false)
    setSystemStatus("Idle")
  }

  const emergencyStop = () => {
    setIsRunning(false)
    setSystemStatus("Error")
  }

  const addError = (error: any) => {
    setErrors((prev) => [error, ...prev])
    if (error.severity === "Critical") {
      setCriticalErrors((prev) => prev + 1)
      setIsRunning(false)
      setSystemStatus("Error")
    }
  }

  const resolveError = (id: string) => {
    setErrors((prev) => prev.map((error) => (error.id === id ? { ...error, status: "Resolved" } : error)))
    const resolvedError = errors.find((e) => e.id === id)
    if (resolvedError?.severity === "Critical") {
      setCriticalErrors((prev) => Math.max(0, prev - 1))
    }
    if (resolvedError?.status === "Acknowledged") {
      setAcknowledgedErrors((prev) => Math.max(0, prev - 1))
    }
  }

  const acknowledgeError = (id: string) => {
    setErrors((prev) => prev.map((error) => (error.id === id ? { ...error, status: "Acknowledged" } : error)))
    setAcknowledgedErrors((prev) => prev + 1)
  }

  const systemContextValue: SystemContextType = {
    isRunning,
    systemStatus,
    criticalErrors,
    acknowledgedErrors,
    startSystem,
    stopSystem,
    emergencyStop,
    addError,
    resolveError,
    acknowledgeError,
  }

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find((item) => item.url === pathname)
    return currentItem ? currentItem.title : "Dashboard"
  }

  return (
    <SystemContext.Provider value={systemContextValue}>
      <SidebarProvider>
        <div className="flex flex-col min-h-screen">
          {/* Top Bar - Project Name and Controls */}
          <header className="fixed top-0 left-0 right-0 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-6 bg-white z-50 shadow-sm">
            {/* Project Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">KUKA Cube Sorting System</h1>
                <p className="text-sm text-gray-500">Industrial Automation HMI</p>
              </div>
            </div>

            {/* System Controls and Status */}
            <div className="flex items-center gap-6">
              {/* System Control Buttons */}
              <div className="flex items-center gap-3 py-2 bg-gray-50 rounded-lg border px-4">
                <span className="text-sm font-medium text-gray-700">System Controls:</span>
                <Button
                  onClick={startSystem}
                  disabled={isRunning && systemStatus === "Active"}
                  className="bg-green-600 hover:bg-green-700 h-8"
                  size="sm"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Start
                </Button>
                <Button
                  onClick={stopSystem}
                  disabled={!isRunning && systemStatus === "Idle"}
                  variant="outline"
                  className="h-8 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  size="sm"
                >
                  <Square className="w-3 h-3 mr-1" />
                  Stop
                </Button>
                <Button
                  onClick={emergencyStop}
                  variant="destructive"
                  className="h-8 bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Emergency
                </Button>
              </div>

              {/* System Status */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      systemStatus === "Active"
                        ? "bg-green-500"
                        : systemStatus === "Error"
                          ? "bg-red-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      systemStatus === "Active"
                        ? "text-green-600"
                        : systemStatus === "Error"
                          ? "text-red-600"
                          : "text-blue-600"
                    }`}
                  >
                    {systemStatus}
                  </span>
                </div>
              </div>

              {/* Error Indicators */}
              {(criticalErrors > 0 || acknowledgedErrors > 0) && (
                <div className="flex items-center gap-2">
                  {criticalErrors > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      {criticalErrors} Critical
                    </div>
                  )}
                  {acknowledgedErrors > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                      <AlertCircle className="w-3 h-3" />
                      {acknowledgedErrors} Pending
                    </div>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* Page Title Bar */}
          <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-6 bg-gray-50 mt-16">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-800">{getCurrentPageTitle()}</h2>
              <div className="text-sm text-gray-500">
                {/* Use client-rendered date/time to avoid hydration mismatch */}
                {currentDate} • {currentTime}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              User: <span className="font-medium">Operator</span> • Session: 2h 15m
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1">
            <main className="w-full max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-none md:shadow-sm pb-24 pt-8 px-2 md:px-8 flex flex-col gap-8">
              {children}
            </main>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 h-20 border-t bg-white z-40 shadow-lg">
            <div className="p-2 h-full">
              <div className="flex flex-row justify-center items-center gap-1 h-full">
                {menuItems.map((item) => (
                  <div key={item.title} className="flex-shrink-0">
                    <Link
                      href={item.url}
                      className={`flex flex-col h-16 w-20 p-2 text-xs transition-all duration-200 rounded-lg items-center justify-center gap-1 ${
                        pathname === item.url
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : item.title === "Errors & Alerts" && criticalErrors > 0
                            ? "hover:bg-red-100 text-red-600 animate-pulse bg-red-50 border border-red-200"
                            : item.title === "Errors & Alerts" && acknowledgedErrors > 0
                              ? "hover:bg-blue-100 text-blue-600 animate-pulse bg-blue-50 border border-blue-200"
                              : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          pathname === item.url
                            ? "text-blue-600"
                            : item.title === "Errors & Alerts" && criticalErrors > 0
                              ? "text-red-600"
                              : item.title === "Errors & Alerts" && acknowledgedErrors > 0
                                ? "text-blue-600"
                                : ""
                        }`}
                      />
                      <span className="text-center leading-tight font-medium">{item.title}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Error Indicator Icon - Bottom Right */}
          {(criticalErrors > 0 || acknowledgedErrors > 0) && (
            <div className="fixed bottom-24 right-6 z-50">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg animate-pulse cursor-pointer transition-all duration-300 ${
                  criticalErrors > 0 ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={() => (window.location.href = "/errors")}
              >
                <AlertTriangle className="w-6 h-6 text-white" />
                <div
                  className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    criticalErrors > 0 ? "bg-red-700" : "bg-blue-700"
                  }`}
                >
                  {criticalErrors > 0 ? criticalErrors : acknowledgedErrors}
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarProvider>
    </SystemContext.Provider>
  )
}
