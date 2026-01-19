"use client"

/**
 * Game Settings Dialog Component
 * 
 * Reason: Allow users to configure bingo game parameters
 * Called by: Home page
 * Input: 
 *   - open: Dialog visibility state
 *   - onOpenChange: Callback for dialog state change
 *   - onGenerate: Callback with game settings
 *   - profiles: Available profile options
 * Output: Dialog for game configuration
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Profile {
  name: string
  values_count: number
}

interface GameSettings {
  size: number
  profile: string
  freeSpace: boolean
}

interface GameSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (settings: GameSettings) => void
  onCustomProfile: () => void
  profiles: Profile[]
}

export function GameSettingsDialog({
  open,
  onOpenChange,
  onGenerate,
  onCustomProfile,
  profiles
}: GameSettingsDialogProps) {
  const [size, setSize] = useState(5)
  const [profile, setProfile] = useState("")
  const [freeSpace, setFreeSpace] = useState(false)

  /**
   * Handle generate button click
   * 
   * Reason: Validate and submit game settings
   * Called by: Generate button
   * Input: None (uses component state)
   * Output: None (calls onGenerate or onCustomProfile)
   */
  const handleGenerate = () => {
    if (!profile) {
      alert("Please select a profile!")
      return
    }

    if (profile === "custom") {
      onCustomProfile()
      return
    }

    onGenerate({ size, profile, freeSpace })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Generate Custom Bingo</DialogTitle>
          <DialogDescription>
            Configure your bingo board size, profile, and options.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Size Selection */}
          <div className="space-y-2">
            <Label htmlFor="size">Board Size</Label>
            <Select
              value={size.toString()}
              onValueChange={(val) => setSize(parseInt(val))}
            >
              <SelectTrigger id="size">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                  <SelectItem key={s} value={s.toString()}>
                    {s} × {s} ({s * s} cells)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Profile Selection */}
          <div className="space-y-2">
            <Label htmlFor="profile">Profile</Label>
            <Select value={profile} onValueChange={setProfile}>
              <SelectTrigger id="profile">
                <SelectValue placeholder="Select profile" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((p) => (
                  <SelectItem key={p.name} value={p.name}>
                    {p.name.charAt(0).toUpperCase() + p.name.slice(1)} ({p.values_count} values)
                  </SelectItem>
                ))}
                <SelectItem value="custom">
                  🎨 Custom (your own values)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Free Space Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="freeSpace"
              checked={freeSpace}
              onCheckedChange={(checked) => setFreeSpace(checked as boolean)}
            />
            <Label
              htmlFor="freeSpace"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Enable center FREE SPACE
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate}>
            Generate Bingo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
