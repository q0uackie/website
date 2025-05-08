import React, { useState, useEffect } from 'react';
import { Tutorial } from '../../types/tutorials';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface TutorialSidebarProps {
  tutorials: Tutorial[];
  selectedTutorialId?: string;
  onSelectTutorial: (tutorial: Tutorial) => void;
}

export function TutorialSidebar({ 
  tutorials, 
  selectedTutorialId,
  onSelectTutorial 
}: TutorialSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTutorials, setFilteredTutorials] = useState(tutorials);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const filtered = tutorials.filter(tutorial =>
      tutorial.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      tutorial.content.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    setFilteredTutorials(filtered);
  }, [debouncedSearch, tutorials]);

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <nav className="space-y-1">
          {filteredTutorials.map((tutorial) => (
            <button
              key={tutorial.id}
              onClick={() => onSelectTutorial(tutorial)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                tutorial.id === selectedTutorialId
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tutorial.title}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}