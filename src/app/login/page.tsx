'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Home, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast.success('Account created successfully!', {
        description: 'Please log in with your credentials.',
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackURL: '/my-bookings',
      });

      if (error?.code) {
        toast.error('Login failed', {
          description: 'Invalid email or password. Please make sure you have already registered an account and try again.',
        });
        return;
      }

      toast.success('Welcome back!', {
        description: 'You have successfully logged in.',
      });

      const redirect = searchParams.get('redirect') || '/my-bookings';
      router.push(redirect);
    } catch (error) {
      toast.error('Login failed', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <Link href="/" className="flex items-center justify-center gap-2 text-2xl font-bold text-primary mx-auto">
            <Home className="w-8 h-8" />
            <span>StayFinder</span>
          </Link>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Log in to your account to continue</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete="off"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, rememberMe: checked as boolean })
                }
              />
              <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                Remember me
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                'Logging in...'
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </>
              )}
            </Button>
            <div className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Create an account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
