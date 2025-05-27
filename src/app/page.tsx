import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";
import {
  FaRocket,
  FaShieldAlt,
  FaStar,
  FaBars,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaCheck,
  FaBolt,
  FaMagic,
  FaCog,
  FaGem,
  FaRobot,
  FaChartLine,
  FaFileAlt,
  FaDownload,
} from "react-icons/fa";
import { HiSparkles, HiLightningBolt, HiShieldCheck } from "react-icons/hi";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function LandingPage() {
  const user = await currentUser();
  console.log("Current user data:", user);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <FaBolt className="h-8 w-8 text-blue-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-2xl font-bold gradient-text">ResumeAI</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/sign-in">
                <Button variant="ghost" className="hidden md:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 lg:py-32 xl:py-40 overflow-hidden">
          {/* Background with animated elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-purple-950/20"></div>
          <div className="absolute inset-0 bg-grid-pattern"></div>

          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg opacity-15 animate-float"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="space-y-6">
                <Badge
                  variant="secondary"
                  className="w-fit bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 border-0"
                >
                  <HiSparkles className="w-4 h-4 mr-1 text-blue-500" />
                  AI-Powered Resume Builder
                </Badge>

                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="gradient-text">Land Your Dream Job</span>{" "}
                  <br className="hidden sm:inline" />
                  With <span className="gradient-text-3">
                    AI-Optimized
                  </span>{" "}
                  Resumes
                </h1>

                <p className="max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                  Create{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    ATS-friendly resumes
                  </span>{" "}
                  that stand out with our AI-powered resume assistant. Get
                  real-time ATS scores and expert suggestions tailored to your
                  target roles.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                >
                  <FaRobot className="mr-2 h-5 w-5" />
                  Build Your Resume
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-10 text-lg border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
                >
                  <FaFileAlt className="mr-2 h-5 w-5" />
                  See Examples
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <FaCheck className="h-4 w-4 text-green-500" />
                  <span>ATS optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheck className="h-4 w-4 text-green-500" />
                  <span>AI-enhanced work experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheck className="h-4 w-4 text-green-500" />
                  <span>Professional templates</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-purple-950/20"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 border-0"
                >
                  <FaGem className="w-4 h-4 mr-1 text-cyan-500" />
                  Features
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything you need to{" "}
                  <span className="gradient-text-3">land your dream job</span>
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered platform helps you create professional resumes
                  that beat ATS systems and impress recruiters.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-6xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <FaRobot className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">AI-Powered Writing</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Let our AI assistant write compelling bullet points and
                    optimize your work experience for maximum impact.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-cyan-950/50 dark:to-purple-950/50 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
                      <FaChartLine className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Real-Time ATS Scoring</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Get instant feedback on your resume's ATS compatibility with
                    detailed scoring and improvement suggestions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <HiLightningBolt className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Smart Templates</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Choose from professionally designed templates that are
                    optimized for different industries and roles.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                      <HiShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Industry Optimization</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Tailor your resume for specific industries with AI-driven
                    keyword optimization and formatting.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 border-0"
                >
                  <FaStar className="w-4 h-4 mr-1 text-purple-500" />
                  Success Stories
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Trusted by job seekers{" "}
                  <span className="gradient-text-2">worldwide</span>
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See how ResumeAI has helped thousands land their dream jobs
                  with AI-optimized resumes.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="h-4 w-4 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "ResumeAI helped me increase my ATS score from 67% to 94%. I
                    got 3 interview calls within a week of updating my resume!"
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                      SJ
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">
                        Software Engineer
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="h-4 w-4 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "The AI writing assistant is incredible. It transformed my
                    boring job descriptions into compelling achievements that
                    recruiters love."
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      MC
                    </div>
                    <div>
                      <p className="text-sm font-medium">Michael Chen</p>
                      <p className="text-xs text-muted-foreground">
                        Product Manager
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="h-4 w-4 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Finally landed my dream job at Google! The ATS optimization
                    and industry-specific suggestions made all the difference."
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold">
                      ER
                    </div>
                    <div>
                      <p className="text-sm font-medium">Emily Rodriguez</p>
                      <p className="text-xs text-muted-foreground">
                        Data Scientist
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-purple-950/20"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 border-0"
                >
                  <FaCog className="w-4 h-4 mr-1 text-blue-500" />
                  Pricing
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Choose your <span className="gradient-text-3">plan</span>
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start free and upgrade as you land more interviews. All plans
                  include AI-powered resume optimization.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card className="border-0 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FaRocket className="h-5 w-5 text-gray-500" />
                    <span>Free</span>
                  </CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="text-3xl font-bold">
                    $0
                    <span className="text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">1 AI-optimized resume</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Basic ATS scoring</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">3 template designs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">PDF download</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    Get Started Free
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 shadow-xl hover:shadow-2xl transition-all scale-105 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                    <FaMagic className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FaBolt className="h-5 w-5 text-blue-500" />
                    <span>Pro</span>
                  </CardTitle>
                  <CardDescription>For serious job seekers</CardDescription>
                  <div className="text-3xl font-bold gradient-text">
                    $19
                    <span className="text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Unlimited AI-optimized resumes
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Advanced ATS optimization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">20+ premium templates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">AI writing assistant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Industry-specific optimization
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">
                    Start Free Trial
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FaShieldAlt className="h-5 w-5 text-purple-500" />
                    <span>Enterprise</span>
                  </CardTitle>
                  <CardDescription>For teams and organizations</CardDescription>
                  <div className="text-3xl font-bold gradient-text-2">
                    Custom
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Everything in Pro</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Team collaboration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Custom branding</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Analytics dashboard</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                    Contact Sales
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-purple-600"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to land your dream job?
                </h2>
                <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of job seekers who have already landed their
                  dream jobs with AI-optimized resumes. Start building your
                  winning resume today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="h-12 px-8 bg-white text-blue-600 hover:bg-gray-100 border-0 shadow-lg hover:shadow-xl transition-all"
                >
                  <FaRobot className="mr-2 h-4 w-4" />
                  Start Building Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 border-white text-white hover:bg-white/10"
                >
                  <FaDownload className="mr-2 h-4 w-4" />
                  Download Sample
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-blue-100">
                <div className="flex items-center space-x-1">
                  <FaCheck className="h-4 w-4 text-green-300" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaCheck className="h-4 w-4 text-green-300" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaCheck className="h-4 w-4 text-green-300" />
                  <span>Instant ATS scoring</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="contact"
        className="w-full py-6 bg-gradient-to-br from-gray-900 to-black text-white"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FaBolt className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">ResumeAI</span>
              </div>
              <p className="text-sm text-gray-300">
                AI-powered resume builder that helps you land your dream job
                with optimized, ATS-friendly resumes.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <FaFacebookF className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <FaTwitter className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <FaLinkedinIn className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <FaInstagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Resume Builder
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    ATS Optimizer
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Templates
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    AI Writing Assistant
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Resume Examples
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Career Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Interview Prep
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-gray-400">
              © 2024 ResumeAI. All rights reserved.
            </p>
            <div className="flex space-x-4 text-xs text-gray-400">
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
