'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Paperclip,
  Send,
  Smile,
  MoreHorizontal,
  CornerDownRight,
  Edit2,
  Copy,
  Trash2,
  Pin,
  Check,
  X,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { Comment } from '../../types/task';
import { useTask } from '../../context/TaskContext';
import { Avatar } from '../ui/Avatar';
import { uploadImageToCloudinary } from '../../lib/upload';
import { cn } from '../../lib/utils';

interface CommentStreamProps {
  taskId: string;
  comments: Comment[];
}

export const CommentStream: React.FC<CommentStreamProps> = ({ taskId, comments = [] }) => {
  const { addComment, toggleCommentReaction } = useTask();
  const [newComment, setNewComment] = useState('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pinnedCommentIds, setPinnedCommentIds] = useState<string[]>([]);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  // Click outside & Escape dismissal
  useEffect(() => {
    if (!openMenuId && !editingCommentId) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenuId(null);
        setEditingCommentId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenuId, editingCommentId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = await uploadImageToCloudinary(file);
        setAttachedImages(prev => [...prev, uploadedUrl]);
      }
    } catch (err: any) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image to Cloudinary: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && attachedImages.length === 0) return;

    let finalContent = newComment.trim();
    if (attachedImages.length > 0) {
      const imageMarkdown = attachedImages.map(img => `\n![Attachment](${img})`).join('');
      finalContent = `${finalContent}${imageMarkdown}`.trim();
    }

    await addComment(taskId, finalContent);
    setNewComment('');
    setAttachedImages([]);
  };

  const handlePostReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    await addComment(taskId, replyContent.trim(), parentId);
    setReplyContent('');
    setReplyToId(null);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    setOpenMenuId(null);
  };

  const handleSaveEdit = (commentId: string) => {
    if (editingContent.trim()) {
      setLocalComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, content: editingContent.trim() } : c))
      );
    }
    setEditingCommentId(null);
  };

  const handleDeleteComment = (commentId: string) => {
    setLocalComments(prev => prev.filter(c => c.id !== commentId));
    setOpenMenuId(null);
  };

  const handleTogglePin = (commentId: string) => {
    setPinnedCommentIds(prev =>
      prev.includes(commentId) ? prev.filter(id => id !== commentId) : [...prev, commentId]
    );
    setOpenMenuId(null);
  };

  // Helper to extract markdown image URLs from comment body
  const extractImagesAndText = (content: string) => {
    const imgRegex = /!\[.*?\]\((https?:\/\/.*?)\)/g;
    const images: string[] = [];
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      images.push(match[1]);
    }
    const cleanText = content.replace(imgRegex, '').trim();
    return { cleanText, images };
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-100">
        <span>Activity & Comments</span>
        <span className="text-[11px] font-normal text-zinc-400">({localComments.length})</span>
      </div>

      {/* Hidden File Input for Cloudinary Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Comments List */}
      <div className="space-y-3">
        {localComments.map(comment => {
          const isMenuOpen = openMenuId === comment.id;
          const isEditing = editingCommentId === comment.id;
          const isPinned = pinnedCommentIds.includes(comment.id);
          const { cleanText, images } = extractImagesAndText(comment.content);

          return (
            <div
              key={comment.id}
              className={cn(
                'p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border space-y-2 transition-all',
                isPinned
                  ? 'border-amber-300 dark:border-amber-700/80 bg-amber-50/30 dark:bg-amber-950/20'
                  : 'border-zinc-200/60 dark:border-zinc-800'
              )}
            >
              {/* Author & Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={comment.authorName || 'Ankit Dutta'} size="sm" src={comment.authorAvatar} />
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {comment.authorName || 'Ankit Dutta'}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {comment.createdAt ? 'just now' : 'just now'}
                  </span>
                  {isPinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                      <Pin className="w-2.5 h-2.5 fill-current" />
                      <span>Pinned</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 relative">
                  {/* Reaction Button */}
                  <button
                    type="button"
                    onClick={() => toggleCommentReaction(taskId, comment.id, '👍')}
                    className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors text-xs flex items-center gap-1"
                    title="Add reaction"
                  >
                    <Smile className="w-3.5 h-3.5" />
                    {comment.reactions?.length ? (
                      <span className="text-[10px] font-medium">{comment.reactions.length}</span>
                    ) : null}
                  </button>

                  {/* Comment Options Dropdown Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(isMenuOpen ? null : comment.id)}
                      className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                      title="Comment options"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>

                    {/* Popover Options Menu */}
                    {isMenuOpen && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                        onClick={e => e.stopPropagation()}
                      >
                        {/* Quick Reaction Bar */}
                        <div className="flex items-center justify-around px-2 py-1 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                          {['👍', '❤️', '🚀', '👀', '🎉'].map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                toggleCommentReaction(taskId, comment.id, emoji);
                                setOpenMenuId(null);
                              }}
                              className="p-1 hover:scale-125 transition-transform text-sm"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        {/* Edit Comment */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditingContent(comment.content);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Edit Comment</span>
                        </button>

                        {/* Copy Comment Text */}
                        <button
                          type="button"
                          onClick={() => handleCopyText(comment.id, comment.content)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        >
                          <Copy className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{copiedId === comment.id ? 'Copied!' : 'Copy Text'}</span>
                        </button>

                        {/* Pin Comment */}
                        <button
                          type="button"
                          onClick={() => handleTogglePin(comment.id)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        >
                          <Pin className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{isPinned ? 'Unpin Comment' : 'Pin to Top'}</span>
                        </button>

                        <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                        {/* Delete Comment */}
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          <span>Delete Comment</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Comment Body / Inline Edit Mode */}
              {isEditing ? (
                <div className="pl-7 space-y-2">
                  <textarea
                    autoFocus
                    rows={2}
                    value={editingContent}
                    onChange={e => setEditingContent(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-blue-400 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingCommentId(null)}
                      className="px-2.5 py-1 text-[11px] rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(comment.id)}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pl-7 space-y-2">
                  {cleanText && (
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {cleanText}
                    </p>
                  )}
                  {/* Uploaded Images Stream */}
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {images.map((imgUrl, i) => (
                        <a
                          key={i}
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800 hover:opacity-90 transition-opacity max-w-xs shadow-xs"
                        >
                          <img
                            src={imgUrl}
                            alt="Comment attachment"
                            className="max-h-48 w-auto object-cover rounded-xl"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Reply Action */}
              <div className="pl-7 pt-1">
                <button
                  type="button"
                  onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                  className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Leave a reply...
                </button>

                {/* Inline Reply Input */}
                {replyToId === comment.id && (
                  <div className="mt-2 flex items-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2 animate-in fade-in">
                    <CornerDownRight className="w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="text"
                      autoFocus
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 text-xs bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handlePostReply(comment.id)}
                      disabled={!replyContent.trim()}
                      className="p-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 disabled:opacity-40"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Comment Input Box matching Figma */}
      <form
        onSubmit={handlePostComment}
        className="p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-all space-y-2"
      >
        {/* Uploaded Images Preview Strip */}
        {attachedImages.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-1 border-b border-zinc-100 dark:border-zinc-800">
            {attachedImages.map((imgUrl, index) => (
              <div key={index} className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                <img src={imgUrl} alt="Attached upload" className="w-14 h-14 object-cover" />
                <button
                  type="button"
                  onClick={() => setAttachedImages(prev => prev.filter((_, idx) => idx !== index))}
                  className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder={isUploading ? 'Uploading image to Cloudinary...' : 'Add a comment...'}
            disabled={isUploading}
            className="flex-1 text-xs bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none px-2"
          />

          <div className="flex items-center gap-1.5">
            {/* Cloudinary Image Attachment Button */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              title="Attach image from Cloudinary"
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              ) : (
                <Paperclip className="w-4 h-4" />
              )}
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={(!newComment.trim() && attachedImages.length === 0) || isUploading}
              title="Send comment"
              className="p-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-40 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
