import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SoftwareDetail } from '../components/software/SoftwareDetail';
import { Software } from '../types/software';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';

export function SoftwareDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [software, setSoftware] = useState<Software | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSoftwareDetails() {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('software')
        .select('*')
        .eq('id', id)
        .single();
      
      setIsLoading(false);
      
      if (error) {
        console.error('Error fetching software details:', error);
        setError('Die Software konnte nicht gefunden werden.');
        return;
      }
      
      setSoftware(data);
    }
    
    fetchSoftwareDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !software) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || 'Software nicht gefunden'}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="btn-secondary"
        >
          Zurück
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} className="mr-1" />
          Zurück
        </button>
      </div>
      
      <SoftwareDetail software={software} />
    </div>
  );
}