import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProjectList } from '@/components/project-list';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Is Your Project Unique?
        </h1>
        <p className="mt-4 text-muted-foreground max-w-[700px] mx-auto text-lg sm:text-xl">
          Get instant feedback on your project ideas using AI analysis and community voting.
          Share your innovation and discover what others are building.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="mr-4">
            <Link href="/projects/new">Submit Your Project</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/projects">Browse Projects</Link>
          </Button>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Latest Projects</h2>
        <ProjectList />
      </section>
    </div>
  );
}