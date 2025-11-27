'use client';

import { useState, useEffect } from 'react';
import { Search, Shield, User, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
  createdAt: string;
}

interface CurrentUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [searchQuery, currentUser]);

  const fetchCurrentUser = async () => {
    try {
      const sessionToken = localStorage.getItem('bearer_token');
      if (!sessionToken) {
        toast.error('No session found');
        return;
      }

      const response = await fetch('/api/auth/verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      } else {
        toast.error('Failed to verify session');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      toast.error('Failed to fetch user data');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '100',
        ...(searchQuery && { search: searchQuery }),
      });
      
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'renter', action: string) => {
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (response.ok) {
        toast.success(`User ${action} successfully`);
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || `Failed to ${action.toLowerCase()} user`);
      }
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing user:`, error);
      toast.error(`Failed to ${action.toLowerCase()} user`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'manager':
        return (
          <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">
            <Crown className="w-3 h-3 mr-1" />
            Manager
          </Badge>
        );
      case 'admin':
        return (
          <Badge variant="default">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      default:
        return <Badge variant="secondary">Renter</Badge>;
    }
  };

  const canModifyUser = (targetUser: User) => {
    // Only managers can modify roles
    if (currentUser?.role !== 'manager') {
      return false;
    }
    
    // Cannot modify manager roles
    if (targetUser.role === 'manager') {
      return false;
    }
    
    return true;
  };

  return (
    <div className="space-y-6">
      {currentUser?.role !== 'manager' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <Shield className="w-4 h-4 inline mr-2" />
            You do not have permission to manage user roles. Only managers can promote or demote users.
          </p>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-2 border-primary/20">
                    {user.profilePicture ? (
                      <Image
                        src={user.profilePicture}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Joined {formatDate(user.createdAt)}
                    </p>
                  </div>
                  
                  {canModifyUser(user) && (
                    <div className="flex gap-2">
                      {user.role === 'renter' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline">
                              <ChevronUp className="w-4 h-4 mr-2" />
                              Promote to Admin
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Promote to Admin</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to promote {user.firstName} {user.lastName} to admin? They will have access to manage listings and view user information.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRoleChange(user.id, 'admin', 'promoted')}>
                                Yes, promote
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      
                      {user.role === 'admin' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline">
                              <ChevronDown className="w-4 h-4 mr-2" />
                              Demote to Renter
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Demote to Renter</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to demote {user.firstName} {user.lastName} to renter? They will lose access to the admin dashboard and all admin privileges.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRoleChange(user.id, 'renter', 'demoted')}>
                                Yes, demote
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}