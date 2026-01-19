"use client"

/**
 * Navigation Bar Component
 * 
 * Reason: Provide top navigation with dark mode toggle and actions
 * Called by: Root layout
 * Input: None
 * Output: Navigation bar with dark mode toggle and menu options
 */

import { Moon, Sun, Plus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import Link from "next/link"

export function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            🎯 Bingo Site
          </Link>
          
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Game
              </Button>
            </Link>
            
            <Link href="/comments">
              <Button variant="ghost" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Comments</span>
              </Button>
            </Link>
            
            <Link href="/about">
              <Button variant="ghost" size="sm">
                About
              </Button>
            </Link>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="ml-2"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
