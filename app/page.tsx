'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { fetchProfile } from '@/lib/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import {
  Package,
  Loader2,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Box,
  Layers,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Laptop,
  Database,
  Clock,
  Bell,
  FileText,
  Settings,
  Star,
  Award,
  Target,
  Rocket,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Try to restore session from localStorage
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // User is logged in → redirect to dashboard
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading || (isAuthenticated && !isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-slate-900 dark:text-slate-50" />
      </div>
    );
  }

  const features = [
    {
      icon: Box,
      title: 'Asset Tracking',
      description: 'Track all your IT assets in one centralized system'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Get insights with powerful dashboards and reports'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security for your data'
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      description: 'Lightning-fast performance and intuitive interface'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team'
    },
    {
      icon: TrendingUp,
      title: 'Growth Ready',
      description: 'Scales with your business needs'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-50 dark:to-slate-300 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white dark:text-slate-900" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400 bg-clip-text text-transparent">
                AssetPro
              </span>
            </div>

            <div className="flex items-center gap-3">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cycleTheme}
                  className="rounded-full"
                >
                  {theme === 'system' ? (
                    <Monitor className="h-5 w-5" />
                  ) : theme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              )}
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900">
                <Link href="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 border-slate-200 dark:border-slate-700">
            <Sparkles className="h-3 w-3 mr-1" />
            Modern Asset Management
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-50 dark:via-slate-300 dark:to-slate-50 bg-clip-text text-transparent">
              Manage Your Assets
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              With Confidence
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Streamline your inventory management with our powerful, intuitive platform.
            Track, manage, and optimize your assets in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 text-lg px-8">
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span>Free forever plan</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className="mt-16 max-w-6xl mx-auto">
          <Card className="overflow-hidden border-2 shadow-2xl">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-8 sm:p-12">
                <div className="bg-white dark:bg-slate-950 rounded-lg shadow-xl p-6 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded px-3 py-1 text-xs text-slate-600 dark:text-slate-400">
                      assetpro.app/dashboard
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded"></div>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="h-20 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded"></div>
                      <div className="h-20 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 rounded"></div>
                      <div className="h-20 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded"></div>
                      <div className="h-20 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 rounded"></div>
                    </div>
                    <div className="h-32 bg-slate-100 dark:bg-slate-900 rounded"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Uptime</p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent mb-2">
              500K+
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Assets Tracked</p>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Support</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-50 border-blue-200 dark:border-blue-800">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Premium Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400 bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Powerful features to help you manage your IT assets efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-slate-900 dark:hover:border-slate-50 transition-all hover:shadow-lg group cursor-pointer">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-slate-900 dark:text-slate-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-slate-100/50 to-slate-50/50 dark:from-slate-900/50 dark:to-slate-800/50 rounded-3xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-50 border-purple-200 dark:border-purple-800">
            <Rocket className="h-3 w-3 mr-1" />
            Simple Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400 bg-clip-text text-transparent">
            Get Started in Minutes
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Three simple steps to transform your asset management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="relative">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Account</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Sign up for free in seconds. No credit card required.
              </p>
            </div>
            <div className="hidden md:block absolute top-8 -right-4 text-slate-300 dark:text-slate-700">
              <ChevronRight className="h-8 w-8" />
            </div>
          </div>

          <div className="relative">
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Your Assets</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Import or manually add your IT assets to the system.
              </p>
            </div>
            <div className="hidden md:block absolute top-8 -right-4 text-slate-300 dark:text-slate-700">
              <ChevronRight className="h-8 w-8" />
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Start Managing</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Track, analyze, and optimize your asset inventory.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-50 border-green-200 dark:border-green-800">
            <Target className="h-3 w-3 mr-1" />
            Use Cases
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400 bg-clip-text text-transparent">
            Perfect For Every Team
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <Card className="border-2 hover:shadow-xl transition-all group">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 p-3 rounded-xl">
                  <Laptop className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">IT Departments</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Track laptops, servers, and hardware across your organization
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Hardware management
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Software license tracking
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Maintenance scheduling
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl transition-all group">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 p-3 rounded-xl">
                  <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Operations Teams</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Manage equipment, supplies, and operational assets
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Real-time stock levels
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Automated alerts
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Usage analytics
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl transition-all group">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Finance Teams</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Track asset depreciation and financial reporting
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Asset valuation tracking
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Depreciation reports
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Budget planning
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl transition-all group">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 p-3 rounded-xl">
                  <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Facilities Management</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Manage building assets and maintenance schedules
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Equipment maintenance
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Location tracking
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Service history
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Advanced Features Showcase */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-900 dark:text-cyan-50 border-cyan-200 dark:border-cyan-800">
            <Zap className="h-3 w-3 mr-1" />
            Advanced Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400 bg-clip-text text-transparent">
            Powerful Features Built In
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="border-2 overflow-hidden group hover:shadow-2xl transition-all">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Real-Time Analytics</h3>
                <p className="text-blue-100">
                  Get instant insights into your asset performance
                </p>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Live dashboard updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Custom report builder</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Export to multiple formats</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 overflow-hidden group hover:shadow-2xl transition-all">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white">
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                  <Bell className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Smart Notifications</h3>
                <p className="text-green-100">
                  Never miss important updates or deadlines
                </p>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Automated alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Maintenance reminders</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Low stock warnings</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 overflow-hidden group hover:shadow-2xl transition-all">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white">
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Team Collaboration</h3>
                <p className="text-orange-100">
                  Work together seamlessly across departments
                </p>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Role-based permissions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Activity tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Comment & notes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 overflow-hidden group hover:shadow-2xl transition-all">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 text-white">
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                  <Layers className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-2">API Integration</h3>
                <p className="text-purple-100">
                  Connect with your existing tools and workflows
                </p>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">RESTful API access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Webhook support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Third-party integrations</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-slate-100/50 to-slate-50/50 dark:from-slate-900/50 dark:to-slate-800/50 rounded-3xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-50 border-emerald-200 dark:border-emerald-800">
            <Shield className="h-3 w-3 mr-1" />
            Trust & Security
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400 bg-clip-text text-transparent">
            Enterprise-Grade Security
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Your data security is our top priority
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 text-center hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-800/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">SSL Encryption</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                256-bit SSL encryption for all data transfers
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 text-center hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-800/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Daily Backups</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Automated daily backups with 99.9% uptime
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 text-center hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-800/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">SOC 2 Certified</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Independently audited security standards
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 text-center hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/30 dark:to-amber-800/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Monitoring</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Round-the-clock security monitoring
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Trusted by leading organizations worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-slate-400 dark:text-slate-600">COMPANY</div>
            <div className="text-2xl font-bold text-slate-400 dark:text-slate-600">BRAND</div>
            <div className="text-2xl font-bold text-slate-400 dark:text-slate-600">CORP</div>
            <div className="text-2xl font-bold text-slate-400 dark:text-slate-600">TECH</div>
            <div className="text-2xl font-bold text-slate-400 dark:text-slate-600">GLOBAL</div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-50 border-yellow-200 dark:border-yellow-800">
            <Award className="h-3 w-3 mr-1 fill-current" />
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400 bg-clip-text text-transparent">
            Loved by Teams Worldwide
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                "AssetPro transformed how we manage our IT inventory. The interface is intuitive and the reporting features are outstanding!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div>
                  <div className="font-semibold text-sm">John Doe</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">IT Manager, TechCorp</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                "We've saved countless hours with automated tracking and alerts. The ROI was immediate and substantial."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                  SM
                </div>
                <div>
                  <div className="font-semibold text-sm">Sarah Miller</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Operations Lead, GlobalCo</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                "Best asset management solution we've used. The team collaboration features are game-changing!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold">
                  MJ
                </div>
                <div>
                  <div className="font-semibold text-sm">Mike Johnson</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">CFO, StartupXYZ</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-50 border-indigo-200 dark:border-indigo-800">
            <Sparkles className="h-3 w-3 mr-1" />
            Simple Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 hover:shadow-xl transition-all">
            <CardContent className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Starter</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-slate-600 dark:text-slate-400">/month</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Perfect for small teams getting started
                </p>
              </div>
              <Button asChild className="w-full mb-6" variant="outline">
                <Link href="/register">Get Started Free</Link>
              </Button>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Up to 100 assets</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Basic reporting</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Mobile app access</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-slate-900 dark:border-slate-50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <CardContent className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Professional</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-slate-600 dark:text-slate-400">/month</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  For growing teams with advanced needs
                </p>
              </div>
              <Button asChild className="w-full mb-6 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900">
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Unlimited assets</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>API access</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Custom integrations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 hover:shadow-xl transition-all">
            <CardContent className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  For large organizations with custom needs
                </p>
              </div>
              <Button asChild className="w-full mb-6" variant="outline">
                <Link href="/register">Contact Sales</Link>
              </Button>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Custom training</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>SLA guarantee</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>On-premise option</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-slate-100/50 to-slate-50/50 dark:from-slate-900/50 dark:to-slate-800/50 rounded-3xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-pink-100 dark:bg-pink-900/30 text-pink-900 dark:text-pink-50 border-pink-200 dark:border-pink-800">
            <Bell className="h-3 w-3 mr-1" />
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about AssetPro
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-start gap-2">
                <span className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">?</span>
                How does the free plan work?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Our free plan includes up to 100 assets with basic features. No credit card required, and you can upgrade anytime as your needs grow.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-start gap-2">
                <span className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">?</span>
                Can I import existing data?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Yes! AssetPro supports CSV imports and integrates with popular tools. Our team can help you migrate your existing asset data seamlessly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-start gap-2">
                <span className="bg-gradient-to-br from-green-500 to-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">?</span>
                Is my data secure?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Absolutely. We use enterprise-grade encryption, regular backups, and comply with industry standards including SOC 2 and GDPR.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-start gap-2">
                <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">?</span>
                What kind of support do you offer?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                We offer email support for all plans, priority support for Pro users, and dedicated support for Enterprise customers with 24/7 availability.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-start gap-2">
                <span className="bg-gradient-to-br from-red-500 to-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">?</span>
                Can I cancel anytime?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees. Your data remains accessible during your billing period.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-start gap-2">
                <span className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">?</span>
                Do you offer training?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Yes! We provide comprehensive documentation, video tutorials, and webinars. Enterprise customers get personalized onboarding and training sessions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <CardContent className="p-12 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-medium text-white">Limited Time Offer</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Join thousands of companies managing their assets with AssetPro. Start your free trial today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-white hover:bg-white/90 text-purple-600 text-lg px-8 shadow-xl font-semibold">
                  <Link href="/register">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" asChild className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white text-lg px-8 shadow-xl font-semibold">
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/80">
                No credit card required • Free forever plan • Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-50 dark:to-slate-300 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-white dark:text-slate-900" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400 bg-clip-text text-transparent">
                  AssetPro
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-sm">
                The modern solution for inventory management. Track, manage, and optimize your assets with ease.
              </p>
              <div className="flex gap-3">
                <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </Button>
                <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </Button>
                <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </Button>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/register" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/register" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                © {new Date().getFullYear()} AssetPro. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-slate-600 dark:text-slate-400">
                <Link href="/register" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/register" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/register" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
