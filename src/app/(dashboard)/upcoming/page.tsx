"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Sparkles, Clock, CheckCircle2 } from "lucide-react";

export default function UpcomingPage() {
  const upcomingFeatures = [
    {
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive analytics with charts, graphs, and insights for better decision making.",
      status: "In Development",
      icon: Sparkles,
      color: "bg-blue-500",
    },
    {
      title: "Multi-warehouse Support",
      description: "Manage assets across multiple warehouse locations with ease.",
      status: "Planned",
      icon: Rocket,
      color: "bg-purple-500",
    },
    {
      title: "Barcode Scanner Integration",
      description: "Scan barcodes to quickly add, update, or track products in your assets.",
      status: "In Development",
      icon: CheckCircle2,
      color: "bg-green-500",
    },
    {
      title: "Automated Reorder Alerts",
      description: "Get notified when stock levels are low and automate reordering process.",
      status: "Planned",
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      title: "Supplier Management",
      description: "Track and manage relationships with suppliers, orders, and delivery schedules.",
      status: "Planned",
      icon: Rocket,
      color: "bg-pink-500",
    },
    {
      title: "Export & Reporting",
      description: "Export assets data to CSV, Excel, and PDF formats with custom reports.",
      status: "In Development",
      icon: Sparkles,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Upcoming Features
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Exciting new features and improvements coming soon to AssetPro
        </p>
      </div>

      {/* Hero Card */}
      <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-slate-900 dark:bg-slate-50 rounded-full mb-4">
            <Rocket className="w-10 h-10 text-white dark:text-slate-900" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            We're Building Something Amazing
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Our team is working hard to bring you powerful new features that will make assets management even easier and more efficient.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upcomingFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`flex items-center justify-center w-12 h-12 ${feature.color} rounded-lg mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge 
                    variant={feature.status === "In Development" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {feature.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Footer Note */}
      <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex-shrink-0">
              <Sparkles className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                Have a feature request?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We'd love to hear your ideas! Contact us to suggest new features or improvements you'd like to see in AssetPro.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

