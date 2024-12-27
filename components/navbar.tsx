'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { LightbulbIcon } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { useSupabase } from '@/components/supabase-provider';

export function Navbar() {
  const pathname = usePathname();
  const { session } = useSupabase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <LightbulbIcon className="h-6 w-6" />
            <span className="font-bold inline-block">IsMyProjectUnique</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={pathname === '/' ? 'text-foreground' : 'text-foreground/60'}
            >
              Home
            </Link>
            <Link
              href="/projects"
              className={pathname === '/projects' ? 'text-foreground' : 'text-foreground/60'}
            >
              Projects
            </Link>
          </nav>
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-2">
          <ModeToggle />
          {session ? (
            <Button asChild>
              <Link href="/projects/new">Submit Project</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}