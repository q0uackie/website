import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SoftwareGrid } from '../components/software/SoftwareGrid';
import { Software } from '../types/software';
import { supabase } from '../lib/supabase';
import { usePageView } from '../hooks/useTracking';

export function AppsPage() {
  const [software, setSoftware] = useState<Software[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('q');

  usePageView('apps');

  useEffect(() => {
    async function fetchSoftware() {
      setIsLoading(true);
      
      let query = supabase.from('software').select('*');
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      setIsLoading(false);
      
      if (error) {
        console.error('Error fetching software:', error);
        return;
      }
      
      setSoftware(data || []);
    }
    
    fetchSoftware();
  }, [category, searchQuery]);

  const title = searchQuery
    ? `Suchergebnisse für "${searchQuery}"`
    : category === 'installed'
    ? 'Installierte Software'
    : 'Alle Apps';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <SoftwareGrid software={software} isLoading={isLoading} />
    </div>
  );
}