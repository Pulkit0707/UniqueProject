'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSupabase } from './supabase-provider';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface CommentSectionProps {
  projectId: string;
}

export function CommentSection({ projectId }: CommentSectionProps) {
  const { session } = useSupabase();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setComments(data);
      }
    };

    fetchComments();

    const commentsSubscription = supabase
      .channel('comments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => {
        fetchComments();
      })
      .subscribe();

    return () => {
      commentsSubscription.unsubscribe();
    };
  }, [projectId]);

  const handleSubmitComment = async () => {
    if (!session) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to comment on projects',
        variant: 'destructive',
      });
      return;
    }

    if (!newComment.trim()) return;

    setIsLoading(true);

    try {
      await supabase.from('comments').insert({
        project_id: projectId,
        user_id: session.user.id,
        content: newComment.trim(),
      });

      setNewComment('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-4">Comments</h4>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{comment.profiles.username}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{comment.content}</p>
          </div>
        ))}
      </div>
      {session && (
        <div className="mt-4 space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={isLoading || !newComment.trim()}
          >
            Post Comment
          </Button>
        </div>
      )}
    </div>
  );
}