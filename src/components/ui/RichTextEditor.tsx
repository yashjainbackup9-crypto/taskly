'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Quote,
  Link as LinkIcon,
  Eye,
  Edit3,
  Check,
  X,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { uploadImageToCloudinary } from '../../lib/upload';
import { cn } from '../../lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onSave,
  placeholder = 'Write a description, type markdown, or use toolbar...',
  className,
  minHeight = '140px',
}) => {
  const [content, setContent] = useState(value);
  const [isPreview, setIsPreview] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const updateContentAndNotify = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  };

  const applyFormat = (prefix: string, suffix: string = prefix, defaultPlaceholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultPlaceholder;

    const before = content.substring(0, start);
    const after = content.substring(end);

    const newText = `${before}${prefix}${selectedText}${suffix}${after}`;
    updateContentAndNotify(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  const applyLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Find start of current line
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const beforeLine = content.substring(0, lineStart);
    const afterStart = content.substring(lineStart);

    const newText = `${beforeLine}${prefix} ${afterStart}`;
    updateContentAndNotify(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length + 1, end + prefix.length + 1);
    }, 10);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      applyFormat(`\n![${file.name.replace(/\.[^/.]+$/, '')}](`, `${url})\n`, '');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image to Cloudinary: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      applyFormat('**', '**', 'bold text');
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault();
      applyFormat('*', '*', 'italic text');
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
      e.preventDefault();
      applyFormat('<u>', '</u>', 'underlined');
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onSave) onSave(content);
    }
  };

  // Simple, clean markdown rendering for preview mode
  const renderMarkdown = (text: string) => {
    if (!text.trim()) {
      return <p className="text-zinc-400 italic">No description provided</p>;
    }

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Images
      const imgMatch = line.match(/!\[(.*?)\]\((https?:\/\/.*?)\)/);
      if (imgMatch) {
        return (
          <div key={idx} className="my-2 max-w-sm rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <img src={imgMatch[2]} alt={imgMatch[1] || 'Image'} className="w-full object-cover max-h-60" />
            {imgMatch[1] && <p className="text-[10px] text-zinc-400 p-1 text-center">{imgMatch[1]}</p>}
          </div>
        );
      }
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-lg font-bold text-zinc-900 dark:text-zinc-100 my-1">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-base font-bold text-zinc-900 dark:text-zinc-100 my-1">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-bold text-zinc-900 dark:text-zinc-100 my-1">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- [ ] ')) {
        return (
          <div key={idx} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 my-0.5">
            <span className="w-3.5 h-3.5 rounded border border-zinc-400 inline-block" />
            <span>{line.slice(6)}</span>
          </div>
        );
      }
      if (line.startsWith('- [x] ') || line.startsWith('- [X] ')) {
        return (
          <div key={idx} className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 line-through my-0.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>{line.slice(6)}</span>
          </div>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-zinc-700 dark:text-zinc-300">
            {line.slice(2)}
          </li>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-blue-500 pl-3 my-1 italic text-zinc-600 dark:text-zinc-400">
            {line.slice(2)}
          </blockquote>
        );
      }
      if (line.startsWith('```')) {
        return <pre key={idx} className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg font-mono text-[11px] my-1 overflow-x-auto">{line.replace(/```/g, '')}</pre>;
      }
      return <p key={idx} className="text-zinc-700 dark:text-zinc-300 leading-relaxed my-0.5 min-h-[1rem]">{line || '\u00A0'}</p>;
    });
  };

  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-150 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs',
        isFocused
          ? 'border-blue-500 ring-2 ring-blue-500/20'
          : 'border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700',
        className
      )}
    >
      {/* Hidden File Input for Cloudinary Images */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Rich Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 px-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 text-zinc-500">
        <div className="flex flex-wrap items-center gap-0.5">
          {/* Bold */}
          <button
            type="button"
            onClick={() => applyFormat('**', '**', 'bold')}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Bold (⌘B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => applyFormat('*', '*', 'italic')}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Italic (⌘I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => applyFormat('<u>', '</u>', 'underlined')}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Underline (⌘U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => applyFormat('~~', '~~', 'strikethrough')}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => applyLinePrefix('#')}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-xs font-bold"
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyLinePrefix('##')}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-xs font-bold"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1" />

          {/* Lists & Tasks */}
          <button
            type="button"
            onClick={() => applyLinePrefix('-')}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyLinePrefix('1.')}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyLinePrefix('- [ ]')}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Checklist / Task"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1" />

          {/* Quote, Code, Link & Cloudinary Image Upload */}
          <button
            type="button"
            onClick={() => applyLinePrefix('>')}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('```\n', '\n```', 'code block')}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Code Block"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('[', '](https://...)', 'link title')}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="Insert Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          {/* Cloudinary Image Insert Button */}
          <button
            type="button"
            disabled={isUploading}
            onClick={() => imageInputRef.current?.click()}
            className="p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-blue-500 disabled:opacity-50"
            title="Upload Image to Cloudinary"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* View Toggle (Edit vs Preview) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors',
              isPreview
                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'hover:bg-zinc-200/70 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
            )}
          >
            {isPreview ? (
              <>
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                <span>Preview</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-3">
        {isPreview ? (
          <div
            className="text-xs space-y-1 overflow-y-auto px-1 py-1"
            style={{ minHeight }}
          >
            {renderMarkdown(content)}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            rows={4}
            value={content}
            onChange={e => updateContentAndNotify(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              if (onSave) onSave(content);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full text-xs text-zinc-800 dark:text-zinc-200 bg-transparent focus:outline-none resize-none leading-relaxed placeholder:text-zinc-400"
            style={{ minHeight }}
          />
        )}
      </div>

      {/* Bottom Shortcuts / Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 font-mono">
        <span>Markdown & Cloudinary uploads enabled</span>
        <span>{isUploading ? 'Uploading to Cloudinary...' : 'Auto-saved'}</span>
      </div>
    </div>
  );
};
