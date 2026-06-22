import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Brain, Loader2 } from 'lucide-react';
import { useAuthGate } from '@/contexts/AuthGate';

interface PredictionResult {
  prediction: string;
  confidence: number;
  scores: Record<string, number>;
}

const CNN_API_URL = import.meta.env.VITE_CNN_API_URL || 'http://localhost:5002';

const CNNUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { requireAuth } = useAuthGate();

  const onFileSelected = (selected: File | undefined) => {
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setError('');
    setPreview(URL.createObjectURL(selected));
  };

  const handleAnalyze = () => {
    if (!file) {
      setError('Please choose an X-ray image first.');
      return;
    }
    requireAuth(async () => {
      setLoading(true);
      setError('');
      setResult(null);
      try {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${CNN_API_URL}/predict`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Prediction failed');
        setResult(data);
      } catch (e) {
        setError(
          e instanceof Error
            ? `${e.message}. Is the CNN service running on ${CNN_API_URL}?`
            : 'Something went wrong.'
        );
      } finally {
        setLoading(false);
      }
    });
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
            {/* Hidden file input */}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFileSelected(e.target.files?.[0])}
            />

            {/* Drop / click zone */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onFileSelected(e.dataTransfer.files?.[0]);
              }}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-secondary/50 transition-colors"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="X-ray preview"
                  className="max-h-64 mx-auto rounded-lg object-contain"
                />
              ) : (
                <>
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Drop your X-ray image here or click to upload
                  </p>
                </>
              )}
            </div>

            {file && (
              <p className="text-sm text-muted-foreground text-center">
                Selected: <span className="font-medium text-foreground">{file.name}</span>
              </p>
            )}

            <Button onClick={handleAnalyze} className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                'Analyze X-Ray'
              )}
            </Button>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg py-3 px-4">
                {error}
              </div>
            )}

            {result && (
              <Card className="bg-success/10 border-success">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Detected jaw shape</span>
                    <span className="text-2xl font-bold text-success capitalize">
                      {result.prediction}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-semibold">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  {/* Per-class score bars */}
                  <div className="space-y-2 pt-2">
                    {Object.entries(result.scores).map(([label, score]) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{label}</span>
                          <span>{(score * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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
