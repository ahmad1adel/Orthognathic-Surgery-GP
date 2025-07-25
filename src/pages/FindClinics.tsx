import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const FindClinics: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Find Nearby Clinics</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="h-96 bg-secondary rounded-lg flex items-center justify-center">
                  <MapPin className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((clinic) => (
              <Card key={clinic}>
                <CardHeader>
                  <CardTitle className="text-lg">Dental Clinic #{clinic}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">123 Medical St, City</p>
                  <p className="text-sm text-muted-foreground">2.5 km away</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindClinics;