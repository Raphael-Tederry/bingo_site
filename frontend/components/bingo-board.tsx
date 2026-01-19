"use client"

/**
 * Bingo Board Component
 * 
 * Reason: Display and manage the interactive bingo grid
 * Called by: Home page
 * Input: 
 *   - cells: 2D array of cell values
 *   - size: Grid dimensions
 *   - onWin: Callback when bingo is achieved
 * Output: Interactive bingo board with marking functionality
 */

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface BingoBoardProps {
  cells: string[][]
  size: number
  onWin: () => void
}

export function BingoBoard({ cells, size, onWin }: BingoBoardProps) {
  const [marked, setMarked] = useState<boolean[][]>(
    Array(size).fill(null).map(() => Array(size).fill(false))
  )
  const [hasWon, setHasWon] = useState(false)

  // Mark free space automatically if present
  useEffect(() => {
    const center = Math.floor(size / 2)
    if (cells[center]?.[center]?.includes("FREE")) {
      setMarked(prev => {
        const newMarked = prev.map(row => [...row])
        newMarked[center][center] = true
        return newMarked
      })
    }
  }, [cells, size])

  /**
   * Check if there's a winning condition
   * 
   * Reason: Detect rows, columns, or diagonals that are fully marked
   * Called by: useEffect when marked state changes
   * Input: marked (boolean[][]) - Current marked state
   * Output: boolean - True if there's a win
   */
  const checkWin = (marked: boolean[][]): boolean => {
    // Check rows
    for (let row = 0; row < size; row++) {
      if (marked[row].every(cell => cell)) {
        return true
      }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      if (marked.every(row => row[col])) {
        return true
      }
    }

    // Check diagonal (top-left to bottom-right)
    if (marked.every((row, i) => row[i])) {
      return true
    }

    // Check diagonal (top-right to bottom-left)
    if (marked.every((row, i) => row[size - 1 - i])) {
      return true
    }

    return false
  }

  // Check for win whenever marks change
  useEffect(() => {
    if (!hasWon && checkWin(marked)) {
      setHasWon(true)
      onWin()
    }
  }, [marked, hasWon, onWin])

  /**
   * Toggle a cell's marked state
   * 
   * Reason: Handle user clicks on bingo cells
   * Called by: Cell click handler
   * Input: row (number), col (number) - Cell coordinates
   * Output: None (updates state)
   */
  const toggleCell = (row: number, col: number) => {
    if (hasWon) return // Prevent marking after win
    
    setMarked(prev => {
      const newMarked = prev.map(r => [...r])
      newMarked[row][col] = !newMarked[row][col]
      return newMarked
    })
  }

  /**
   * Calculate responsive cell size
   * 
   * Reason: Make cells adapt to screen size and grid dimensions
   * Called by: Cell className
   * Input: None
   * Output: string - Tailwind size classes
   */
  const getCellSize = () => {
    if (size <= 3) return "w-24 h-24 sm:w-32 sm:h-32 text-base sm:text-lg"
    if (size <= 5) return "w-16 h-16 sm:w-24 sm:h-24 text-xs sm:text-sm"
    if (size <= 7) return "w-12 h-12 sm:w-20 sm:h-20 text-xs"
    return "w-10 h-10 sm:w-16 sm:h-16 text-[10px] sm:text-xs"
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div 
        className="inline-grid gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
        }}
      >
        {cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => toggleCell(rowIndex, colIndex)}
              className={cn(
                getCellSize(),
                "relative border-2 rounded-lg font-medium transition-all duration-200",
                "flex items-center justify-center text-center p-2",
                "hover:scale-105 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-primary",
                marked[rowIndex][colIndex]
                  ? "bg-primary/10 border-primary shadow-lg"
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              <span className="relative z-10 leading-tight break-words max-w-full">
                {cell}
              </span>
              
              {/* Marking Donut Overlay */}
              {marked[rowIndex][colIndex] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1">
                  <Image 
                    src="/donut-marker.png" 
                    alt="Marked" 
                    width={100}
                    height={100}
                    className="w-full h-full object-contain animate-in zoom-in-50 duration-200 opacity-60"
                    priority
                  />
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
