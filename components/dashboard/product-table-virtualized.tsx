"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface ProductTableProps {
  products: any[];
}

export function ProductTable({ products }: ProductTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // Adjust row height if needed
    overscan: 12, // Render a few extra rows above/below
  });

  return (
    <div
      ref={parentRef}
      className="relative h-[70vh] overflow-auto rounded-md border border-slate-200 dark:border-slate-800"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const product = products[virtualRow.index];
          return (
            <div
              key={product._id || virtualRow.index}
              className={`absolute top-0 left-0 w-full grid grid-cols-6 items-center border-b border-slate-100 dark:border-slate-700 text-sm px-4 py-3`}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <span>{product.name}</span>
              <span>{product.assetType}</span>
              <span>{product.status}</span>
              <span>{product.condition}</span>
              <span>{product.location}</span>
              <span>{product.department}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
