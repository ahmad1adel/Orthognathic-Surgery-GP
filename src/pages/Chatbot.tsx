import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Send } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI dental assistant. How can I help you today?' }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, 
      { role: 'user', content: message },
      { role: 'assistant', content: 'Thank you for your question. This is a demo response from our AI chatbot.' }
    ]);
    setMessage('');
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">AI Dental Assistant</h1>
        
        <Card className="h-96 mb-4">
          <CardContent className="p-4 h-full overflow-y-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Input
            placeholder="Ask about dental conditions..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;