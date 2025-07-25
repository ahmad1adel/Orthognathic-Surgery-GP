import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ImageIcon, MessageCircle, ArrowRight } from 'lucide-react';

const AILab: React.FC = () => {
  const tools = [
    {
      title: 'CNN Classification',
      description: 'Classify jaw shapes as concave or convex',
      icon: Brain,
      link: '/cnn-upload',
      color: 'text-primary'
    },
    {
      title: 'GAN Restoration',
      description: 'AI-powered jaw deformity correction',
      icon: ImageIcon,
      link: '/gan-upload',
      color: 'text-accent'
    },
    {
      title: 'AI Chatbot',
      description: 'Expert dental consultation',
      icon: MessageCircle,
      link: '/chatbot',
      color: 'text-success'
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">AI Laboratory</h1>
          <p className="text-xl text-muted-foreground">Access our comprehensive suite of AI-powered dental tools</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <Card key={index} className="group hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mx-auto mb-4 ${tool.color}`}>
                  <tool.icon className="h-8 w-8" />
                </div>
                <CardTitle>{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">{tool.description}</p>
                <Link to={tool.link}>
                  <Button className="w-full">
                    Try Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AILab;