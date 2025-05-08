import React, { useState, useEffect } from 'react';
import { Software, SoftwareFormData, Category } from '../../types/software';
import { supabase } from '../../lib/supabase';

interface SoftwareFormProps {
  initialData?: Software;
  onSubmit: (data: SoftwareFormData, installerFile?: File) => Promise<void>;
  isSubmitting: boolean;
}

export function SoftwareForm({ initialData, onSubmit, isSubmitting }: SoftwareFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<SoftwareFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    publisher: initialData?.publisher || '',
    version: initialData?.version || '',
    size: initialData?.size || '',
    release_date: initialData?.release_date ? new Date(initialData.release_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    download_url: initialData?.download_url || '',
    logo: initialData?.logo || '',
    screenshots: initialData?.screenshots || [],
  });
  const [screenshotInput, setScreenshotInput] = useState('');
  const [installerFile, setInstallerFile] = useState<File | null>(null);
  const [method, setMethod] = useState<'link' | 'upload'>(initialData?.download_url ? 'link' : 'upload');

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (!error && data) {
        setCategories(data);
      }
    }

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMethodChange = (newMethod: 'link' | 'upload') => {
    setMethod(newMethod);
    if (newMethod === 'upload') {
      setFormData((prev) => ({ ...prev, download_url: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setInstallerFile(e.target.files[0]);
      
      const fileSizeInMB = (e.target.files[0].size / (1024 * 1024)).toFixed(2);
      setFormData((prev) => ({ ...prev, size: `${fileSizeInMB} MB` }));
    }
  };

  const addScreenshot = () => {
    if (screenshotInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, screenshotInput.trim()]
      }));
      setScreenshotInput('');
    }
  };

  const removeScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData, method === 'upload' ? installerFile || undefined : undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Software-Informationen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div>
            <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
              Herausgeber
            </label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              required
              value={formData.publisher}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Kategorie
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Kategorie auswählen</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
              Version
            </label>
            <input
              type="text"
              id="version"
              name="version"
              required
              value={formData.version}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
              Größe (z.B. "15 MB")
            </label>
            <input
              type="text"
              id="size"
              name="size"
              required
              value={formData.size}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div>
            <label htmlFor="release_date" className="block text-sm font-medium text-gray-700 mb-1">
              Veröffentlichungsdatum
            </label>
            <input
              type="date"
              id="release_date"
              name="release_date"
              required
              value={formData.release_date}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Beschreibung
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          value={formData.description}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Logo</h2>
        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
            Logo URL
          </label>
          <input
            type="url"
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/logo.png"
          />
          {formData.logo && (
            <div className="mt-2">
              <img src={formData.logo} alt="Logo preview" className="w-24 h-24 object-contain border rounded" />
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Screenshots (Optional)</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center">
            <input
              type="url"
              value={screenshotInput}
              onChange={(e) => setScreenshotInput(e.target.value)}
              placeholder="Screenshot URL eingeben"
              className="input-field flex-grow"
            />
            <button
              type="button"
              onClick={addScreenshot}
              className="ml-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
            >
              Hinzufügen
            </button>
          </div>

          {formData.screenshots.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Hinzugefügte Screenshots:</h3>
              <ul className="space-y-2">
                {formData.screenshots.map((url, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <img src={url} alt="Screenshot preview" className="w-12 h-12 object-cover rounded mr-2" />
                      <span className="text-sm text-gray-600 truncate" style={{ maxWidth: '300px' }}>{url}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeScreenshot(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Entfernen
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Installationsoptionen</h2>
        <div className="mb-4">
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={method === 'link'}
                onChange={() => handleMethodChange('link')}
              />
              <span className="ml-2">Download-Link</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={method === 'upload'}
                onChange={() => handleMethodChange('upload')}
              />
              <span className="ml-2">Installer hochladen</span>
            </label>
          </div>
        </div>

        {method === 'link' ? (
          <div>
            <label htmlFor="download_url" className="block text-sm font-medium text-gray-700 mb-1">
              Download-URL
            </label>
            <input
              type="url"
              id="download_url"
              name="download_url"
              required={method === 'link'}
              value={formData.download_url}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="installer_file" className="block text-sm font-medium text-gray-700 mb-1">
              Installer-Datei
            </label>
            <input
              type="file"
              id="installer_file"
              required={method === 'upload' && !initialData}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {installerFile && (
              <p className="mt-1 text-sm text-gray-500">
                Ausgewählte Datei: {installerFile.name} ({(installerFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              Speichern...
            </>
          ) : initialData ? 'Aktualisieren' : 'Erstellen'}
        </button>
      </div>
    </form>
  );
}