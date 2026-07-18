'use client';

import { Loader2, Send, Sparkles } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

type ApiResponse = {
  success: boolean;
  message: string;
  suggestions?: string[];
};


function Page() {
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params.username ?? '');
  const displayUsername = username || 'this user';

  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [suggestionStatus, setSuggestionStatus] = useState<string>('');

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const trimmedLength = useMemo(() => messageContent.trim().length, [messageContent]);
  const isValidLength = trimmedLength >= 10 && trimmedLength <= 300;

  async function handleSendMessage() {
    if (!username) {
      setSendStatus({ type: 'error', text: 'Invalid profile URL. Username is missing.' });
      return;
    }

    if (!isValidLength) {
      setSendStatus({
        type: 'error',
        text: 'Message must be between 10 and 300 characters.',
      });
      return;
    }

    setIsSending(true);
    setSendStatus(null);

    try {
      const response = await fetch('/api/Send-Message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          content: messageContent.trim(),
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send message.');
      }

      setSendStatus({ type: 'success', text: data.message || 'Message sent successfully.' });
      toast.success(data.message || 'Message sent successfully', { duration: 2000 });
      setMessageContent('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message.';
      setSendStatus({ type: 'error', text: message });
      toast.error(message, { duration: 2000 });
    } finally {
      setIsSending(false);
    }
  }

  async function handleSuggestMessages() {
    setIsSuggesting(true);
    setSuggestionStatus('');

    try {
      const response = await fetch('/api/Suggest-Messages', {
        method: 'POST',
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success || !Array.isArray(data.suggestions)) {
        throw new Error(data.message || 'Failed to fetch suggestions.');
      }

      const nextSuggestions = data.suggestions.slice(0, 3);
      setSuggestions(nextSuggestions);
      setSuggestionStatus(data.message || 'Suggestions loaded.');
      toast.success(data.message || 'Suggestions loaded', { duration: 2000 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch suggestions.';
      setSuggestionStatus(message);
      setSuggestions([]);
      toast.error(message, { duration: 2000 });
    } finally {
      setIsSuggesting(false);
    }
  }

  function handleSuggestionClick(suggestion: string) {
    setMessageContent(suggestion);
    textAreaRef.current?.focus();
  }

  return (
    <main className="relative min-h-[calc(100vh-80px)] bg-[#131313] px-4 py-12 sm:px-6 lg:px-10">
      <div className="relative mx-auto max-w-7xl space-y-12">
        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
          <p className="inline-flex items-center gap-2 rounded-[2px] border border-[#3cffd0] bg-transparent px-3 py-1 font-mono-caps text-[10px] text-[#3cffd0]">
            PUBLIC MESSAGE BOARD
          </p>
          <h1 className="mt-6 font-display text-[60px] sm:text-[70px] uppercase text-white leading-[0.9]">
            SEND ANONYMOUS MESSAGE TO<br />{displayUsername}
          </h1>
          <p className="mt-4 max-w-2xl font-mono-caps text-[12px] text-[#949494] leading-relaxed">
            SHARE HONEST FEEDBACK SAFELY. YOUR IDENTITY STAYS PRIVATE WHILE THE MESSAGE IS DELIVERED INSTANTLY.
          </p>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <div className="space-y-1">
              <p className="font-mono-caps text-[11px] text-[#949494]">COMPOSE</p>
              <h2 className="font-display text-[40px] uppercase text-white leading-[0.9]">WRITE MESSAGE</h2>
            </div>

            <label
              htmlFor="anonymous-message"
              className="mt-8 block font-mono-caps text-[11px] text-[#949494]"
            >
              YOUR ANONYMOUS MESSAGE
            </label>
            <textarea
              id="anonymous-message"
              ref={textAreaRef}
              value={messageContent}
              onChange={(event) => setMessageContent(event.target.value)}
              placeholder="WRITE YOUR ANONYMOUS MESSAGE HERE..."
              aria-label="Write anonymous message"
              className="mt-2 min-h-56 w-full rounded-[2px] border border-[#313131] bg-[#131313] px-4 py-3 font-sans text-[16px] text-white placeholder-[#313131] outline-none transition-colors duration-150 focus:border-[#3cffd0] focus:ring-0"
            />

            <div className="mt-3 flex items-center justify-between font-mono-caps text-[10px]">
              <span className="text-[#949494]">MINIMUM 10 AND MAXIMUM 300 CHARACTERS</span>
              <span className={`${trimmedLength > 300 ? 'text-[#5200ff]' : 'text-[#949494]'}`}>
                {trimmedLength}/300
              </span>
            </div>

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={isSending}
              className={`mt-6 flex items-center justify-center gap-2 whitespace-nowrap px-6 h-11 transition-colors ${
                isSending
                  ? "border border-[#313131] rounded-[24px] text-[#949494] font-mono-caps text-[11px] cursor-not-allowed bg-transparent"
                  : "jelly-mint-pill"
              }`}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSending ? 'SENDING...' : 'SEND MESSAGE'}
            </button>

            {sendStatus && (
              <p className={`mt-4 font-mono-caps text-[11px] ${sendStatus.type === 'success' ? 'text-[#3cffd0]' : 'text-[#5200ff]'}`}>
                {sendStatus.text}
              </p>
            )}
          </div>

          <div className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <p className="font-mono-caps text-[11px] text-[#949494]">SMART WRITING HELP</p>
            <h2 className="mt-1 font-display text-[40px] uppercase text-white leading-[0.9]">MESSAGE SUGGESTIONS</h2>
            <p className="mt-4 font-mono-caps text-[11px] text-[#949494] leading-relaxed">
              CLICK SUGGEST MESSAGE TO GENERATE IDEAS. TAP ANY SUGGESTION TO AUTO-FILL YOUR MESSAGE BOX.
            </p>

            <button
              type="button"
              onClick={handleSuggestMessages}
              disabled={isSuggesting}
              className={`mt-6 flex items-center justify-center gap-2 whitespace-nowrap px-6 h-11 transition-colors ${
                isSuggesting
                  ? "border border-[#313131] rounded-[24px] text-[#949494] font-mono-caps text-[11px] cursor-not-allowed bg-transparent"
                  : "dark-slate-pill"
              }`}
            >
              {isSuggesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isSuggesting ? 'SUGGESTING...' : 'SUGGEST MESSAGE'}
            </button>

            {suggestionStatus && (
              <p className="mt-4 font-mono-caps text-[10px] text-[#949494]">{suggestionStatus.toUpperCase()}</p>
            )}

            {suggestions.length > 0 ? (
              <div className="mt-6 flex flex-col gap-3">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion}-${index}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full rounded-[2px] border border-[#313131] bg-[#131313] px-4 py-3 text-left transition-colors duration-150 hover:border-[#3cffd0] group"
                  >
                    <p className="font-mono-caps text-[10px] text-[#3cffd0] group-hover:text-white transition-colors">
                      SUGGESTION {index + 1}
                    </p>
                    <p className="mt-2 font-sans text-[14px] text-white leading-relaxed">
                      {suggestion}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[2px] border border-dashed border-[#313131] bg-[#131313] px-4 py-6 font-mono-caps text-[11px] text-[#949494] text-center">
                SUGGESTIONS WILL APPEAR HERE IN A VERTICAL LIST.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Page;