"use client"

/**
 * Home Page Component
 * 
 * Reason: Main bingo game interface with all interactive features
 * Called by: Next.js routing
 * Input: None
 * Output: Complete bingo game interface
 */

import { useState, useEffect } from "react"
import { BingoBoard } from "@/components/bingo-board"
import { WinDialog } from "@/components/win-dialog"
import { GameSettingsDialog } from "@/components/game-settings-dialog"
import { CustomProfileDialog } from "@/components/custom-profile-dialog"
import { InsufficientValuesDialog } from "@/components/insufficient-values-dialog"
import { Button } from "@/components/ui/button"
import { Settings, Loader2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Profile {
  name: string
  values_count: number
}

interface BingoData {
  size: number
  cells: string[][]
  profile: string
  free_space: boolean
}

interface PendingGeneration {
  size: number
  profile: string
  freeSpace: boolean
  customValues?: string[]
}

export default function Home() {
  const [bingoData, setBingoData] = useState<BingoData | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Dialog states
  const [winDialogOpen, setWinDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [insufficientDialogOpen, setInsufficientDialogOpen] = useState(false)
  
  // Insufficient values state
  const [insufficientData, setInsufficientData] = useState<{
    needed: number
    available: number
  } | null>(null)
  
  // Pending generation for custom profile flow
  const [pendingGeneration, setPendingGeneration] = useState<PendingGeneration | null>(null)
  const [customValues, setCustomValues] = useState<string[]>([])

  /**
   * Fetch available profiles from API
   * 
   * Reason: Get list of available bingo profiles
   * Called by: useEffect on mount
   * Input: None
   * Output: Updates profiles state
   */
  const fetchProfiles = async () => {
    try {
      const response = await fetch(`${API_URL}/profiles`)
      if (!response.ok) throw new Error("Failed to fetch profiles")
      const data = await response.json()
      setProfiles(data)
    } catch (err) {
      console.error("Error fetching profiles:", err)
      setError("Failed to load profiles. Is the backend running?")
    }
  }

  /**
   * Generate default bingo board
   * 
   * Reason: Create initial 5x5 bingo with first available profile
   * Called by: useEffect on mount
   * Input: None
   * Output: Updates bingoData state
   */
  const generateDefaultBingo = async () => {
    if (profiles.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          size: 5,
          profile: profiles[0].name,
          free_space: false
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to generate bingo")
      }

      const data = await response.json()
      setBingoData(data)
    } catch (err) {
      console.error("Error generating bingo:", err)
      setError(err instanceof Error ? err.message : "Failed to generate bingo")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Generate bingo with specific settings
   * 
   * Reason: Create custom bingo board based on user preferences
   * Called by: GameSettingsDialog, strategy selection
   * Input: settings (object) - Board configuration
   * Output: Updates bingoData state or shows insufficient values dialog
   */
  const generateBingo = async (
    settings: { size: number; profile: string; freeSpace: boolean; customValues?: string[] },
    strategy?: "repeat" | "blank"
  ) => {
    setLoading(true)
    setError(null)

    try {
      const endpoint = strategy ? `${API_URL}/generate-with-strategy?strategy=${strategy}` : `${API_URL}/generate`
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          size: settings.size,
          profile: settings.profile,
          custom_values: settings.customValues,
          free_space: settings.freeSpace
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Check for insufficient values error
        if (errorData.detail?.error === "insufficient_values") {
          setInsufficientData({
            needed: errorData.detail.needed,
            available: errorData.detail.available
          })
          setPendingGeneration(settings)
          setInsufficientDialogOpen(true)
          setLoading(false)
          return
        }
        
        throw new Error(errorData.detail || "Failed to generate bingo")
      }

      const data = await response.json()
      setBingoData(data)
      setPendingGeneration(null)
    } catch (err) {
      console.error("Error generating bingo:", err)
      setError(err instanceof Error ? err.message : "Failed to generate bingo")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle custom profile submission
   * 
   * Reason: Process user-provided custom values
   * Called by: CustomProfileDialog
   * Input: values (string[]) - Custom bingo values
   * Output: Generates bingo with custom values
   */
  const handleCustomProfile = (values: string[]) => {
    setCustomValues(values)
    if (pendingGeneration) {
      generateBingo({
        ...pendingGeneration,
        customValues: values
      })
    }
  }

  /**
   * Handle insufficient values strategy selection
   * 
   * Reason: Apply user's choice for handling insufficient values
   * Called by: InsufficientValuesDialog
   * Input: strategy ("repeat" | "blank") - Handling strategy
   * Output: Generates bingo with selected strategy
   */
  const handleStrategy = (strategy: "repeat" | "blank") => {
    if (pendingGeneration) {
      generateBingo(pendingGeneration, strategy)
    }
  }

  // Load profiles on mount
  useEffect(() => {
    fetchProfiles()
  }, [])

  // Generate default bingo once profiles are loaded
  useEffect(() => {
    if (profiles.length > 0 && !bingoData) {
      generateDefaultBingo()
    }
  }, [profiles])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              Bingo Game
            </h1>
            <p className="text-muted-foreground">
              Mark cells to complete a row, column, or diagonal!
            </p>
          </div>
          
          <Button
            size="lg"
            onClick={() => setSettingsDialogOpen(true)}
            className="gap-2"
            disabled={loading}
          >
            <Settings className="w-5 h-5" />
            Custom Game
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Generating your bingo board...</p>
          </div>
        )}

        {/* Bingo Board */}
        {!loading && bingoData && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Profile: <strong className="text-foreground">{bingoData.profile}</strong> • 
                Size: <strong className="text-foreground">{bingoData.size}×{bingoData.size}</strong>
                {bingoData.free_space && <> • <strong className="text-foreground">FREE SPACE enabled</strong></>}
              </p>
            </div>
            
            <BingoBoard
              cells={bingoData.cells}
              size={bingoData.size}
              onWin={() => setWinDialogOpen(true)}
            />

            {bingoData.profile === "custom" && customValues.length > 0 && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomDialogOpen(true)}
                >
                  View Custom Values
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Dialogs */}
      <WinDialog
        open={winDialogOpen}
        onOpenChange={setWinDialogOpen}
        onNewGame={() => setSettingsDialogOpen(true)}
        onStay={() => {}}
      />

      <GameSettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        onGenerate={generateBingo}
        onCustomProfile={() => {
          setCustomDialogOpen(true)
        }}
        profiles={profiles}
      />

      <CustomProfileDialog
        open={customDialogOpen}
        onOpenChange={setCustomDialogOpen}
        onSubmit={handleCustomProfile}
        currentValues={customValues}
      />

      {insufficientData && (
        <InsufficientValuesDialog
          open={insufficientDialogOpen}
          onOpenChange={setInsufficientDialogOpen}
          needed={insufficientData.needed}
          available={insufficientData.available}
          onStrategy={handleStrategy}
          onChangeSettings={() => setSettingsDialogOpen(true)}
        />
      )}
    </div>
  )
}
