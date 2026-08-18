'use client';

import React, { useState } from 'react';
import { Paperclip, Send, Smile, MoreHorizontal, CornerDownRight } from 'lucide-react';
import { Comment } from '../../types/task';
import { useTask } from '../../context/TaskContext';
import { Avatar } from '../ui/Avatar';

interface CommentStreamProps {
  taskId: string;
  comments: Comment[];
}

export const CommentStream: React.FC<CommentStreamProps> = ({ taskId, comments = [] }) => {
  const { addComment, toggleCommentReaction } = useTask();
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

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

  return (
    <div className="space-y-4 pt-2">
      <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
        Activity & Comments
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map(comment => (
          <div
            key={comment.id}
            className="p-3 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 space-y-2"
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
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleCommentReaction(taskId, comment.id, '👍')}
                  className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 transition-colors text-xs flex items-center gap-1"
                >
                  <Smile className="w-3.5 h-3.5" />
                  {comment.reactions?.length ? (
                    <span className="text-[10px]">{comment.reactions.length}</span>
                  ) : null}
                </button>
                <button className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Comment Body */}
            <p className="text-xs text-zinc-700 dark:text-zinc-300 pl-7 leading-relaxed">
              {comment.content}
            </p>

            {/* Reply Action */}
            <div className="pl-7 pt-1">
              <button
                onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Leave a reply...
              </button>

              {/* Inline Reply Input */}
              {replyToId === comment.id && (
                <div className="mt-2 flex items-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2">
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
        ))}
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
