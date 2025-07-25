import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Conditions: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-16">Jaw Conditions</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Agnathia</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Absence or severe underdevelopment of the jaw.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Macrognathia</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Abnormally large jaw development.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Micrognathia</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Abnormally small or underdeveloped jaw.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Conditions;