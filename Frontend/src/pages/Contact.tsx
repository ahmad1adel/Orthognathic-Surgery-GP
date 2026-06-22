import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthGate } from '@/contexts/AuthGate';

const Contact: React.FC = () => {
  const { requireAuth } = useAuthGate();

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-16">Contact Us</h1>
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Your Name" />
            <Input placeholder="Email Address" type="email" />
            <Textarea placeholder="Your Message" />
            <Button className="w-full" onClick={() => requireAuth()}>Send Message</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;