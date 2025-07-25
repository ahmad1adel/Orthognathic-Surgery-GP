import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, role);
      navigate(role === 'doctor' ? '/doctor-dashboard' : '/patient-profile');
    } catch (error) {
      console.error('Login failed');
    }
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;