import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, List, ListOrdered, Quote, Undo, Redo, 
  Link as LinkIcon, Image as ImageIcon, Heading1, Heading2 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TutorialEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TutorialEditor({ content, onChange }: TutorialEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your tutorial content here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        // Prevent form submission on common keyboard shortcuts
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
  });

  const addImage = useCallback(async (file: File) => {
    if (!editor) return;

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('tutorial-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('tutorial-images')
        .getPublicUrl(fileName);

      editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }, [editor]);

  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.indexOf('image') === 0) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) addImage(file);
      }
    }
  }, [addImage]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const items = event.dataTransfer?.files;
    if (!items) return;

    for (const file of Array.from(items)) {
      if (file.type.indexOf('image') === 0) {
        addImage(file);
      }
    }
  }, [addImage]);

  const handleToolbarAction = (callback: () => boolean) => {
    // Prevent event bubbling and form submission
    return (e: React.MouseEvent) => {
      e.preventDefault();
      callback();
      editor?.commands.focus();
    };
  };

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-2">
        <button
          type="button" // Prevent form submission
          onClick={handleToolbarAction(() => editor.chain().toggleBold().run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          <Bold size={20} />
        </button>
        <button
          type="button"
          onClick={handleToolbarAction(() => editor.chain().toggleItalic().run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          <Italic size={20} />
        </button>
        <button
          type="button"
          onClick={handleToolbarAction(() => editor.chain().toggleHeading({ level: 1 }).run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
        >
          <Heading1 size={20} />
        </button>
        <button
          type="button"
          onClick={handleToolbarAction(() => editor.chain().toggleHeading({ level: 2 }).run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
        >
          <Heading2 size={20} />
        </button>
        <button
          type="button"
          onClick={handleToolbarAction(() => editor.chain().toggleBulletList().run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        >
          <List size={20} />
        </button>
        <button
          type="button"
          onClick={handleToolbarAction(() => editor.chain().toggleOrderedList().run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        >
          <ListOrdered size={20} />
        </button>
        <button
          type="button"
          onClick={handleToolbarAction(() => editor.chain().toggleBlockquote().run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
        >
          <Quote size={20} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const url = window.prompt('Enter the URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        >
          <LinkIcon size={20} />
        </button>
        <label className="p-2 rounded hover:bg-gray-200 cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) addImage(file);
            }}
          />
          <ImageIcon size={20} />
        </label>
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleToolbarAction(() => editor.chain().undo().run())}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          <Undo size={20} />
        </button>
        <button
          type="button"
          onClick={handleToolbarAction(() => editor.chain().redo().run())}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          <Redo size={20} />
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4"
        onPaste={handlePaste}
        onDrop={handleDrop}
      />
    </div>
  );
}