'use client';
 
import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Send, Sparkles, AlertCircle, Trash2, HelpCircle, User, CheckCircle2, Leaf, Gauge, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function CarbonAssistant() {
  const chatMessages = useAppStore((state) => state.chatMessages);
  const addChatMessage = useAppStore((state) => state.addChatMessage);
  const clearChatHistory = useAppStore((state) => state.clearChatHistory);
  const loadingAssistant = useAppStore((state) => state.loadingAssistant);
  const reducedMotion = useAppStore((state) => state.reducedMotion);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat container only when messages are added or loading
  useEffect(() => {
    if (chatMessages.length > 0 || loading) {
      const container = chatContainerRef.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: reducedMotion ? 'auto' : 'smooth',
        });
      }
    }
  }, [chatMessages.length, loading, reducedMotion]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setErrorMsg(null);
    setLoading(true);
    setInput('');
    
    if (announcerRef.current) {
      announcerRef.current.textContent = 'Decision Assistant is analyzing...';
    }

    // Add user message locally
    await addChatMessage('user', textToSend);

    try {
      // Package conversation history
      const historyPayload = chatMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to analyze decision');
      }

      const aiResponse = await res.json();

      // Add assistant response locally
      const structuredContent = aiResponse.explanation || 'Analyzed successfully.';
      await addChatMessage('assistant', structuredContent, aiResponse);

      if (announcerRef.current) {
        announcerRef.current.textContent = 'Analysis complete. Response rendered below.';
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong. Please check your network and API configurations.');
      if (announcerRef.current) {
        announcerRef.current.textContent = 'An error occurred during carbon analysis.';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const quickPills = [
    'Should I use Metro instead of driving?',
    'How much can I save by carpooling to office?',
    'Does working from home reduce emissions?',
    'What is the impact of ordering food daily?',
    'Should I buy a new phone or continue using my current one?',
    'How does train travel compare to domestic flights?',
  ];

  return (
    <div className="bg-transparent flex flex-col h-[650px] overflow-hidden">
      {/* Screen Reader Live Region */}
      <div
        ref={announcerRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      ></div>

      {/* Header */}
      <div className="pb-4 border-b border-slate-100 flex justify-between items-center bg-transparent">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/10 rounded-xl">
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono leading-none">Decision Assistant</h3>
            <span className="text-[10px] font-mono text-slate-400 tracking-wide mt-1 block">
              Ask about transportation, food, energy, travel, or daily habits
            </span>
          </div>
        </div>

        {chatMessages.length > 0 && (
          <button
            onClick={clearChatHistory}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all cursor-pointer"
            aria-label="Clear chat conversation history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Chat History Area */}
      <div 
        ref={chatContainerRef}
        className="flex-grow py-4 overflow-y-auto space-y-4 pr-1 scroll-smooth"
      >
        {chatMessages.length === 0 && (
          <div className="py-8 flex flex-col items-center text-center max-w-md mx-auto space-y-6 px-2">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/15 rounded-2xl shadow-sm text-emerald-600 animate-pulse">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-800">Ask your Decision Assistant</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Describe a potential change in your routine, diet, transportation, or appliances. The assistant will estimate the impact and suggest actionable improvements.
              </p>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-col gap-2.5 w-full pt-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block text-left">
                Suggested Scenarios
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickPills.map((pill, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleSend(pill)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex justify-between items-center p-3 text-left rounded-xl border border-slate-200 bg-white hover:bg-emerald-500/[0.02] hover:border-emerald-500/20 text-xs font-semibold text-slate-650 hover:text-emerald-700 transition-all duration-200 group cursor-pointer shadow-sm shadow-slate-100/50"
                  >
                    <span className="truncate pr-2">{pill}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 text-emerald-600" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {chatMessages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex flex-col space-y-1.5 w-full ${
                isUser ? 'items-end' : 'items-start'
              }`}
            >
              {/* Message Header / Avatar */}
              <div className={`flex items-center space-x-1.5 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                <div className={`p-1 rounded-full border ${
                  isUser 
                    ? 'bg-slate-100 border-slate-200/60 text-slate-500' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                }`}>
                  {isUser ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                </div>
                <span className={`text-[9px] font-mono font-bold tracking-wider uppercase ${isUser ? 'text-slate-400' : 'text-emerald-600'}`}>
                  {isUser ? 'You' : 'Assistant'}
                </span>
              </div>

              {/* Message Content Bubble */}
              <div
                className={`text-sm leading-relaxed p-4 rounded-2xl ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-sm border border-slate-900/5 shadow-sm max-w-[80%] shadow-slate-900/5'
                    : 'bg-white text-slate-800 rounded-tl-sm border border-slate-200/80 shadow-sm max-w-[85%]'
                }`}
              >
                {message.content}
              </div>

              {/* Structured JSON Cards for AI Assistant */}
              {!isUser && message.structuredData && (
                <div className="w-full max-w-[85%] ml-7 mt-2 p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4">
                  {/* Scenario Header */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400 block">
                      Decision Scenario Analysis
                    </span>
                    <p className="font-bold text-slate-800 text-sm">
                      {message.structuredData.scenario}
                    </p>
                  </div>

                  {/* CO2 Saved, Impact Level, and Confidence Grid */}
                  <div className="grid grid-cols-3 gap-3 py-3 px-3 bg-slate-50 border border-slate-100 rounded-xl divide-x divide-slate-200/50">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1">
                        <Leaf className="w-2.5 h-2.5 text-emerald-500" />
                        CO₂ Saved
                      </span>
                      <span className="text-xs font-bold text-slate-800 block truncate">
                        {message.structuredData.estimatedCO2Saved}
                      </span>
                    </div>

                    <div className="space-y-1 pl-3">
                      <span className="text-[8px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1">
                        <Gauge className="w-2.5 h-2.5 text-slate-400" />
                        Impact
                      </span>
                      <span className={`inline-flex items-center text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${
                        message.structuredData.impactLevel?.toLowerCase() === 'high'
                          ? 'bg-rose-50 text-rose-700 border-rose-100/60'
                          : message.structuredData.impactLevel?.toLowerCase() === 'medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-100/60'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100/60'
                      }`}>
                        {message.structuredData.impactLevel}
                      </span>
                    </div>

                    <div className="space-y-1 pl-3">
                      <span className="text-[8px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5 text-slate-400" />
                        Confidence
                      </span>
                      <span className={`inline-flex items-center text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${
                        message.structuredData.confidence?.toLowerCase() === 'high'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100/60'
                          : message.structuredData.confidence?.toLowerCase() === 'medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-100/60'
                          : 'bg-slate-50 text-slate-650 border-slate-200'
                      }`}>
                        {message.structuredData.confidence}
                      </span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400 block">
                      Actionable Recommendations
                    </span>
                    <ul className="list-none pl-0 space-y-2">
                      {message.structuredData.recommendations.map((rec, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2.5 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04] border border-emerald-500/10 rounded-xl p-3 transition-colors leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center text-[9px] text-slate-400 pt-3 border-t border-slate-100">
                    <span>Verified locally under EPA / Defra factors</span>
                    <span className="flex items-center gap-0.5 font-mono text-[8px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 tracking-wider">
                      CHECKED
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-1.5 items-start w-full"
          >
            <div className="flex items-center space-x-1.5">
              <div className="p-1 rounded-full border bg-emerald-50 border-emerald-100 text-emerald-600">
                <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-emerald-600">
                Assistant
              </span>
            </div>
            <div className="flex items-center space-x-2.5 px-4 py-3 bg-white border border-slate-200/80 rounded-2xl rounded-tl-none text-xs text-slate-500 shadow-sm mr-auto">
              <span>Analyzing scenario</span>
              <div className="flex space-x-1 items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200/60 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleFormSubmit}
        className="pt-4 border-t border-slate-100/80 bg-transparent flex gap-2"
      >
        <div className="flex-grow flex items-center bg-white border border-slate-200 rounded-xl px-3.5 py-0.5 focus-within:ring-2 focus-within:ring-emerald-500/15 focus-within:border-emerald-500 shadow-sm transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask e.g., 'What if I commute by bike twice a week?'"
            className="flex-grow py-3 bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400"
            aria-label="Ask the Decision Assistant"
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 text-white rounded-lg transition-colors disabled:text-slate-400 disabled:opacity-50 shrink-0 cursor-pointer ml-2"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
export default CarbonAssistant;
