import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Gallery: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-16">Before & After Gallery</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item}>
              <CardContent className="p-4">
                <div className="aspect-video bg-secondary rounded-lg mb-2"></div>
                <p className="text-sm text-muted-foreground">Case #{item} - Micrognathia Restoration</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;