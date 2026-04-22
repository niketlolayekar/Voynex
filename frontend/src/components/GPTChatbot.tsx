'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { ChatMessage } from '@/types';

const INITIAL_MESSAGE: ChatMessage = {
  id: '0', role: 'assistant',
  content: "Hi! I'm VOYNEX AI 🌍 Ask me anything about travel — destinations, packing tips, budgets, or local customs!",
  timestamp: new Date()
};

// Simulated AI responses based on keywords
function generateResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('pack') || lower.includes('luggage')) return "Great question about packing! 🎒 Here are my tips:\n\n• **Roll your clothes** to save space\n• **Pack versatile layers** that mix and match\n• **Always carry a power bank** and universal adapter\n• **Ziplock bags** for toiletries and wet items\n\nWant me to create a detailed packing list? Try our AI Packing Assistant! 📋";
  if (lower.includes('budget') || lower.includes('cheap') || lower.includes('affordable')) return "Traveling on a budget? Here are my top tips! 💰\n\n• Book flights on **Tuesdays & Wednesdays** for best prices\n• Use **hostels or homestays** instead of hotels\n• Eat at **local street food** stalls\n• Travel during **shoulder season** (Sep-Nov, Feb-Apr)\n\nOur AI Trip Planner can create a budget-optimized itinerary for you! 🗺️";
  if (lower.includes('manali') || lower.includes('himalaya')) return "Manali is magical! 🏔️\n\n**Best time:** Oct-Feb for snow, Mar-Jun for adventure\n**Must do:** Solang Valley, Old Manali, Jogini Falls\n**Budget:** ₹15,000-25,000 for 5 days\n**Tip:** Book our Mystical Manali trip for the complete experience!";
  if (lower.includes('goa') || lower.includes('beach')) return "Goa is perfect for beach lovers! 🏖️\n\n**North Goa:** Parties & nightlife (Baga, Calangute)\n**South Goa:** Peaceful & scenic (Palolem, Agonda)\n**Best time:** Nov-Feb\n**Budget:** ₹10,000-20,000 for 4 days\n\nCheck out our Goa Beach Paradise trip!";
  if (lower.includes('weather') || lower.includes('season') || lower.includes('when')) return "Great timing question! 📅\n\n• **Mountains (Manali/Ladakh):** Jun-Sep\n• **Beaches (Goa/Andaman):** Oct-Feb\n• **Rajasthan:** Oct-Mar\n• **Kerala:** Sep-Mar\n\nI can help plan around the perfect season for your dream destination!";
  if (lower.includes('safety') || lower.includes('safe')) return "Safety first! 🛡️\n\n• Share your itinerary with family\n• Keep digital copies of documents\n• Use registered transport\n• Carry a basic first-aid kit\n• Buy travel insurance\n• Keep emergency contacts handy\n\nStay safe and enjoy your travels!";
  return "That's a great question! 🌟 I can help you with:\n\n• 🗺️ **Destination recommendations**\n• 🎒 **Packing advice**\n• 💰 **Budget planning**\n• 🌤️ **Best travel seasons**\n• 🛡️ **Safety tips**\n\nWhat would you like to know more about?";
}

export default function GPTChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: generateResponse(input), timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setTyping(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button onClick={() => setIsOpen(!isOpen)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-teal text-white shadow-xl shadow-primary/30 flex items-center justify-center hover:shadow-2xl transition-shadow">
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] rounded-2xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-primary to-teal text-white">
              <h3 className="font-bold text-lg">VOYNEX AI Assistant</h3>
              <p className="text-xs text-white/70">Ask me anything about travel!</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user' ? 'bg-primary text-white rounded-br-md' : 'bg-surface-hover text-foreground rounded-bl-md'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-surface-hover px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border">
              <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about travel..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <button type="submit" disabled={!input.trim()}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white disabled:opacity-50 hover:bg-primary-dark transition-all">
                  <FiSend size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
