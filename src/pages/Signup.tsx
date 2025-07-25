import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Signup: React.FC = () => {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');

  return (
    <div className="min-h-screen py-20 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Full Name" />
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <div className="flex gap-2">
            <Button
              type="button"
              variant={role === 'patient' ? 'default' : 'outline'}
              onClick={() => setRole('patient')}
              className="flex-1"
            >
              Patient
            </Button>
            <Button
              type="button"
              variant={role === 'doctor' ? 'default' : 'outline'}
              onClick={() => setRole('doctor')}
              className="flex-1"
            >
              Doctor
            </Button>
          </div>
          <Button className="w-full">Create Account</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;