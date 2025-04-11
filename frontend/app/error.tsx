"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] space-y-4 text-center">
      <AlertCircle className="h-16 w-16 text-destructive" />
      <h2 className="text-2xl font-semibold">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md">An error occurred while loading this page. Please try again.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
