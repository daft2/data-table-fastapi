"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getItemById, getRelatedItems } from "@/lib/data";
import type { Item } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight,
  AlertCircle,
  Calendar,
  Scale,
  Ruler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ItemDetails({ id }: { id: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const itemData = await getItemById(id);

        if (!itemData) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        setItem(itemData);

        if (itemData) {
          const related = await getRelatedItems(itemData.category);
          setRelatedItems(
            related.filter((i) => i.id !== itemData.id).slice(0, 6)
          );
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load product details");
        setLoading(false);
        toast({
          title: "API Error",
          description:
            "Failed to load product details. Please check if the API server is running.",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [id, toast]);

  if (loading) {
    return null; // Skeleton is shown via Suspense
  }

  if (error || !item) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-destructive font-medium text-lg">
          {error || "Product not found"}
        </p>
        <p className="text-muted-foreground">
          Please check if the API server is running at http://localhost:8000
        </p>
        <Button asChild>
          <Link href="/">Back to Products</Link>
        </Button>
      </div>
    );
  }

  // Helper function to get status badge styling
  const getStatusBadgeClasses = (status: string) => {
    return status === "in stock"
      ? "bg-green-100 text-green-800"
      : status === "low stock"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
  };

  // Helper function to get status text
  const getStatusText = (status: string) => {
    return status === "in stock"
      ? "In Stock"
      : status === "low stock"
      ? "Low Stock"
      : "Out of Stock";
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Image Section */}
      <div className="flex flex-col gap-4">
        <Card className="overflow-hidden border rounded-lg shadow-sm">
          <div className="relative pt-[100%] w-full bg-gray-100">
            <Image
              src={item.image_url || "/placeholder.svg?height=600&width=600"}
              alt={item.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </Card>

        {/* Related Items - Mobile Only */}
        {relatedItems.length > 0 && (
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Related Items</h3>
              <Link href="/" className="text-sm text-primary flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {relatedItems.slice(0, 2).map((related) => (
                <Link
                  href={`/items/${related.id}`}
                  key={related.id}
                  className="block"
                >
                  <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                    <div className="relative pt-[80%] w-full bg-gray-50">
                      <Image
                        src={
                          related.image_url ||
                          "/placeholder.svg?height=200&width=200"
                        }
                        alt={related.name}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <CardContent className="p-2">
                      <h4 className="font-medium truncate text-sm">
                        {related.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-semibold">
                          ${related.price.toFixed(2)}
                        </p>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs ${getStatusBadgeClasses(
                            related.status
                          )}`}
                        >
                          {getStatusText(related.status).split(" ")[0]}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">{item.name}</h2>
            <Badge
              variant="outline"
              className={`ml-2 whitespace-nowrap ${getStatusBadgeClasses(
                item.status
              )}`}
            >
              {getStatusText(item.status)}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <span>ID: {item.id}</span>
            <span>•</span>
            <span>SKU: {item.sku}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">${item.price.toFixed(2)}</p>
        </div>

        {item.description && (
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-muted-foreground">{item.description}</p>
          </div>
        )}

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Category
                </h4>
                <p>{item.category}</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Brand
                </h4>
                <p>{item.brand}</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Availability
                </h4>
                <p
                  className={`font-medium ${
                    item.status === "out of stock" ? "text-red-600" : ""
                  }`}
                >
                  {getStatusText(item.status)}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Color
                </h4>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{
                      backgroundColor: item.color.toLowerCase(),
                      borderColor:
                        item.color.toLowerCase() === "white"
                          ? "#e5e7eb"
                          : "transparent",
                    }}
                  />
                  <span>{item.color}</span>
                </div>
              </div>
            </div>

            {/* Physical Attributes */}
            <div className="h-px bg-border my-4" />
            <h3 className="font-medium mb-3">Physical Attributes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Scale className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Weight</h4>
                  <p className="text-muted-foreground">{item.weight} kg</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Ruler className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Dimensions</h4>
                  <p className="text-muted-foreground">{item.dimension}</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="h-px bg-border my-4" />
            <h3 className="font-medium mb-3">Product Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Created</h4>
                  <p className="text-muted-foreground">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Updated</h4>
                  <p className="text-muted-foreground">
                    {formatDate(item.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Specifications Tab */}
          <TabsContent value="specifications" className="mt-4">
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-2 py-2 border-b">
                <h4 className="font-medium text-sm text-muted-foreground">
                  SKU
                </h4>
                <p>{item.sku}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-2 border-b">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Brand
                </h4>
                <p>{item.brand}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-2 border-b">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Category
                </h4>
                <p>{item.category}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-2 border-b">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Color
                </h4>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border"
                    style={{
                      backgroundColor: item.color.toLowerCase(),
                      borderColor:
                        item.color.toLowerCase() === "white"
                          ? "#e5e7eb"
                          : "transparent",
                    }}
                  />
                  <span>{item.color}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 py-2 border-b">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Weight
                </h4>
                <p>{item.weight} kg</p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-2 border-b">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Dimensions
                </h4>
                <p>{item.dimension}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-2 border-b">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Status
                </h4>
                <p>{getStatusText(item.status)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 py-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Product ID
                </h4>
                <p>{item.id}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
