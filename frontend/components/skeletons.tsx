import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Card } from "@/components/ui/card"

export function TableSkeleton() {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function ItemDetailsSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Card>
          <Skeleton className="w-full pt-[100%] rounded-lg" />
        </Card>

        <div className="md:hidden">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <Skeleton className="w-full pt-[80%]" />
              <div className="p-2">
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
              </div>
            </Card>
            <Card>
              <Skeleton className="w-full pt-[80%]" />
              <div className="p-2">
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-start justify-between">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-48 mt-2" />
        </div>

        <Skeleton className="h-8 w-24" />

        <Skeleton className="h-24 w-full rounded-lg" />

        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>

        <div className="hidden md:block mt-4">
          <Skeleton className="h-px w-full mb-4" />
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="w-full pt-[70%]" />
                <div className="p-2">
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
