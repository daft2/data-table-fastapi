"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp, ArrowUpDown, MoreHorizontal, Pencil, Trash2, AlertCircle } from "lucide-react"
import { fetchItems, getBrands, getCategories } from "@/lib/data"
import type { Item, Brand, Category, Status } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useDebouncedCallback } from "use-debounce"

export default function DataTable() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get search params
  const search = searchParams.get("search") || ""
  const sortField = searchParams.get("sortField") || "id"
  const sortDirection = searchParams.get("sortDirection") || "asc"
  const category = searchParams.get("category") || "all"

  // State
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableWidth, setTableWidth] = useState(0)
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])

  // Dialog states
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [deleteItem, setDeleteItem] = useState<Item | null>(null)
  const [formData, setFormData] = useState<Partial<Item>>({})

  // Refs
  const parentRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const headerRef = useRef<HTMLTableSectionElement>(null)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Fetch items, categories, and brands in parallel
        const [itemsData, categoriesData, brandsData] = await Promise.all([fetchItems(), getCategories(), getBrands()])

        setItems(itemsData)
        setCategories(categoriesData)
        setBrands(brandsData)
        setLoading(false)
      } catch (err) {
        setError("Failed to load data from the API")
        setLoading(false)
        toast({
          title: "API Error",
          description: "Failed to load data. Please check if the API server is running.",
          variant: "destructive",
        })
      }
    }

    loadData()
  }, [toast])

  // Measure table and column widths
  useEffect(() => {
    if (headerRef.current) {
      const headerCells = headerRef.current.querySelectorAll("th")
      const widths: { [key: string]: number } = {}

      headerCells.forEach((cell, index) => {
        widths[index] = cell.getBoundingClientRect().width
      })

      setColumnWidths(widths)

      if (tableRef.current) {
        setTableWidth(tableRef.current.getBoundingClientRect().width)
      }
    }

    const handleResize = () => {
      if (headerRef.current) {
        const headerCells = headerRef.current.querySelectorAll("th")
        const widths: { [key: string]: number } = {}

        headerCells.forEach((cell, index) => {
          widths[index] = cell.getBoundingClientRect().width
        })

        setColumnWidths(widths)

        if (tableRef.current) {
          setTableWidth(tableRef.current.getBoundingClientRect().width)
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [filteredItems.length])

  // Filter and sort data
  const filterAndSortData = useDebouncedCallback(() => {
    if (!items.length) return

    let result = [...items]

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.id.toString().includes(searchLower) ||
          (item.brand && item.brand.toLowerCase().includes(searchLower)),
      )
    }

    // Filter by category
    if (category && category !== "all") {
      result = result.filter((item) => item.category === category)
    }

    // Sort data
    result.sort((a, b) => {
      const aValue = a[sortField as keyof Item]
      const bValue = b[sortField as keyof Item]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // For numbers and other types
      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredItems(result)
  }, 300)

  // Apply filters when dependencies change
  useEffect(() => {
    filterAndSortData()
  }, [items, search, sortField, sortDirection, category, filterAndSortData])

  // Set up virtualizer
  const rowVirtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // Approximate row height
    overscan: 10,
  })

  // Handle row click
  const handleRowClick = (id: string) => {
    router.push(`/items/${id}`)
  }

  // Handle sort
  const handleSort = (field: string) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc"

    const params = new URLSearchParams(searchParams.toString())
    params.set("sortField", field)
    params.set("sortDirection", newDirection)
    router.push(`/?${params.toString()}`)
  }

  // Handle edit
  const handleEdit = (item: Item, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      brand: item.brand,
      price: item.price,
      status: item.status,
      color: item.color,
    })
  }

  // Handle delete
  const handleDelete = (item: Item, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteItem(item)
  }

  // Handle form input change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editItem) return

    // In a real app, you would make an API call to update the item
    // For now, we'll just update it in the local state

    // Update item in the items array
    const updatedItems = items.map((item) => {
      if (item.id === editItem.id) {
        return {
          ...item,
          ...formData,
          price: typeof formData.price === "string" ? Number.parseFloat(formData.price) : formData.price,
        }
      }
      return item
    })

    setItems(updatedItems)
    setEditItem(null)

    toast({
      title: "Item updated",
      description: `${editItem.name} has been updated successfully.`,
    })
  }

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (!deleteItem) return

    // In a real app, you would make an API call to delete the item
    // For now, we'll just remove it from the local state

    // Remove item from the items array
    const updatedItems = items.filter((item) => item.id !== deleteItem.id)
    setItems(updatedItems)
    setDeleteItem(null)

    toast({
      title: "Item deleted",
      description: `${deleteItem.name} has been deleted successfully.`,
    })
  }

  // Helper function to get status badge styling
  const getStatusBadgeClasses = (status: Status) => {
    return status === "in stock"
      ? "bg-green-100 text-green-800"
      : status === "low stock"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800"
  }

  // Helper function to format status text for display
  const formatStatusText = (status: Status) => {
    return status === "in stock" ? "In Stock" : status === "low stock" ? "Low Stock" : "Out of Stock"
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-destructive font-medium text-lg">{error}</p>
        <p className="text-muted-foreground">Please check if the API server is running at http://localhost:8000</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div ref={parentRef} className="border rounded-md overflow-auto h-[calc(100vh-250px)] relative">
      <Table ref={tableRef}>
        <TableHeader ref={headerRef} className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-[80px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("id")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                ID
                {sortField === "id" ? (
                  sortDirection === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )
                ) : (
                  <ArrowUpDown className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Name
                {sortField === "name" ? (
                  sortDirection === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )
                ) : (
                  <ArrowUpDown className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("brand")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Brand
                {sortField === "brand" ? (
                  sortDirection === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )
                ) : (
                  <ArrowUpDown className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("category")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Category
                {sortField === "category" ? (
                  sortDirection === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )
                ) : (
                  <ArrowUpDown className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("price")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Price
                {sortField === "price" ? (
                  sortDirection === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )
                ) : (
                  <ArrowUpDown className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("status")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Status
                {sortField === "status" ? (
                  sortDirection === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )
                ) : (
                  <ArrowUpDown className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <tr style={{ height: `${rowVirtualizer.getTotalSize()}px` }} />
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = filteredItems[virtualRow.index]
            return (
              <TableRow
                key={virtualRow.index}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${tableWidth}px`,
                  display: "flex",
                }}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(item.id)}
              >
                <TableCell style={{ width: columnWidths[0] || "80px" }} className="flex items-center py-3">
                  {item.id}
                </TableCell>
                <TableCell style={{ width: columnWidths[1] || "auto" }} className="flex items-center font-medium py-3">
                  {item.name}
                </TableCell>
                <TableCell style={{ width: columnWidths[2] || "auto" }} className="flex items-center py-3">
                  {item.brand}
                </TableCell>
                <TableCell style={{ width: columnWidths[3] || "auto" }} className="flex items-center py-3">
                  {item.category}
                </TableCell>
                <TableCell style={{ width: columnWidths[4] || "auto" }} className="flex items-center py-3">
                  ${item.price.toFixed(2)}
                </TableCell>
                <TableCell style={{ width: columnWidths[5] || "auto" }} className="flex items-center py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                      item.status,
                    )}`}
                  >
                    {formatStatusText(item.status)}
                  </span>
                </TableCell>
                <TableCell style={{ width: columnWidths[6] || "80px" }} className="flex items-center justify-end py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleEdit(item, e as React.MouseEvent)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDelete(item, e as React.MouseEvent)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}

          {/* Empty state */}
          {filteredItems.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Make changes to the item details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name || ""} onChange={handleFormChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleFormChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select value={formData.brand} onValueChange={(value) => handleSelectChange("brand", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price || ""}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value as Status)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in stock">In Stock</SelectItem>
                      <SelectItem value="low stock">Low Stock</SelectItem>
                      <SelectItem value="out of stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <Select value={formData.color} onValueChange={(value) => handleSelectChange("color", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Red">Red</SelectItem>
                    <SelectItem value="Blue">Blue</SelectItem>
                    <SelectItem value="Green">Green</SelectItem>
                    <SelectItem value="Black">Black</SelectItem>
                    <SelectItem value="White">White</SelectItem>
                    <SelectItem value="Gray">Gray</SelectItem>
                    <SelectItem value="Yellow">Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item
              {deleteItem && ` "${deleteItem.name}"`} from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
