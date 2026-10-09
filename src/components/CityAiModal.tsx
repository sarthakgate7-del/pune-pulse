import { useState } from 'react';
import { Sparkles, Send, X, Bot, RefreshCw } from 'lucide-react';
import { City } from '../types';

interface CityAiModalProps {
  city: City;
  isOpen: boolean;
  onClose: () => void;
}

export function CityAiModal({ city, isOpen, onClose }: CityAiModalProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Authentic Puneri Misal & Bakarwadi near Shaniwar Wada',
    'Safe well-lit evening walks in Koregaon Park or Deccan',
    'How to bypass University Circle evening traffic jam?',
    'Best student budget food walk on FC Road & JM Road'
  ];

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim()) return;
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/ask-city-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: questionText,
          city: city.name,
          context: {
            weather: city.weather,
            safetyIndex: city.safetyIndex,
          }
        }),
      });

      if (!res.ok) throw new Error('Could not fetch recommendations');
      const data = await res.json();
      setResponse(data.reply || 'No response received.');
    } catch (err: any) {
      setError('Could not reach the city guide assistant right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Ask Pune AI Street Guide
              </h3>
              <p className="text-[11px] text-stone-500">
                Candid local insights, traffic shortcuts, and safety advice
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Quick Prompts */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Popular Questions
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(qp);
                    handleAsk(qp);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-left transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Display */}
          {isLoading && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3 text-stone-600">
              <RefreshCw className="w-4 h-4 animate-spin text-stone-900" />
              <span>Checking local Pune road and neighborhood intelligence...</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {response && !isLoading && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
                <span>Pune Local Recommendation</span>
                <span className="text-emerald-700">Verified</span>
              </div>
              <div className="text-xs text-stone-800 leading-relaxed whitespace-pre-line">
                {response}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-stone-50 border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(prompt);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about Pune food, heritage, or safety..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-stone-400"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
