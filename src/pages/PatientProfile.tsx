import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, MessageCircle, MapPin, FileText } from 'lucide-react';

const PatientProfile: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Patient Profile</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">X-Ray Analysis #{item}</p>
                        <p className="text-sm text-muted-foreground">CNN Classification: Concave</p>
                      </div>
                      <div className="text-sm text-muted-foreground">3 days ago</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                    <p className="font-medium text-success">Latest CNN Result</p>
                    <p className="text-sm">Concave jaw - 92% confidence</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="font-medium text-primary">GAN Restoration</p>
                    <p className="text-sm">Processing complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New X-Ray
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat with AI
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="mr-2 h-4 w-4" />
                  Find Clinics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;