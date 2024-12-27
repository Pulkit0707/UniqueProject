'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { VoteButtons } from './vote-buttons';
import { CommentSection } from './comment-section';
import { formatDistanceToNow } from 'date-fns';

interface Project {
  id: string;
  title: string;
  description: string;
  ai_score: number;
  created_at: string;
  upvotes: number;
  downvotes: number;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
    };

    fetchProjects();

    const projectsSubscription = supabase
      .channel('projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      projectsSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-sm text-muted-foreground">
                by {project.profiles.username} •{' '}
                {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
              </p>
            </div>
            {project.ai_score && (
              <div className="bg-primary/10 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">AI Score: {project.ai_score}%</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          <VoteButtons
            projectId={project.id}
            upvotes={project.upvotes}
            downvotes={project.downvotes}
          />
          <CommentSection projectId={project.id} />
        </Card>
      ))}
    </div>
  );
}