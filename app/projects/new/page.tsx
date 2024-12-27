'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/components/supabase-provider';
import { supabase } from '@/lib/supabase';
import { getProjectUniqueScore } from '@/lib/ai';

export default function NewProjectPage() {
  const router = useRouter();
  const { session } = useSupabase();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!session) {
    router.push('/login');
    return null;
  }

  const askAI = async () => {
    setIsLoading(true);
    try {
      const aiScore = await getProjectUniqueScore(title, description);
      
      const { error } = await supabase.from('projects').insert({
        title,
        description,
        user_id: session.user.id,
        ai_score: aiScore,
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: `Your project received an AI uniqueness score of ${aiScore}%`,
      });

      router.push('/projects');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit project',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const askPublic = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from('projects').insert({
        title,
        description,
        user_id: session.user.id,
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your project has been submitted for public feedback',
      });

      router.push('/projects');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit project',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Submit Your Project</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Project Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your project title"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Project Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project idea..."
              rows={6}
            />
          </div>
          <div className="flex space-x-4 pt-4">
            <Button
              onClick={askAI}
              disabled={isLoading || !title || !description}
              className="flex-1"
            >
              Ask AI
            </Button>
            <Button
              onClick={askPublic}
              disabled={isLoading || !title || !description}
              variant="outline"
              className="flex-1"
            >
              Ask Public
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}