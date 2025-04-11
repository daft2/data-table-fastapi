import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ItemDetails } from "@/components/item-details";
import { ItemDetailsSkeleton } from "@/components/skeletons";

export default async function ItemPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to list
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
      </div>

      <Suspense fallback={<ItemDetailsSkeleton />}>
        <ItemDetails id={id} />
      </Suspense>
    </div>
  );
}
