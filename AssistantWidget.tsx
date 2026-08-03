import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';

const SparkleIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v4m0 12v4M2 12h4m12 0h4m-2.93-7.07l-2.83 2.83M7.76 16.24l-2.83 2.83M4.34 4.93l2.83 2.83m7.07 7.07l2.83 2.83" />
  </svg>
);

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Bonjour ! Je peux vous expliquer comment utiliser Métrio — que voulez-vous savoir ?',
};

export interface AssistantWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssistantWidget: React.FC<AssistantWidgetProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const payloadMessages = nextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        throw new Error('Erreur HTTP ' + res.status);
      }

      const data = await res.json();
      const replyText =
        data.reply || data.content || "Je n'ai pas pu obtenir de réponse.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: replyText,
        },
      ]);
    } catch (err) {
      console.error('Erreur assistant widget:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Je n'ai pas pu répondre, réessayez.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs font-sans animate-fade-in">
          {/* Backdrop Click to close */}
          <div className="flex-1" onClick={onClose} />

          {/* Panel Container */}
          <div className="w-full sm:w-[385px] bg-white h-[85vh] sm:h-full shadow-2xl border-t sm:border-t-0 sm:border-l border-[#E2E8F0] rounded-t-2xl sm:rounded-none flex flex-col relative self-end sm:self-auto animate-slide-in-right">
            {/* Header */}
            <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shrink-0 rounded-t-2xl sm:rounded-none">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shadow-xs shrink-0">
                  <SparkleIcon size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-[15px] text-[#1E293B] flex items-center gap-1.5 leading-tight">
                    Assistant Métrio
                    <SparkleIcon size={13} className="text-[#4F46E5]" />
                  </h3>
                  <p className="text-[11px] text-[#475569] font-medium">
                    En ligne • Aide & conseils Métrio
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-[#475569] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer"
                title="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FCFCFD]">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center shrink-0 mt-0.5">
                        <SparkleIcon size={13} />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed break-words font-medium shadow-2xs ${
                        isUser
                          ? 'bg-[#4F46E5] text-white rounded-br-xs'
                          : 'bg-[#F1F5F9] text-[#1E293B] rounded-bl-xs border border-[rgba(0,0,0,0.04)]'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center shrink-0 mt-0.5">
                    <SparkleIcon size={13} />
                  </div>
                  <div className="bg-[#F1F5F9] border border-[rgba(0,0,0,0.04)] text-[#475569] px-3.5 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5 text-[12px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-[#E2E8F0] bg-white flex items-center gap-2 shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question sur Métrio..."
                disabled={isLoading}
                className="flex-1 min-h-[44px] sm:h-9 px-3.5 bg-[#F1F5F9] border border-transparent focus:border-[#4F46E5]/40 focus:bg-white rounded-xl text-base sm:text-[13px] text-[#1E293B] placeholder-[#A1A1AA] outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{ backgroundColor: input.trim() && !isLoading ? '#4F46E5' : '#E4E4E7' }}
                className="w-11 h-11 sm:w-9 sm:h-9 rounded-full text-white flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
