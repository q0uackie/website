import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SoftwareForm } from '../../components/software/SoftwareForm';
import { Software, SoftwareFormData } from '../../types/software';
import { supabase } from '../../lib/supabase';

export function EditSoftwarePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [software, setSoftware] = useState<Software | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    async function fetchSoftware() {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('software')
        .select('*')
        .eq('id', id)
        .single();
      
      setIsLoading(false);
      
      if (error) {
        console.error('Error fetching software:', error);
        setError('Die Software konnte nicht gefunden werden.');
        return;
      }
      
      setSoftware(data);
    }
    
    fetchSoftware();
  }, [id]);

  const handleSubmit = async (formData: SoftwareFormData, installerFile?: File) => {
    if (!id || !software) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare the data
      const softwareData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };
      
      // Handle installer file upload if provided
      if (installerFile) {
        // First, delete the old installer file if exists
        if (software.installer_path) {
          await supabase.storage
            .from('installers')
            .remove([software.installer_path]);
        }
        
        // Upload the new file
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
      
      // Update the software record
      const { data, error } = await supabase
        .from('software')
        .update(softwareData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Navigate back to the admin dashboard
      navigate('/admin/dashboard');
      
    } catch (error) {
      console.error('Error updating software:', error);
      alert('Beim Aktualisieren der Software ist ein Fehler aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          onClick={() => navigate('/admin/dashboard')} 
          className="btn-secondary"
        >
          Zurück zum Dashboard
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
      
      <h1 className="text-2xl font-bold mb-6">Software bearbeiten: {software.name}</h1>
      
      <SoftwareForm initialData={software} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}