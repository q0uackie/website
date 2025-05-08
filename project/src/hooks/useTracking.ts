import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function usePageView(page: string) {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await supabase
          .from('page_views')
          .insert([{ page }]);
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [page]);
}

export async function trackSoftwareDownload(softwareId: string) {
  try {
    await supabase
      .from('software_downloads')
      .insert([{ software_id: softwareId }]);
  } catch (error) {
    console.error('Error tracking software download:', error);
  }
}

export function useTutorialView(tutorialId: string) {
  useEffect(() => {
    const trackTutorialView = async () => {
      try {
        await supabase
          .from('tutorial_views')
          .insert([{ tutorial_id: tutorialId }]);
      } catch (error) {
        console.error('Error tracking tutorial view:', error);
      }
    };

    trackTutorialView();
  }, [tutorialId]);
}