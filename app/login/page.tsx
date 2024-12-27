'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useTheme } from 'next-themes';

export default function LoginPage() {
  const { theme } = useTheme();

  return (
    <div className="container max-w-[400px] mx-auto py-20">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'rgb(var(--primary))',
                brandAccent: 'rgb(var(--primary-foreground))',
              },
            },
          },
        }}
        theme={theme === 'dark' ? 'dark' : 'default'}
        providers={['github', 'google']}
      />
    </div>
  );
}