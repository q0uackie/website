import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Tutorial } from '../../types/tutorials';
import { TutorialForm } from '../../components/tutorials/TutorialForm';

export function EditTutorialPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTutorial() {
      try {
        const { data, error } = await supabase
          .from('tutorials')
          .select('*, tutorial_categories(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setTutorial(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTutorial();
  }, [id]);

  const handleSubmit = async (formData: Partial<Tutorial>) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('tutorials')
        .update(formData)
        .eq('id', id);

      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error updating tutorial:', error);
      alert('Failed to update tutorial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tutorial Not Found</h2>
        <button
          onClick={() => navigate('/admin/tutorials')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Tutorials
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
          Back
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Edit Tutorial: {tutorial.title}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <TutorialForm 
          initialData={tutorial} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}