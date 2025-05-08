import React, { useState } from 'react';
import { TutorialSidebar } from './TutorialSidebar';
import { TutorialContent } from './TutorialContent';
import { Tutorial } from '../../types/tutorials';

interface TutorialLayoutProps {
  tutorial: Tutorial;
}

export function TutorialLayout({ tutorial }: TutorialLayoutProps) {
  const [fontSize, setFontSize] = useState('base');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lineSpacing, setLineSpacing] = useState('normal');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <TutorialSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentTutorialId={tutorial.id}
      />
      
      <TutorialContent
        tutorial={tutorial}
        fontSize={fontSize}
        lineSpacing={lineSpacing}
        isDarkMode={isDarkMode}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onFontSizeChange={setFontSize}
        onLineSpacingChange={setLineSpacing}
        onThemeChange={setIsDarkMode}
      />
    </div>
  );
}