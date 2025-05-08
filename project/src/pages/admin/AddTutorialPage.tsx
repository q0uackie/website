import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Tutorial } from '../../types/tutorials';
import { TutorialForm } from '../../components/tutorials/TutorialForm';

export function AddTutorialPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: Partial<Tutorial>) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('tutorials')
        .insert([formData]);

      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error adding tutorial:', error);
      alert('Failed to create tutorial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      
      <h1 className="text-2xl font-bold mb-6">Create New Tutorial</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <TutorialForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}