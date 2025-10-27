"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/store/hooks";
import { ChangePasswordDialog } from "@/components/settings/change-password-dialog";
import {
  User,
  Mail,
  Shield,
  Bell,
  Lock,
  Save,
  Database,
  Smartphone,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const { user } = useAppSelector((state: any) => state.auth);

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 dark:bg-slate-50 rounded-lg">
                <User className="h-5 w-5 text-white dark:text-slate-900" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>View and manage your account details</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Profile Summary */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <Avatar className="h-20 w-20 border-4 border-white dark:border-slate-800 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 text-white dark:text-slate-900 text-2xl font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50">
                  {user.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 flex justify-center sm:justify-start items-center gap-2 mt-1">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </p>
                <div className="flex justify-center sm:justify-start">
                  <Badge className="mt-2 capitalize" variant="secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  Full Name
                </Label>
                <Input id="name" defaultValue={user.name} className="bg-white dark:bg-slate-950" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  Email Address
                </Label>
                <Input id="email" type="email" defaultValue={user.email} className="bg-white dark:bg-slate-950" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  Role
                </Label>
                <Input id="role" value={user.role} readOnly disabled className="capitalize bg-slate-50 dark:bg-slate-900" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  Phone Number
                </Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-white dark:bg-slate-950" />
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSaveSettings} className="gap-2 w-full sm:w-auto">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="gap-2 w-full sm:w-auto"
                onClick={() => setChangePasswordOpen(true)}
              >
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <div className="space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 dark:bg-slate-50 rounded-lg">
                  <Bell className="h-5 w-5 text-white dark:text-slate-900" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              {[
                {
                  title: "Low Stock Alerts",
                  desc: "Receive notifications when products are running low",
                  icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
                  state: lowStockAlerts,
                  setState: setLowStockAlerts,
                },
                {
                  title: "Email Notifications",
                  desc: "Get email updates about your assets",
                  icon: <Mail className="h-5 w-5 text-blue-500" />,
                  state: emailNotifications,
                  setState: setEmailNotifications,
                },
                {
                  title: "Product Updates",
                  desc: "Notifications when products are added or modified",
                  icon: <Database className="h-5 w-5 text-green-500" />,
                  state: productUpdates,
                  setState: setProductUpdates,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg"
                >
                  <div className="space-y-1">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <Switch
                    checked={item.state}
                    onCheckedChange={(checked) => {
                      item.setState(checked);
                      toast.success(`${item.title} ${checked ? "enabled" : "disabled"}`);
                    }}
                  />
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSettings} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-900 shadow-sm">
            <CardHeader className="bg-red-50 dark:bg-red-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600 dark:bg-red-500 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your account</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-2 border-red-200 dark:border-red-900 rounded-lg bg-white dark:bg-slate-950">
                <div className="space-y-1">
                  <Label className="text-base font-semibold text-red-600 dark:text-red-400">
                    Delete Account
                  </Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Permanently delete your account and all data. This action cannot be undone.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => toast.error("Account deletion is currently disabled")}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </div>
  );
}
