import React from "react";
import AdminView from "@/components/AdminView";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <AdminView />
      </div>
    </div>
  );
}