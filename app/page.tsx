"use client"

import type React from "react"
import { useState } from "react"
import { Search, Loader2, ArrowRight, Code2, Database, Layers, Palette, Server, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { detectTechStack } from "@/lib/detect-tech-stack"
import type { TechStackResult } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function Home() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<TechStackResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) return

    try {
      setIsLoading(true)
      setError(null)
      setResults(null) // Clear previous results

      // Validate URL format
      let urlToCheck = url
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        urlToCheck = `https://${url}`
      }

      const result = await detectTechStack(urlToCheck)
      setResults(result)
    } catch (err) {
      setError("Failed to analyze the website. Please check the URL and try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Frontend Frameworks":
        return <Code2 className="h-5 w-5" />
      case "Database & Storage":
        return <Database className="h-5 w-5" />
      case "JavaScript Libraries":
        return <Layers className="h-5 w-5" />
      case "CSS Frameworks":
        return <Palette className="h-5 w-5" />
      case "Web Servers":
        return <Server className="h-5 w-5" />
      case "Analytics":
        return <BarChart className="h-5 w-5" />
      default:
        return <Layers className="h-5 w-5" />
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a href="/" className="flex items-center space-x-2">
              <Layers className="h-6 w-6" />
              <span className="font-bold">Tech Stack Detector</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <nav className="flex items-center space-x-1">
              <a
                href="https://github.com/yourusername/tech-stack-detector"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 py-2 px-3"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px] items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Discover What Powers Any Website
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Instantly analyze and detect the technologies behind any website. From frameworks to databases,
                    we'll reveal the entire tech stack.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <Card className="overflow-hidden shadow-lg border-0">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-xl">Analyze Website</CardTitle>
                    <CardDescription>Enter a URL to detect its tech stack</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="https://example.com"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="pl-9 h-10 shadow-sm"
                        />
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full shadow-sm">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                          </>
                        ) : (
                          <>
                            Analyze <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {isLoading && (
          <section className="w-full py-12">
            <div className="container px-4 md:px-6">
              <Alert className="bg-muted shadow-sm border-0">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertTitle>Analyzing website...</AlertTitle>
                <AlertDescription>
                  This may take a moment as we're fetching and analyzing JavaScript files and other assets.
                </AlertDescription>
              </Alert>
            </div>
          </section>
        )}

        {error && !isLoading && (
          <section className="w-full py-12">
            <div className="container px-4 md:px-6">
              <Alert variant="destructive" className="shadow-sm border-0">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          </section>
        )}

        {results && !isLoading && (
          <section className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="w-full shadow-lg border-0">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl">Results for {results.url}</CardTitle>
                        <CardDescription>Technologies detected on this website</CardDescription>
                      </div>
                      <Badge variant="outline" className="w-fit shadow-sm">
                        {Object.values(results.technologies).flat().length} technologies found
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="frontend">Frontend</TabsTrigger>
                        <TabsTrigger value="database">Database</TabsTrigger>
                        <TabsTrigger value="css">CSS</TabsTrigger>
                        <TabsTrigger value="js">JavaScript</TabsTrigger>
                        <TabsTrigger value="backend">Backend</TabsTrigger>
                        <TabsTrigger value="other">Other</TabsTrigger>
                      </TabsList>

                      <TabsContent value="all" className="space-y-8">
                        {/* Highlight Firebase and Supabase if detected */}
                        {results.technologies["Database & Storage"]?.some(
                          (tech) => tech.name === "Firebase" || tech.name === "Supabase",
                        ) && (
                          <div className="bg-muted p-6 rounded-lg shadow-md">
                            <h3 className="font-medium text-xl mb-4 flex items-center">
                              <Database className="mr-2 h-5 w-5" /> Backend Services Detected
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {results.technologies["Database & Storage"]
                                .filter((tech) => tech.name === "Firebase" || tech.name === "Supabase")
                                .map((tech) => (
                                  <motion.div
                                    key={tech.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center gap-4 p-4 bg-background rounded-md shadow-sm"
                                  >
                                    {tech.icon && (
                                      <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-md bg-muted p-2">
                                        <img
                                          src={tech.icon || "/placeholder.svg"}
                                          alt={tech.name}
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-bold text-xl">{tech.name}</div>
                                      {tech.version && (
                                        <div className="text-sm text-muted-foreground">v{tech.version}</div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Display all other technologies by category */}
                        <div className="grid gap-8">
                          {Object.entries(results.technologies).map(([category, techs]) => (
                            <div key={category}>
                              <div className="flex items-center gap-2 mb-4">
                                {getCategoryIcon(category)}
                                <h3 className="font-medium text-xl">{category}</h3>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {techs
                                  .filter(
                                    (tech) =>
                                      !(
                                        category === "Database & Storage" &&
                                        (tech.name === "Firebase" || tech.name === "Supabase")
                                      ),
                                  )
                                  .map((tech, index) => (
                                    <motion.div
                                      key={`${tech.name}-${index}`}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.3, delay: index * 0.05 }}
                                      className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors shadow-sm"
                                    >
                                      {tech.icon ? (
                                        <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-muted p-1">
                                          <img
                                            src={tech.icon || "/placeholder.svg"}
                                            alt={tech.name}
                                            className="w-full h-full object-contain"
                                          />
                                        </div>
                                      ) : (
                                        <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-muted">
                                          <Layers className="h-4 w-4" />
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-medium">{tech.name}</div>
                                        {tech.version && (
                                          <div className="text-xs text-muted-foreground">v{tech.version}</div>
                                        )}
                                      </div>
                                    </motion.div>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="frontend" className="space-y-4">
                        {results.technologies["Frontend Frameworks"] ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {results.technologies["Frontend Frameworks"].map((tech, index) => (
                              <motion.div
                                key={`${tech.name}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors shadow-sm"
                              >
                                {tech.icon ? (
                                  <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-muted p-1">
                                    <img
                                      src={tech.icon || "/placeholder.svg"}
                                      alt={tech.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-muted">
                                    <Code2 className="h-4 w-4" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium">{tech.name}</div>
                                  {tech.version && <div className="text-xs text-muted-foreground">v{tech.version}</div>}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">No frontend frameworks detected</div>
                        )}
                      </TabsContent>

                      <TabsContent value="database" className="space-y-4">
                        {results.technologies["Database & Storage"] ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {results.technologies["Database & Storage"].map((tech, index) => (
                              <motion.div
                                key={`${tech.name}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors shadow-sm"
                              >
                                {tech.icon ? (
                                  <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-muted p-1">
                                    <img
                                      src={tech.icon || "/placeholder.svg"}
                                      alt={tech.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-muted">
                                    <Database className="h-4 w-4" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium">{tech.name}</div>
                                  {tech.version && <div className="text-xs text-muted-foreground">v{tech.version}</div>}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No database technologies detected
                          </div>
                        )}
                      </TabsContent>

                      {/* Similar TabsContent for other tabs */}
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        )}

        <section className="w-full py-16 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our tech stack detector provides comprehensive analysis of websites
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg p-6 bg-background shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Framework Detection</h3>
                <p className="text-center text-muted-foreground">
                  Identify frontend frameworks like React, Vue, Angular, and more
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-6 bg-background shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Database Detection</h3>
                <p className="text-center text-muted-foreground">
                  Discover backend services like Firebase, Supabase, MongoDB, and more
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-6 bg-background shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">CSS Framework Detection</h3>
                <p className="text-center text-muted-foreground">
                  Identify styling frameworks like Tailwind CSS, Bootstrap, and more
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 bg-background shadow-sm">
        <p className="text-xs text-muted-foreground">© 2023 Tech Stack Detector. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </>
  )
}
