"use client"

/**
 * Custom Profile Dialog Component
 * 
 * Reason: Allow users to input custom comma-separated values for bingo
 * Called by: Home page
 * Input: 
 *   - open: Dialog visibility state
 *   - onOpenChange: Callback for dialog state change
 *   - onSubmit: Callback with custom values
 * Output: Dialog for custom profile creation
 */

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Copy, Check } from "lucide-react"

interface CustomProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: string[]) => void
  currentValues?: string[]
}

export function CustomProfileDialog({
  open,
  onOpenChange,
  onSubmit,
  currentValues = []
}: CustomProfileDialogProps) {
  const [input, setInput] = useState(currentValues.join(", "))
  const [copied, setCopied] = useState(false)

  /**
   * Handle form submission
   * 
   * Reason: Parse and validate comma-separated values
   * Called by: Submit button click
   * Input: None (uses input state)
   * Output: None (calls onSubmit callback)
   */
  const handleSubmit = () => {
    const values = input
      .split(",")
      .map(v => v.trim())
      .filter(v => v.length > 0)
    
    if (values.length === 0) {
      alert("Please enter at least one value!")
      return
    }
    
    onSubmit(values)
    onOpenChange(false)
  }

  /**
   * Copy values to clipboard
   * 
   * Reason: Allow users to save their custom values
   * Called by: Copy button click
   * Input: None
   * Output: None (copies to clipboard)
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const valueCount = input
    .split(",")
    .map(v => v.trim())
    .filter(v => v.length > 0).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Custom Bingo Values</DialogTitle>
          <DialogDescription>
            Enter your custom values separated by commas. Each value will be a potential cell in your bingo board.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Example: Coffee break, Meeting, Email, Phone call, Deadline, ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>{valueCount} value{valueCount !== 1 ? "s" : ""} entered</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Values
                </>
              )}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Use These Values
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
