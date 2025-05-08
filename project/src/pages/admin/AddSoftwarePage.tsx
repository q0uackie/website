import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SoftwareForm } from '../../components/software/SoftwareForm';
import { SoftwareFormData } from '../../types/software';
import { supabase } from '../../lib/supabase';

export function AddSoftwarePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (formData: SoftwareFormData, installerFile?: File) => {
    try {
      setIsSubmitting(true);
      
      // Prepare the data
      const softwareData = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Handle installer file upload if provided
      if (installerFile) {
        const fileName = `${Date.now()}-${installerFile.name}`;
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('installers')
          .upload(fileName, installerFile);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL for the file
        const { data: urlData } = await supabase.storage
          .from('installers')
          .getPublicUrl(fileName);
        
        softwareData.installer_path = fileName;
        softwareData.download_url = urlData.publicUrl;
      }
      
      // Insert the software record
      const { data, error } = await supabase
        .from('software')
        .insert([softwareData])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Navigate back to the admin dashboard
      navigate('/admin/dashboard');
      
    } catch (error) {
      console.error('Error adding software:', error);
      alert('Beim Hinzufügen der Software ist ein Fehler aufgetreten.');
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
          Zurück
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Neue Software hinzufügen</h1>
      
      <SoftwareForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}