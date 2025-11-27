'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '',
    role: '',
  });
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check authentication and fetch profile data
  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      const sessionToken = localStorage.getItem('session_token');
      
      if (!sessionToken) {
        router.push('/login?redirect=/profile');
        return;
      }

      try {
        // Verify session - use same method as Navbar
        const verifyResponse = await fetch('/api/auth/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionToken }),
        });

        if (!verifyResponse.ok) {
          localStorage.removeItem('session_token');
          localStorage.removeItem('user_data');
          router.push('/login?redirect=/profile');
          return;
        }

        const { user: verifiedUser } = await verifyResponse.json();
        setUser(verifiedUser);

        // Fetch profile data
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          if (data.profilePicture) {
            setPreviewImage(data.profilePicture);
          }
        } else {
          toast.error('Failed to load profile');
        }
      } catch (error) {
        toast.error('Error loading profile');
        router.push('/login?redirect=/profile');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [router]);

  const processImageFile = (file: File) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large', {
        description: 'Please select an image smaller than 5MB',
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please select an image file',
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (imageFile) {
      processImageFile(imageFile);
    } else {
      toast.error('Invalid file type', {
        description: 'Please drop an image file',
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('session_token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          profilePicture: previewImage || null,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfileData(updatedData);
        setUser({
          ...user!,
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          profilePicture: updatedData.profilePicture,
        });
        toast.success('Profile updated successfully!');
      } else {
        const error = await response.json();
        toast.error('Failed to update profile', {
          description: error.error || 'Please try again',
        });
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">My Profile</CardTitle>
            <CardDescription>Manage your account information and profile picture</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center gap-4 pb-6 border-b">
                <div 
                  className={`relative cursor-pointer transition-all ${
                    isDragging ? 'scale-105' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleImageClick}
                >
                  {previewImage ? (
                    <div className={`relative w-32 h-32 rounded-full overflow-hidden border-4 transition-colors ${
                      isDragging 
                        ? 'border-primary shadow-lg' 
                        : 'border-primary/20 hover:border-primary/40'
                    }`}>
                      <Image
                        src={previewImage}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90 transition-colors z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {isDragging && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`w-32 h-32 rounded-full bg-muted flex flex-col items-center justify-center border-4 transition-colors ${
                      isDragging 
                        ? 'border-primary bg-primary/10 shadow-lg' 
                        : 'border-primary/20 hover:border-primary/40 hover:bg-muted/80'
                    }`}>
                      {isDragging ? (
                        <Upload className="w-16 h-16 text-primary" />
                      ) : (
                        <>
                          <User className="w-12 h-12 text-muted-foreground" />
                          <Upload className="w-5 h-5 text-muted-foreground mt-1" />
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Picture
                  </Button>
                  {previewImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground text-center">
                  {isDragging ? 'Drop image here' : 'Click or drag & drop to upload. JPG, PNG or GIF. Max size 5MB.'}
                </p>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    type="text"
                    value={profileData.role}
                    disabled
                    className="bg-muted capitalize"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}