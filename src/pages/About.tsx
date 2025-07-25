import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About DentalAI</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Leading the future of dental diagnostics with AI-powered solutions for jaw deformity analysis and treatment planning.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">To revolutionize dental care through advanced AI technology, making accurate diagnosis accessible to all.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-accent mb-4" />
              <CardTitle>Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">A multidisciplinary team of dental experts, AI researchers, and software engineers.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="h-12 w-12 mx-auto text-success mb-4" />
              <CardTitle>Our Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Trusted by thousands of professionals worldwide for accurate dental AI analysis.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;