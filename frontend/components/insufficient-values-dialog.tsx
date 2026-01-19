"use client"

/**
 * Insufficient Values Dialog Component
 * 
 * Reason: Handle cases where profile doesn't have enough values for board size
 * Called by: Home page when API returns insufficient values error
 * Input: 
 *   - open: Dialog visibility state
 *   - onOpenChange: Callback for dialog state change
 *   - needed: Number of values needed
 *   - available: Number of values available
 *   - onStrategy: Callback with selected strategy
 *   - onChangeSettings: Callback to change size/profile
 * Output: Dialog with strategy selection options
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
import { AlertTriangle, Repeat, Square, Settings } from "lucide-react"

interface InsufficientValuesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  needed: number
  available: number
  onStrategy: (strategy: "repeat" | "blank") => void
  onChangeSettings: () => void
}

export function InsufficientValuesDialog({
  open,
  onOpenChange,
  needed,
  available,
  onStrategy,
  onChangeSettings
}: InsufficientValuesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-center">
            Not Enough Values
          </DialogTitle>
          <DialogDescription className="text-center">
            You need <strong>{needed}</strong> values but only <strong>{available}</strong> are available.
            How would you like to proceed?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4"
            onClick={() => {
              onStrategy("repeat")
              onOpenChange(false)
            }}
          >
            <Repeat className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold">Repeat Values</div>
              <div className="text-sm text-muted-foreground">
                Use values multiple times to fill the board
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4"
            onClick={() => {
              onStrategy("blank")
              onOpenChange(false)
            }}
          >
            <Square className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold">Add Blank Cells</div>
              <div className="text-sm text-muted-foreground">
                Fill remaining cells with empty spaces
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4"
            onClick={() => {
              onChangeSettings()
              onOpenChange(false)
            }}
          >
            <Settings className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold">Change Settings</div>
              <div className="text-sm text-muted-foreground">
                Pick a different size or profile
              </div>
            </div>
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
