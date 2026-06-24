import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Loader2 } from 'lucide-react';
import { useAuthGate } from '@/contexts/AuthGate';
import { useAuth } from '@/contexts/AuthContext';

interface Source {
  source: string;
  page: number | null;
  score: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

const RAG_API_URL = import.meta.env.VITE_RAG_API_URL || 'http://localhost:5003';
const PATIENT_CHAT_URL = import.meta.env.VITE_PATIENT_CHAT_URL || 'http://localhost:5004';

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm your AI dental assistant. Ask me anything about orthognathic surgery, jaw conditions, or treatments." },
  ]);
  const [loading, setLoading] = useState(false);
  const { requireAuth } = useAuthGate();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Patients use the lightweight Groq chatbot; doctors use the RAG (document-grounded) bot
  const isPatient = user?.role === 'patient';

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = () => {
    const text = message.trim();
    if (!text || loading) return;

    requireAuth(async () => {
      // Snapshot history (for the patient chatbot, which supports conversation context)
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      setMessage('');
      setLoading(true);

      const endpoint = isPatient ? `${PATIENT_CHAT_URL}/chat` : `${RAG_API_URL}/chat`;
      const payload = isPatient ? { message: text, history } : { message: text };
      const port = isPatient ? 5004 : 5003;

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.answer, sources: data.sources },
        ]);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              e instanceof Error
                ? `⚠️ ${e.message}`
                : `⚠️ Something went wrong. Is the chatbot service running on port ${port}?`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">AI Dental Assistant</h1>

        <Card className="h-96 mb-4">
          <CardContent ref={scrollRef} className="p-4 h-full overflow-y-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg whitespace-pre-wrap ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                >
                  {msg.content}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                      <span className="font-medium">Sources:</span>
                      <ul className="mt-1 space-y-0.5">
                        {msg.sources.map((s, i) => (
                          <li key={i}>
                            • {s.source}
                            {s.page ? ` (p.${s.page})` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="mb-4 flex justify-start">
                <div className="bg-secondary px-4 py-2 rounded-lg flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Input
            placeholder="Ask about dental conditions..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
