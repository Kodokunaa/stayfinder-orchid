'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full min-h-[20vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Find Your Perfect Stay
        </h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by location, property type, or amenities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-14 text-base"
            />
          </div>
          <Button type="submit" size="lg" className="h-14 px-8">
            Search
          </Button>
        </form>
      </div>
    </div>
  );
}
