import { ProjectList } from '@/components/project-list';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Projects</h1>
      <ProjectList />
    </div>
  );
}