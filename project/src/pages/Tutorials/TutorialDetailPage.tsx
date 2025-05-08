import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Tutorial } from '../../types/tutorials';
import { EmptyState } from '../../components/shared/EmptyState';
import { FileQuestion } from 'lucide-react';
import { TutorialLayout } from '../../components/tutorials/TutorialLayout';
import { useTutorialView } from '../../hooks/useTracking';

export function TutorialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);

  // Track tutorial view
  if (id) {
    useTutorialView(id);
  }

  useEffect(() => {
    async function fetchTutorial() {
      try {
        const { data, error } = await supabase
          .from('tutorials')
          .select(`
            *,
            tutorial_categories (
              name
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setTutorial(data);
      } catch (error) {
        console.error('Error fetching tutorial:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTutorial();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <EmptyState
        icon={FileQuestion}
        title="Tutorial not found"
        description="The tutorial you're looking for doesn't exist or has been removed."
      />
    );
  }

  return <TutorialLayout tutorial={tutorial} />;
}