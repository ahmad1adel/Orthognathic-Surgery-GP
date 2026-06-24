import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fileToResizedDataUrl } from '@/lib/image';

const ProfileCard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file, 256);
      await updateProfile({ profileImage: dataUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-primary/20">
            {user.profileImage ? (
              <AvatarImage src={user.profileImage} alt={user.name} />
            ) : null}
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            aria-label="Change profile photo"
            className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground capitalize">{user.role}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>

          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                {user.profileImage ? 'Change photo' : 'Upload photo'}
              </>
            )}
          </Button>

          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
