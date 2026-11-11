import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { TextInput } from '@/components/common/TextInput';
import type { CandidateMatch } from '@/types/domain';
import { useEffect, useRef, useState, type FormEvent } from 'react';

const MAX_MESSAGE_LENGTH = 1000;
const NOT_CONNECTED_REPLY =
  'The chat service is not connected yet. Your message was not sent anywhere.';
const SUGGESTIONS = [
  'Summarise this candidate',
  'Which required skills are missing?',
  'What should I probe in the interview?',
];

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: number;
  role: ChatRole;
  text: string;
}

function Bubble({ message }: Readonly<{ message: ChatMessage }>) {
  const isUser = message.role === 'user';
  return (
    <li className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <p
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
          isUser
            ? 'rounded-br-sm bg-brand-primary text-white'
            : 'rounded-bl-sm bg-brand-primary-soft text-brand-text'
        }`}
      >
        {message.text}
      </p>
    </li>
  );
}

interface ChatPanelProps {
  candidate: CandidateMatch;
}

// UI only: replies are a fixed notice until the chat endpoint is wired up.
// Render with key={candidate.resumeId} so a conversation never carries over to another candidate.
export function ChatPanel({ candidate }: Readonly<ChatPanelProps>) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const nextId = useRef(0);
  const endRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: 'end' });
  }, [messages]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const userMessage: ChatMessage = { id: nextId.current++, role: 'user', text };
    const reply: ChatMessage = { id: nextId.current++, role: 'assistant', text: NOT_CONNECTED_REPLY };
    setMessages((current) => [...current, userMessage, reply]);
    setDraft('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send(draft);
  };

  return (
    <Card
      title={`Chat · ${candidate.name}`}
      description={`Ask about ${candidate.name}'s resume, fit for the role or interview plan.`}
    >
      <ul
        aria-label="Conversation"
        aria-live="polite"
        className="flex h-[50vh] flex-col gap-3 overflow-y-auto rounded-xl border border-brand-line bg-brand-bg/50 p-4"
      >
        {messages.length === 0 && (
          <li className="m-auto text-center text-sm text-brand-muted">
            Start a conversation or try a suggestion below.
          </li>
        )}
        {messages.map((message) => (
          <Bubble key={message.id} message={message} />
        ))}
        <li ref={endRef} aria-hidden="true" />
      </ul>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => send(suggestion)}
            className="rounded-full border border-brand-line bg-white px-3 py-1 text-xs text-brand-muted hover:bg-brand-primary-soft"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <TextInput
          aria-label="Message"
          value={draft}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="Type your message…"
          onChange={(event) => setDraft(event.target.value)}
        />
        <Button type="submit" disabled={draft.trim() === ''}>
          Send
        </Button>
      </form>
    </Card>
  );
}
