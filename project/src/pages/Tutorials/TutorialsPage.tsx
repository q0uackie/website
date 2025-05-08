import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Tutorial } from '../../types/tutorials';
import { EmptyState } from '../../components/shared/EmptyState';
import { BookOpen } from 'lucide-react';
import { TutorialContent } from '../../components/tutorials/TutorialContent';
import { TutorialSidebar } from '../../components/tutorials/TutorialSidebar';

export function TutorialsPage() {
  const { id } = useParams<{ id: string }>();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorials();
  }, []);

  useEffect(() => {
    if (tutorials.length > 0) {
      // If there's an ID in the URL, select that tutorial
      if (id) {
        const tutorial = tutorials.find(t => t.id === id);
        if (tutorial) {
          setSelectedTutorial(tutorial);
          return;
        }
      }
      // Otherwise select the first tutorial
      setSelectedTutorial(tutorials[0]);
    }
  }, [id, tutorials]);

  async function fetchTutorials() {
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .order('title');

      if (error) throw error;
      setTutorials(data || []);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (tutorials.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Keine Tutorials verfügbar"
        description="Momentan sind keine Tutorials vorhanden."
      />
    );
  }

  return (
    <div className="flex h-full">
      <TutorialSidebar 
        tutorials={tutorials}
        selectedTutorialId={selectedTutorial?.id}
        onSelectTutorial={setSelectedTutorial}
      />
      <div className="flex-1 overflow-auto">
        {selectedTutorial && <TutorialContent tutorial={selectedTutorial} />}
      </div>
    </div>
  );
}