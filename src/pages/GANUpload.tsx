import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ImageIcon } from 'lucide-react';

const GANUpload: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">GAN Jaw Restoration</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-6 w-6" />
              Upload X-Ray for Restoration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Upload X-ray for AI-powered restoration</p>
            </div>
            
            <Button className="w-full">
              Generate Restoration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GANUpload;