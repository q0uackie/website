import React from 'react';
import { useInView } from 'react-intersection-observer';
import { SoftwareCard } from './SoftwareCard';
import { Software } from '../../types/software';

interface SoftwareGridProps {
  software: Software[];
  isLoading: boolean;
}

function SoftwareSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

export function SoftwareGrid({ software, isLoading }: SoftwareGridProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <SoftwareSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (software.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Keine Software gefunden.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" ref={ref}>
      {software.map((app) => (
        <div key={app.id} className={`transform transition-opacity duration-500 ${inView ? 'opacity-100' : 'opacity-0'}`}>
          <SoftwareCard software={app} />
        </div>
      ))}
    </div>
  );
}