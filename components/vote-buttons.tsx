'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useSupabase } from './supabase-provider';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface VoteButtonsProps {
  projectId: string;
  upvotes: number;
  downvotes: number;
}

export function VoteButtons({ projectId, upvotes, downvotes }: VoteButtonsProps) {
  const { session } = useSupabase();
  const { toast } = useToast();
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserVote = async () => {
      if (!session?.user) return;

      const { data } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('project_id', projectId)
        .eq('user_id', session.user.id)
        .single();

      if (data) {
        setUserVote(data.vote_type);
      }
    };

    fetchUserVote();
  }, [projectId, session?.user]);

  const handleVote = async (voteType: boolean) => {
    if (!session) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to vote on projects',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (userVote === voteType) {
        // Remove vote
        await supabase
          .from('votes')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', session.user.id);
        setUserVote(null);
      } else {
        // Upsert vote
        await supabase
          .from('votes')
          .upsert({
            project_id: projectId,
            user_id: session.user.id,
            vote_type: voteType,
          });
        setUserVote(voteType);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to register vote',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={userVote === true ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleVote(true)}
        disabled={isLoading}
      >
        <ThumbsUp className="h-4 w-4 mr-1" />
        {upvotes}
      </Button>
      <Button
        variant={userVote === false ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleVote(false)}
        disabled={isLoading}
      >
        <ThumbsDown className="h-4 w-4 mr-1" />
        {downvotes}
      </Button>
    </div>
  );
}