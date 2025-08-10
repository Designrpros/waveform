import React from "react";

export default function SkeletonCard() {
  return (
    <div className="animate-pulse flex flex-col gap-2">
      <div className="bg-neutral-800 rounded-xl h-48 w-40 sm:w-48"></div>
      <div className="bg-neutral-800 rounded-md h-4 w-32"></div>
      <div className="bg-neutral-800 rounded-md h-3 w-24"></div>
    </div>
  );
}