"use client"

/**
 * Comments/Suggestions Page Component
 * 
 * Reason: Allow users to read and submit suggestions and comments
 * Called by: Next.js routing
 * Input: None
 * Output: Comments page with form and list
 */

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, Loader2, User, Clock } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Comment {
  id: string
  username: string
  comment: string
  timestamp: string
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [username, setUsername] = useState("")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  /**
   * Fetch all comments from API
   * 
   * Reason: Load existing comments for display
   * Called by: useEffect on mount and after new comment
   * Input: None
   * Output: Updates comments state
   */
  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/comments`)
      if (!response.ok) throw new Error("Failed to fetch comments")
      const data = await response.json()
      setComments(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching comments:", err)
      setError("Failed to load comments. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Submit a new comment
   * 
   * Reason: Post user's comment to the backend
   * Called by: Form submission
   * Input: None (uses form state)
   * Output: Updates comments list and resets form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim() || !comment.trim()) {
      setError("Please provide both username and comment")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          comment: comment.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to submit comment")
      }

      // Success! Reset form and reload comments
      setUsername("")
      setComment("")
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      await fetchComments()
    } catch (err) {
      console.error("Error submitting comment:", err)
      setError(err instanceof Error ? err.message : "Failed to submit comment")
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Format timestamp to readable date
   * 
   * Reason: Display human-readable dates
   * Called by: Comment rendering
   * Input: timestamp (string) - ISO timestamp
   * Output: string - Formatted date
   */
  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return "Unknown date"
    }
  }

  // Load comments on mount
  useEffect(() => {
    fetchComments()
  }, [])

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center gap-3">
            <MessageSquare className="w-10 h-10" />
            Suggestions & Comments
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your thoughts, suggestions, or feedback about the Bingo Site!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Comment Form */}
          <Card className="h-fit sticky top-4">
            <CardHeader>
              <CardTitle>Add Your Comment</CardTitle>
              <CardDescription>
                Share your feedback, suggestions, or just say hello!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Your Name</Label>
                  <Input
                    id="username"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={50}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px]"
                    maxLength={1000}
                    disabled={submitting}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {comment.length}/1000 characters
                  </p>
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive text-destructive px-3 py-2 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-primary/10 border border-primary text-primary px-3 py-2 rounded-md text-sm">
                    ✓ Comment submitted successfully!
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={submitting || !username.trim() || !comment.trim()}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Comment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">
              Recent Comments ({comments.length})
            </h2>

            {loading && (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {!loading && comments.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </CardContent>
              </Card>
            )}

            {!loading && comments.map((comment) => (
              <Card key={comment.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{comment.username}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          {formatDate(comment.timestamp)}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {comment.comment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
