"use client"

/**
 * Win Dialog Component
 * 
 * Reason: Congratulate user and offer next actions after winning
 * Called by: Home page when bingo is achieved
 * Input: 
 *   - open: Dialog visibility state
 *   - onOpenChange: Callback for dialog state change
 *   - onNewGame: Callback to generate new game
 *   - onStay: Callback to stay on current board
 * Output: Congratulations dialog with action buttons
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trophy, RotateCcw, Eye } from "lucide-react"

interface WinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNewGame: () => void
  onStay: () => void
}

export function WinDialog({
  open,
  onOpenChange,
  onNewGame,
  onStay
}: WinDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Trophy className="w-12 h-12 text-primary animate-bounce" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            🎉 Bingo! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Congratulations! You've completed a row, column, or diagonal!
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onStay()
              onOpenChange(false)
            }}
            className="w-full sm:w-auto gap-2"
          >
            <Eye className="w-4 h-4" />
            Stay on Board
          </Button>
          <Button
            onClick={() => {
              onNewGame()
              onOpenChange(false)
            }}
            className="w-full sm:w-auto gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
