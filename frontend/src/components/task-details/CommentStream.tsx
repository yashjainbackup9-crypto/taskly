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
} from 'lucide-react';
import { Comment } from '../../types/task';
import { useTask } from '../../context/TaskContext';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../lib/utils';

interface CommentStreamProps {
  taskId: string;
  comments: Comment[];
}

export const CommentStream: React.FC<CommentStreamProps> = ({ taskId, comments = [] }) => {
  const { addComment, toggleCommentReaction } = useTask();
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pinnedCommentIds, setPinnedCommentIds] = useState<string[]>([]);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  const menuRef = useRef<HTMLDivElement>(null);

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

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addComment(taskId, newComment.trim());
    setNewComment('');
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

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-100">
        <span>Activity & Comments</span>
        <span className="text-[11px] font-normal text-zinc-400">({localComments.length})</span>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {localComments.map(comment => {
          const isMenuOpen = openMenuId === comment.id;
          const isEditing = editingCommentId === comment.id;
          const isPinned = pinnedCommentIds.includes(comment.id);

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
                <p className="text-xs text-zinc-700 dark:text-zinc-300 pl-7 leading-relaxed">
                  {comment.content}
                </p>
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
        className="flex items-center gap-2 p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-all"
      >
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 text-xs bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none px-2"
        />

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="Attach file"
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={!newComment.trim()}
            title="Send comment"
            className="p-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-40 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
