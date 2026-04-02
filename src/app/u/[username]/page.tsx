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
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-b from-slate-100 via-zinc-100 to-stone-200 px-4 py-8 sm:px-6 lg:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-300/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 right-0 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl space-y-6">
        <section className="animate-in fade-in-0 slide-in-from-top-3 duration-700 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Public Message Board
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Send anonymous message to {displayUsername}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Share honest feedback safely. Your identity stays private while the
            message is delivered instantly.
          </p>
        </section>

        <section className="grid animate-in fade-in-0 slide-in-from-bottom-4 duration-700 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <div className="rounded-3xl border border-slate-300/70 bg-white/90 p-6 shadow-[0_18px_55px_-34px_rgba(15,23,42,0.4)] backdrop-blur-sm sm:p-7">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Compose
              </p>
              <h2 className="text-2xl font-black text-slate-900">Write Message</h2>
            </div>

            <label
              htmlFor="anonymous-message"
              className="mt-5 block text-sm font-semibold text-slate-800"
            >
              Your Anonymous Message
            </label>
            <textarea
              id="anonymous-message"
              ref={textAreaRef}
              value={messageContent}
              onChange={(event) => setMessageContent(event.target.value)}
              placeholder="Write your anonymous message here..."
              aria-label="Write anonymous message"
              className="mt-2 min-h-56 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-inner outline-none transition-colors duration-200 focus:border-slate-500 sm:text-base"
            />

            <div className="mt-3 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Minimum 10 and maximum 300 characters</span>
              <span className={`${trimmedLength > 300 ? 'text-red-600' : 'text-slate-600'}`}>
                {trimmedLength}/300
              </span>
            </div>

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={isSending}
              className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send Message
            </button>

            {sendStatus && (
              <p className={`mt-3 text-sm font-semibold ${sendStatus.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                {sendStatus.text}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-300/70 bg-white/90 p-6 shadow-[0_18px_55px_-34px_rgba(15,23,42,0.4)] backdrop-blur-sm sm:p-7">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Smart Writing Help
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">Message Suggestions</h2>
            <p className="mt-2 text-sm text-slate-600">
              Click Suggest Message to generate ideas. Tap any suggestion to
              auto-fill your message box.
            </p>

            <button
              type="button"
              onClick={handleSuggestMessages}
              disabled={isSuggesting}
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 transition-colors duration-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSuggesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Suggest Message
            </button>

            {suggestionStatus && (
              <p className="mt-3 text-sm text-slate-600">{suggestionStatus}</p>
            )}

            {suggestions.length > 0 ? (
              <div className="mt-4 flex flex-col gap-3">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion}-${index}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-sm"
                  >
                    <p className="text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                      Suggestion {index + 1}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">
                      {suggestion}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                Suggestions will appear here in a vertical list.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Page;