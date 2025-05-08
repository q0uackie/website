import React from 'react';
import { Link } from 'react-router-dom';
import { Software } from '../../types/software';

interface SoftwareCardProps {
  software: Software;
}

export function SoftwareCard({ software }: SoftwareCardProps) {
  return (
    <Link 
      to={`/software/${software.id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-center mb-4">
          <img 
            src={software.logo || 'https://via.placeholder.com/150'} 
            alt={software.name} 
            className="w-24 h-24 object-contain"
          />
        </div>
        <h3 className="text-lg font-semibold text-center text-gray-900">{software.name}</h3>
        <p className="text-sm text-center text-gray-600 mt-1">{software.publisher}</p>
      </div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <button className="w-full btn-primary">
          Details
        </button>
      </div>
    </Link>
  );
}