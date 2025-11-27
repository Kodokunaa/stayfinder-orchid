'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ListingManagement from '@/components/admin/ListingManagement';
import UserManagement from '@/components/admin/UserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage listings and users</p>
        </div>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings" className="mt-6">
            <ListingManagement />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
