import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Loader2, Lock } from 'lucide-react';
import { useAuthGate } from '@/contexts/AuthGate';
import { useAuth } from '@/contexts/AuthContext';
import { useUsage } from '@/contexts/UsageContext';
import PaywallModal from '@/components/PaywallModal';

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
  const [paywallOpen, setPaywallOpen] = useState(false);
  const { requireAuth } = useAuthGate();
  const { user } = useAuth();
  const { canUseChat, chatUsed, limits, recordChat } = useUsage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isPatient = user?.role === 'patient';
  const freeLimitLabel = isPatient ? '7' : '5';
  const limitDisplay = limits.chat === -1 ? '∞' : String(limits.chat);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = () => {
    const text = message.trim();
    if (!text || loading) return;

    requireAuth(async () => {
      if (!canUseChat) {
        setPaywallOpen(true);
        return;
      }

      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      setMessage('');
      setLoading(true);
      recordChat();

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
        <h1 className="text-4xl font-bold text-center mb-4">AI Dental Assistant</h1>

        {/* Usage indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3 bg-secondary/60 rounded-full px-5 py-2 text-sm">
            {canUseChat ? (
              <>
                <span className="text-muted-foreground">Messages today:</span>
                <span className="font-semibold text-foreground">{chatUsed} / {limitDisplay}</span>
                <div className="w-20 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: limits.chat === -1 ? '10%' : `${Math.min((chatUsed / limits.chat) * 100, 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 text-destructive" />
                <span className="text-destructive font-medium">
                  Daily limit reached ({freeLimitLabel} messages/day)
                </span>
              </>
            )}
          </div>
        </div>

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
            placeholder={canUseChat ? 'Ask about dental conditions…' : 'Daily limit reached — upgrade to continue'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading || !canUseChat}
          />
          <Button onClick={sendMessage} disabled={loading || !canUseChat}>
            {canUseChat ? <Send className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          </Button>
        </div>

        {!canUseChat && (
          <p className="text-center text-sm text-muted-foreground mt-3">
            Daily limit reached.{' '}
            <a href="/pricing" className="text-primary underline font-medium">
              Upgrade your plan
            </a>{' '}
            for more messages.
          </p>
        )}
      </div>

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        feature="AI Chatbot"
        reason={`You've reached your daily limit of ${freeLimitLabel} messages. Upgrade your plan to send more messages today.`}
      />
    </div>
  );
};

export default Chatbot;
