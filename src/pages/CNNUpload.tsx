import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Brain } from 'lucide-react';

const CNNUpload: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = () => {
    setResult('Concave jaw detected with 92% confidence');
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">CNN Jaw Classification</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Upload X-Ray for Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Drop your X-ray image here or click to upload</p>
            </div>
            
            <Button onClick={handleUpload} className="w-full">
              Analyze X-Ray
            </Button>
            
            {result && (
              <Card className="bg-success/10 border-success">
                <CardContent className="pt-6">
                  <p className="text-success font-semibold">{result}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CNNUpload;