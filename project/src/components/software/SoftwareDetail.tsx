import React, { useState } from 'react';
import { Software } from '../../types/software';
import { formatDate } from '../../utils/formatters';
import { Download, Share2, X } from 'lucide-react';
import { trackSoftwareDownload } from '../../hooks/useTracking';

interface SoftwareDetailProps {
  software: Software;
}

export function SoftwareDetail({ software }: SoftwareDetailProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const downloadUrl = software.download_url || '/api/download/' + software.id;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: software.name,
        text: software.description,
        url: window.location.href
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = async () => {
    await trackSoftwareDownload(software.id);
    window.location.href = downloadUrl;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Logo and basic info */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <img 
              src={software.logo || 'https://via.placeholder.com/200'} 
              alt={software.name} 
              className="w-48 h-48 object-contain mb-6"
            />
            <h1 className="text-3xl font-bold text-center mb-2">{software.name}</h1>
            <p className="text-gray-600 text-center mb-6">{software.publisher}</p>
            <div className="w-full flex gap-2">
              <button 
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center btn-primary py-3 text-lg"
              >
                <Download size={24} className="mr-2" />
                Download
              </button>
              <button
                onClick={handleShare}
                className="p-3 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                title="Software teilen"
              >
                <Share2 size={24} />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-2/3">
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold mb-4">Über diese Anwendung</h2>
              <p className="text-gray-700">{software.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Version</h3>
                <p className="text-gray-900">{software.version}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Kategorie</h3>
                <p className="text-gray-900">{software.category}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Größe</h3>
                <p className="text-gray-900">{software.size}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Veröffentlichung</h3>
                <p className="text-gray-900">{formatDate(software.release_date)}</p>
              </div>
            </div>

            {software.screenshots && software.screenshots.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Screenshots</h2>
                <div className="grid grid-cols-2 gap-4">
                  {software.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(screenshot)}
                      className="rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02]"
                    >
                      <img 
                        src={screenshot} 
                        alt={`Screenshot ${index + 1}`} 
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Screenshot" 
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}