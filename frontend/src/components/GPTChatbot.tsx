'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TbMessageCircle, TbX, TbSend, TbStarFilled, TbMapPin, TbClock, TbArrowRight } from 'react-icons/tb';
import { ChatMessage, Trip } from '@/types';
import { mockTrips } from '@/lib/mockData';

const INITIAL_MESSAGE: ChatMessage = {
  id: '0', role: 'assistant',
  content: "Tell me your dream trip — budget, days, vibe, group size",
  timestamp: new Date()
};

// Find matching trips based on user message
function findMatchingTrips(msg: string): Trip[] {
  const lower = msg.toLowerCase();
  let matches: Trip[] = [];

  // Check for specific destinations
  mockTrips.forEach(trip => {
    const destLower = trip.destination.toLowerCase();
    const titleLower = trip.title.toLowerCase();
    if (lower.includes(destLower.split(',')[0].toLowerCase()) || lower.includes(titleLower.split(' ')[0].toLowerCase())) {
      matches.push(trip);
    }
  });

  // Check for activity types
  if (matches.length === 0) {
    const activityKeywords: Record<string, string[]> = {
      'adventure': ['adventure', 'trek', 'trekking', 'hiking', 'extreme', 'thrill'],
      'beach': ['beach', 'sea', 'ocean', 'coast', 'sun', 'swim', 'sand'],
      'culture': ['culture', 'heritage', 'history', 'temple', 'fort', 'palace', 'museum'],
      'nature': ['nature', 'mountain', 'hill', 'forest', 'wildlife', 'scenic', 'green'],
      'wellness': ['wellness', 'spa', 'relax', 'peaceful', 'calm', 'ayurved'],
      'water-sports': ['water sport', 'diving', 'scuba', 'snorkel', 'surf', 'kayak'],
    };

    for (const [activity, keywords] of Object.entries(activityKeywords)) {
      if (keywords.some(k => lower.includes(k))) {
        matches.push(...mockTrips.filter(t => t.activityType.includes(activity)));
      }
    }
  }

  // Check for budget
  const budgetMatch = lower.match(/(?:budget|under|below|max|within|around)\s*(?:₹|rs\.?|inr)?\s*(\d+[,\d]*)/i);
  if (budgetMatch) {
    const budget = parseInt(budgetMatch[1].replace(/,/g, ''));
    const budgetTrips = mockTrips.filter(t => t.price <= budget);
    if (budgetTrips.length > 0) {
      matches = matches.length > 0
        ? matches.filter(t => t.price <= budget)
        : budgetTrips;
    }
  }

  // Deduplicate and limit to 3
  const unique = [...new Map(matches.map(t => [t._id, t])).values()];
  return unique.slice(0, 3);
}

// Simulated AI responses based on keywords
function generateResponse(msg: string): { text: string; trips: Trip[] } {
  const lower = msg.toLowerCase();
  const matchedTrips = findMatchingTrips(msg);

  if (matchedTrips.length > 0) {
    let prefix = '';
    if (lower.includes('budget') || lower.includes('cheap') || lower.includes('affordable')) {
      prefix = `Great question about budget travel! 💰 Here are some trips that match your criteria:`;
    } else if (lower.includes('beach') || lower.includes('sea')) {
      prefix = `Love beach vibes! 🏖️ Here are some perfect beach getaways:`;
    } else if (lower.includes('adventure') || lower.includes('trek')) {
      prefix = `Ready for an adventure? 🏔️ Check out these thrilling trips:`;
    } else if (lower.includes('culture') || lower.includes('heritage')) {
      prefix = `Culture enthusiast! 🏛️ Here are some heritage-rich experiences:`;
    } else {
      prefix = `Based on what you're looking for, here are my top recommendations! 🌟`;
    }
    return { text: prefix, trips: matchedTrips };
  }

  // Fallback responses
  if (lower.includes('pack') || lower.includes('luggage')) return { text: "Great question about packing! 🎒 Here are my tips:\n\n• **Roll your clothes** to save space\n• **Pack versatile layers** that mix and match\n• **Always carry a power bank** and universal adapter\n• **Ziplock bags** for toiletries and wet items\n\nWant a detailed list? Try our AI Packing Assistant! 📋", trips: [] };
  if (lower.includes('budget') || lower.includes('cheap') || lower.includes('affordable')) return { text: "Traveling on a budget? Here are my top tips! 💰\n\n• Book flights on **Tuesdays & Wednesdays** for best prices\n• Use **hostels or homestays** instead of hotels\n• Eat at **local street food** stalls\n• Travel during **shoulder season** (Sep-Nov, Feb-Apr)\n\nOur AI Trip Planner can create a budget-optimized itinerary for you! 🗺️", trips: [] };
  if (lower.includes('weather') || lower.includes('season') || lower.includes('when')) return { text: "Great timing question! 📅\n\n• **Mountains (Manali/Ladakh):** Jun-Sep\n• **Beaches (Goa/Andaman):** Oct-Feb\n• **Rajasthan:** Oct-Mar\n• **Kerala:** Sep-Mar\n\nI can help plan around the perfect season for your dream destination!", trips: [] };
  if (lower.includes('safety') || lower.includes('safe')) return { text: "Safety first! 🛡️\n\n• Share your itinerary with family\n• Keep digital copies of documents\n• Use registered transport\n• Carry a basic first-aid kit\n• Buy travel insurance\n• Keep emergency contacts handy\n\nStay safe and enjoy your travels!", trips: [] };

  return { text: "That's a great question! 🌟 I can help you with:\n\n• 🗺️ **Trip recommendations** — tell me your interests!\n• 🎒 **Packing advice**\n• 💰 **Budget planning**\n• 🌤️ **Best travel seasons**\n• 🛡️ **Safety tips**\n\nTry asking: \"Show me beach trips under ₹15000\" or \"I want an adventure trip\"!", trips: [] };
}

// Trip card component for chat
function ChatTripCard({ trip }: { trip: Trip }) {
  const gradients = ['from-blue-400 to-purple-600', 'from-orange-400 to-pink-500', 'from-teal-400 to-emerald-600'];
  const idx = mockTrips.indexOf(trip);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden mt-2 hover:shadow-md transition-all">
      <div className={`h-20 bg-gradient-to-br ${gradients[idx % gradients.length]} relative`}>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white text-[10px] font-medium">
          <TbStarFilled size={10} className="text-yellow-400" /> {trip.rating}
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-xs mb-0.5">{trip.title}</h4>
        <div className="flex items-center gap-2 text-[10px] font-medium text-muted mb-2">
          <span className="flex items-center gap-1"><TbMapPin size={10} className="text-accent" /> {trip.destination}</span>
          <span className="flex items-center gap-1"><TbClock size={10} /> {trip.duration} Days</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-accent">₹{trip.price.toLocaleString()}</span>
          <Link href={`/trips/${trip._id}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-hover border border-border text-foreground text-[10px] font-semibold hover:bg-accent hover:border-accent hover:text-white transition-all">
            View Details <TbArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GPTChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<(ChatMessage & { trips?: Trip[] })[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('voynex_chat_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) setMessages(parsed);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > 1) {
      sessionStorage.setItem('voynex_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 800));
    const { text, trips } = generateResponse(input);
    const aiMsg = { id: (Date.now() + 1).toString(), role: 'assistant' as const, content: text, timestamp: new Date(), trips };
    setMessages(prev => [...prev, aiMsg]);
    setTyping(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button onClick={() => setIsOpen(!isOpen)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-teal text-white shadow-xl shadow-accent/20 flex items-center justify-center hover:shadow-2xl transition-shadow">
        {isOpen ? <TbX size={24} /> : <TbMessageCircle size={24} />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] rounded-2xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-primary to-teal text-white flex-shrink-0">
              <h3 className="font-bold text-lg">VOYNEX AI Assistant</h3>
              <p className="text-xs text-white/70">Ask me anything — I can recommend trips too!</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${msg.role === 'user' ? '' : ''}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user' ? 'bg-accent text-white rounded-br-md' : 'bg-surface-hover text-foreground rounded-bl-md'}`}>
                      {msg.content}
                    </div>
                    {/* Trip cards */}
                    {msg.trips && msg.trips.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.trips.map(trip => (
                          <ChatTripCard key={trip._id} trip={trip} />
                        ))}
                      </div>
                    )}
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
            <div className="px-4 py-3 border-t border-border flex-shrink-0">
              <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Try: 'beach trips under ₹15000'"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                <button type="submit" disabled={!input.trim()}
                  className="px-4 py-2.5 rounded-xl bg-accent text-white disabled:opacity-50 hover:bg-accent-dark transition-all tap-target">
                  <TbSend size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
