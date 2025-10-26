"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import {
  Moon,
  Sun,
  User,
  Mail,
  Shield,
  Bell,
  Lock,
  Save,
  Palette,
  Database,
  Globe,
  Smartphone,
  AlertCircle,
  Monitor
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ChangePasswordDialog } from '@/components/settings/change-password-dialog';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Mock user data - in production, this would come from auth state
  const user = {
    name: "Admin User",
    email: "admin@example.com",
    role: "Administrator"
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 max-w-4xl">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 dark:bg-slate-50 rounded-lg">
                    <User className="h-5 w-5 text-white dark:text-slate-900" />
                  </div>
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      View and manage your account details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Avatar className="h-20 w-20 border-4 border-white dark:border-slate-800 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 text-white dark:text-slate-900 text-2xl font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{user.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                    <Badge className="mt-2 capitalize" variant="secondary">
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue={user.name}
                      className="bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user.email}
                      className="bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="flex items-center gap-2 text-sm font-medium">
                      <Shield className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      Role
                    </Label>
                    <Input
                      id="role"
                      defaultValue={user.role}
                      disabled
                      className="capitalize bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                      <Smartphone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="bg-white dark:bg-slate-950"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button onClick={handleSaveSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setChangePasswordOpen(true)}
                  >
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid gap-6 max-w-4xl">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 dark:bg-slate-50 rounded-lg">
                    <Palette className="h-5 w-5 text-white dark:text-slate-900" />
                  </div>
                  <div>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize how the application looks
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      {theme === 'dark' ? (
                        <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      )}
                      Dark Mode
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => {
                      setTheme(checked ? 'dark' : 'light');
                      toast.success(`Switched to ${checked ? 'dark' : 'light'} mode`);
                    }}
                  />
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border-2 border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-900 dark:hover:border-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <Sun className="h-5 w-5 text-amber-500" />
                      <h3 className="font-semibold">Light Theme</h3>
                    </div>
                    <div className="h-20 bg-gradient-to-br from-white to-slate-100 rounded border border-slate-200"></div>
                  </div>

                  <div className="p-4 border-2 border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-900 dark:hover:border-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <Moon className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold">Dark Theme</h3>
                    </div>
                    <div className="h-20 bg-gradient-to-br from-slate-900 to-slate-950 rounded border border-slate-700"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid gap-6 max-w-4xl">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 dark:bg-slate-50 rounded-lg">
                    <Bell className="h-5 w-5 text-white dark:text-slate-900" />
                  </div>
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Manage your notification preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      Low Stock Alerts
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Receive notifications when products are running low
                    </p>
                  </div>
                  <Switch
                    checked={lowStockAlerts}
                    onCheckedChange={(checked) => {
                      setLowStockAlerts(checked);
                      toast.success(`Low stock alerts ${checked ? 'enabled' : 'disabled'}`);
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-500" />
                      Email Notifications
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Get email updates about your inventory
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={(checked) => {
                      setEmailNotifications(checked);
                      toast.success(`Email notifications ${checked ? 'enabled' : 'disabled'}`);
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-500" />
                      Product Updates
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Notifications when products are added or modified
                    </p>
                  </div>
                  <Switch
                    checked={productUpdates}
                    onCheckedChange={(checked) => {
                      setProductUpdates(checked);
                      toast.success(`Product updates ${checked ? 'enabled' : 'disabled'}`);
                    }}
                  />
                </div>

                <Separator />

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
                    <CardTitle className="text-red-600 dark:text-red-400">
                      Danger Zone
                    </CardTitle>
                    <CardDescription>
                      Irreversible actions for your account
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between p-4 border-2 border-red-200 dark:border-red-900 rounded-lg bg-white dark:bg-slate-950">
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
        </TabsContent>
      </Tabs>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </div>
  );
}
