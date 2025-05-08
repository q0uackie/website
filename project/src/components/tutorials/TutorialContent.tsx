import React, { useEffect, useState } from 'react';
import { Tutorial } from '../../types/tutorials';
import { Clock, Share2, ThumbsUp, ThumbsDown } from 'lucide-react';
import Prism from 'prismjs';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

interface TutorialContentProps {
  tutorial: Tutorial;
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function TutorialContent({ tutorial }: TutorialContentProps) {
  const [currentTutorial, setCurrentTutorial] = useState(tutorial);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);

  useEffect(() => {
    Prism.highlightAll();
    const savedVote = localStorage.getItem(`tutorial-vote-${tutorial.id}`);
    if (savedVote) {
      setUserVote(savedVote as 'like' | 'dislike');
    }
  }, [tutorial.content, tutorial.id]);

  useEffect(() => {
    const fetchCurrentTutorial = async () => {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('id', tutorial.id)
        .limit(1);

      if (error) {
        console.error('Supabase fetch error:', error);
        return;
      }

      if (data && data.length > 0) {
        setCurrentTutorial(data[0]);
      } else {
        console.warn('No tutorial found with that ID.');
      }
    };

    fetchCurrentTutorial();
  }, [tutorial.id]);

  const handleVote = async (type: 'like' | 'dislike') => {
    const isUnvoting = userVote === type;
    const updates: Record<string, number> = {};

    if (isUnvoting) {
      updates[`${type}s`] = Math.max((currentTutorial[`${type}s`] || 0) - 1, 0);
    } else {
      updates[`${type}s`] = (currentTutorial[`${type}s`] || 0) + 1;
      if (userVote) {
        updates[`${userVote}s`] = Math.max((currentTutorial[`${userVote}s`] || 0) - 1, 0);
      }
    }

    const { data, error } = await supabase
      .from('tutorials')
      .update(updates)
      .eq('id', tutorial.id)
      .select()
      .single();

    if (!error && data) {
      if (isUnvoting) {
        localStorage.removeItem(`tutorial-vote-${tutorial.id}`);
        setUserVote(null);
      } else {
        localStorage.setItem(`tutorial-vote-${tutorial.id}`, type);
        setUserVote(type);
      }
      setCurrentTutorial(data);
    } else {
      console.error('Vote update failed:', error);
    }
  };

  const readingTime = estimateReadingTime(tutorial.content);
  const lastUpdated = formatDistanceToNow(new Date(tutorial.updated_at), {
    addSuffix: true,
    locale: de,
  });

  const handleShare = async () => {
    try {
      await navigator.share({
        title: tutorial.title,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{currentTutorial.title}</h1>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <Clock size={16} className="mr-1" />
            <span>{readingTime} Min. Lesezeit</span>
            <span className="mx-2">•</span>
            <span>Aktualisiert {lastUpdated}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-4 mr-4">
            <button
              onClick={() => handleVote('like')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                userVote === 'like'
                  ? 'bg-green-100 text-green-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={userVote === 'like' ? 'Like entfernen' : 'Like'}
            >
              <ThumbsUp size={18} />
              <span>{currentTutorial.likes || 0}</span>
            </button>
            <button
              onClick={() => handleVote('dislike')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                userVote === 'dislike'
                  ? 'bg-red-100 text-red-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={userVote === 'dislike' ? 'Dislike entfernen' : 'Dislike'}
            >
              <ThumbsDown size={18} />
              <span>{currentTutorial.dislikes || 0}</span>
            </button>
          </div>
          <button
            onClick={handleShare}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
            title="Tutorial teilen"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: currentTutorial.content }}
      />
    </div>
  );
}
