"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"
import { getCategories } from "@/lib/data"
import type { Category } from "@/lib/types"

export function SearchFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const data = await getCategories()
        setCategories(data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load categories:", error)
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Update URL with debounce for search
  const updateSearchParams = useDebouncedCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }

    router.push(`${pathname}?${params.toString()}`)
  }, 300)

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    updateSearchParams("search", value)
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value)

    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== "all") {
      params.set("category", value)
    } else {
      params.delete("category")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearch("")
    setCategory("all")
    router.push(pathname)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, description, ID, or brand..."
          className="pl-8"
          value={search}
          onChange={handleSearchChange}
        />
        {search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => {
              setSearch("")
              updateSearchParams("search", "")
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      <Select value={category} onValueChange={handleCategoryChange} disabled={loading}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={loading ? "Loading..." : "Category"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(search || category !== "all") && (
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  )
}
