/**
 * About Page Component
 * 
 * Reason: Provide information about the bingo website
 * Called by: Next.js routing
 * Input: None
 * Output: About page content
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, Github, Heart } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <Home className="w-4 h-4" />
              Back to Game
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold text-primary mb-2">
            About Bingo Site
          </h1>
          <p className="text-lg text-muted-foreground">
            A modern, customizable bingo game for every occasion
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is this?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bingo Site is a customizable web-based bingo game that lets you play with predefined themes
                or create your own custom bingo cards. Perfect for meetings, movie nights, parties, or any
                gathering where you want to add some interactive fun!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Choose your settings:</strong> Click "Custom Game" to select board size (2×2 to 10×10),
                  pick a profile theme, and optionally enable a FREE SPACE in the center.
                </li>
                <li>
                  <strong>Mark your cells:</strong> Click on cells as events happen or items are mentioned.
                  A circle will appear to mark the cell.
                </li>
                <li>
                  <strong>Get a BINGO:</strong> Complete an entire row, column, or diagonal to win!
                  You'll get a congratulations popup.
                </li>
                <li>
                  <strong>Play again:</strong> Generate a new board anytime with different settings or the same theme.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Multiple Themes:</strong> Pre-loaded profiles including Office, Meeting, Movie Night, and Cooking Show bingo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Custom Values:</strong> Create your own bingo card with custom comma-separated values</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Flexible Board Sizes:</strong> Choose from 2×2 up to 10×10 grids</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>FREE SPACE Option:</strong> Enable a free center square for classic bingo feel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Dark Mode:</strong> Toggle between light and dark themes for comfortable viewing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Responsive Design:</strong> Works great on both desktop and mobile devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Smart Handling:</strong> Automatic detection and handling of insufficient values with multiple strategies</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Built with modern web technologies for a fast, responsive experience:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span><strong>Frontend:</strong> Next.js 16, React, TypeScript, Tailwind CSS</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span><strong>UI Components:</strong> shadcn/ui for beautiful, accessible components</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span><strong>Backend:</strong> Python FastAPI for blazing-fast API responses</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span><strong>Architecture:</strong> RESTful API with modular, documented code</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-destructive fill-destructive" />
                Made with Care
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                This project was built with attention to detail, proper documentation, and user experience in mind.
                Whether you're using it for virtual meetings, game nights, or any other occasion, we hope you have fun!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="w-5 h-5" />
              Start Playing
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
