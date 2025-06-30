"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Settings, Clock, Eye, User } from "lucide-react"

interface UserType {
  id: string
  username: string
  role: "Operator" | "Maintenance" | "Admin"
  lastLogin: string
  permissions: string[]
}

interface ActivityLog {
  id: string
  user: string
  action: string
  timestamp: string
  details: string
}

export default function LoginRole() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")

  const users: UserType[] = [
    {
      id: "1",
      username: "operator1",
      role: "Operator",
      lastLogin: "2024-01-15 08:30:00",
      permissions: ["view_dashboard", "start_stop_system", "view_statistics"],
    },
    {
      id: "2",
      username: "maintenance1",
      role: "Maintenance",
      lastLogin: "2024-01-15 07:15:00",
      permissions: [
        "view_dashboard",
        "start_stop_system",
        "view_statistics",
        "manage_conveyors",
        "adjust_camera",
        "view_errors",
      ],
    },
    {
      id: "3",
      username: "admin1",
      role: "Admin",
      lastLogin: "2024-01-15 06:45:00",
      permissions: ["all_permissions", "manage_users", "system_settings", "export_data"],
    },
  ]

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: "1",
      user: "admin1",
      action: "System Settings Changed",
      timestamp: "2024-01-15 14:30:00",
      details: "Updated conveyor speed limits",
    },
    {
      id: "2",
      user: "maintenance1",
      action: "Camera Calibration",
      timestamp: "2024-01-15 13:45:00",
      details: "Adjusted color detection thresholds",
    },
    {
      id: "3",
      user: "operator1",
      action: "System Start",
      timestamp: "2024-01-15 08:30:00",
      details: "Started production cycle",
    },
    {
      id: "4",
      user: "admin1",
      action: "User Login",
      timestamp: "2024-01-15 06:45:00",
      details: "Successful admin login",
    },
  ])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    // Demo login logic
    const user = users.find((u) => u.username === loginForm.username)

    if (!user) {
      setLoginError("Invalid username or password")
      return
    }

    // In a real system, you would verify the password
    if (loginForm.password === "demo123") {
      setCurrentUser(user)

      // Add login activity
      const newActivity: ActivityLog = {
        id: Date.now().toString(),
        user: user.username,
        action: "User Login",
        timestamp: new Date().toLocaleString(),
        details: `Successful ${user.role.toLowerCase()} login`,
      }
      setActivityLogs((prev) => [newActivity, ...prev])

      setLoginForm({ username: "", password: "" })
    } else {
      setLoginError("Invalid username or password")
    }
  }

  const handleLogout = () => {
    if (currentUser) {
      const newActivity: ActivityLog = {
        id: Date.now().toString(),
        user: currentUser.username,
        action: "User Logout",
        timestamp: new Date().toLocaleString(),
        details: `${currentUser.role} logout`,
      }
      setActivityLogs((prev) => [newActivity, ...prev])
    }
    setCurrentUser(null)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "destructive" // Red
      case "Maintenance":
        return "default" // Blue
      case "Operator":
        return "secondary" // Green
      default:
        return "secondary"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Shield className="w-4 h-4" />
      case "Maintenance":
        return <Settings className="w-4 h-4" />
      case "Operator":
        return <User className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 pb-24">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">KUKA HMI System</h1>
            <p className="text-muted-foreground mt-2">Please sign in to continue</p>
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>

                {loginError && (
                  <Alert variant="destructive">
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Demo Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>Operator:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">operator1 / demo123</code>
                </div>
                <div className="flex justify-between items-center">
                  <span>Maintenance:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">maintenance1 / demo123</code>
                </div>
                <div className="flex justify-between items-center">
                  <span>Admin:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">admin1 / demo123</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management & Access Control</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      {/* Current User Info */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Current User Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                {getRoleIcon(currentUser.role)}
              </div>
              <div>
                <div className="font-medium text-lg">{currentUser.username}</div>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleColor(currentUser.role) as any}>{currentUser.role}</Badge>
                  <span className="text-sm text-muted-foreground">Last login: {currentUser.lastLogin}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Session active</div>
              <div className="text-sm font-medium">2h 15m</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Current Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentUser.role === "Admin" ? (
                <Badge variant="destructive" className="mb-2">
                  All System Permissions
                </Badge>
              ) : null}

              <div className="grid grid-cols-1 gap-2">
                {currentUser.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    {" "}
                    {/* Changed from gray-50 to green-50 */}
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm capitalize">{permission.replace("_", " ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Access Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentUser.role === "Operator" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-sm">Cannot modify system settings</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-sm">Cannot access maintenance functions</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-sm">Cannot manage users</span>
                  </div>
                </div>
              )}

              {currentUser.role === "Maintenance" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                    {" "}
                    {/* Changed from yellow-50 to blue-50 */}
                    <div className="w-2 h-2 bg-blue-500 rounded-full" /> {/* Changed from yellow-500 to blue-500 */}
                    <span className="text-sm">Limited system settings access</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-sm">Cannot manage users</span>
                  </div>
                </div>
              )}

              {currentUser.role === "Admin" && (
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">Full system access granted</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Users (Admin only) */}
      {currentUser.role === "Admin" && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRoleColor(user.role) as any}>{user.role}</Badge>
                        <span className="text-sm text-muted-foreground">Last: {user.lastLogin}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Reset Password
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Log */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{log.action}</div>
                  <div className="text-sm text-muted-foreground">
                    by {log.user} • {log.details}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{log.timestamp}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
