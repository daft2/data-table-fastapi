import { Suspense } from "react"
import DataTable from "@/components/data-table"
import { TableSkeleton } from "@/components/skeletons"
import { SearchFilters } from "@/components/search-filters"

export default function HomePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          View and manage your data with advanced filtering and sorting capabilities.
        </p>
      </div>

      <SearchFilters />

      <Suspense fallback={<TableSkeleton />}>
        <DataTable />
      </Suspense>
    </div>
  )
}
