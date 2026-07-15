'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TbMessageCircle, TbSend, TbStarFilled, TbMapPin, TbClock, TbArrowRight, TbCpu } from 'react-icons/tb';
import { ChatMessage, Trip } from '@/types';
import { mockTrips } from '@/lib/mockData';
import Breadcrumbs from '@/components/Breadcrumbs';
import EmptyState from '@/components/EmptyState';

const INITIAL_MESSAGE: ChatMessage = {
  id: '0', role: 'assistant',
  content: "Tell me your dream trip — budget, days, vibe, group size",
  timestamp: new Date()
};

// Find matching trips based on user message
function findMatchingTrips(msg: string): Trip[] {
  const lower = msg.toLowerCase();
  let matches: Trip[] = [];

  mockTrips.forEach(trip => {
    const destLower = trip.destination.toLowerCase();
    const titleLower = trip.title.toLowerCase();
    if (lower.includes(destLower.split(',')[0].toLowerCase()) || lower.includes(titleLower.split(' ')[0].toLowerCase())) {
      matches.push(trip);
    }
  });

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

  const budgetMatch = lower.match(/(?:budget|under|below|max|within|around)\s*(?:₹|rs\.?|inr)?\s*(\d+[,\d]*)/i);
  if (budgetMatch) {
    const budget = parseInt(budgetMatch[1].replace(/,/g, ''));
    const budgetTrips = mockTrips.filter(t => t.price <= budget);
    if (budgetTrips.length > 0) {
      matches = matches.length > 0 ? matches.filter(t => t.price <= budget) : budgetTrips;
    }
  }

  const unique = [...new Map(matches.map(t => [t._id, t])).values()];
  return unique.slice(0, 3);
}

function generateResponse(msg: string): { text: string; trips: Trip[] } {
  const lower = msg.toLowerCase();
  const matchedTrips = findMatchingTrips(msg);

  if (matchedTrips.length > 0) {
    let prefix = '';
    if (lower.includes('budget') || lower.includes('cheap') || lower.includes('affordable') || lower.includes('under')) {
      prefix = `Great question about budget travel! 💰 Here are 3 trips that match what you're looking for:`;
    } else if (lower.includes('beach') || lower.includes('sea')) {
      prefix = `Love beach vibes! 🏖️ Here are 3 trips that match what you're looking for:`;
    } else if (lower.includes('adventure') || lower.includes('trek')) {
      prefix = `Ready for an adventure? 🏔️ Here are 3 trips that match what you're looking for:`;
    } else if (lower.includes('culture') || lower.includes('heritage')) {
      prefix = `Culture enthusiast! 🏛️ Here are 3 trips that match what you're looking for:`;
    } else {
      prefix = `Here are 3 trips that match what you're looking for:`;
    }
    return { text: prefix, trips: matchedTrips };
  }

  if (lower.includes('pack') || lower.includes('luggage')) return { text: "Great question about packing! 🎒 Here are my tips:\n\n• **Roll your clothes** to save space\n• **Pack versatile layers** that mix and match\n• **Always carry a power bank** and universal adapter\n• **Ziplock bags** for toiletries and wet items\n\nWant a detailed list? Try our AI Packing Assistant! 📋", trips: [] };
  if (lower.includes('weather') || lower.includes('season') || lower.includes('when')) return { text: "Great timing question! 📅\n\n• **Mountains (Manali/Ladakh):** Jun-Sep\n• **Beaches (Goa/Andaman):** Oct-Feb\n• **Rajasthan:** Oct-Mar\n• **Kerala:** Sep-Mar\n\nI can help plan around the perfect season for your dream destination!", trips: [] };
  if (lower.includes('safety') || lower.includes('safe')) return { text: "Safety first! 🛡️\n\n• Share your itinerary with family\n• Keep digital copies of documents\n• Use registered transport\n• Carry a basic first-aid kit\n• Buy travel insurance\n\nStay safe and enjoy your travels!", trips: [] };

  return { text: "That's a great question! 🌟 I can help you with:\n\n• 🗺️ **Trip recommendations** — tell me your interests!\n• 🎒 **Packing advice**\n• 💰 **Budget planning**\n• 🌤️ **Best travel seasons**\n• 🛡️ **Safety tips**\n\nTry asking: \"Show me beach trips under ₹15000\" or \"I want an adventure trip\"!", trips: [] };
}

function ChatTripCard({ trip }: { trip: Trip }) {
  const gradients = ['from-blue-400 to-purple-600', 'from-orange-400 to-pink-500', 'from-teal-400 to-emerald-600'];
  const idx = mockTrips.indexOf(trip);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden mt-3 max-w-[280px] hover:shadow-md transition-all">
      <div className={`h-28 bg-gradient-to-br ${gradients[idx % gradients.length]} relative`}>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white text-[10px] font-medium">
          <TbStarFilled size={10} className="text-yellow-400" /> {trip.rating}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-sm mb-1 line-clamp-1">{trip.title}</h4>
        <div className="flex items-center gap-2 text-xs font-medium text-muted mb-3">
          <span className="flex items-center gap-1"><TbMapPin size={12} className="text-accent" /> {trip.destination}</span>
          <span className="flex items-center gap-1"><TbClock size={12} /> {trip.duration} Days</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-accent">₹{trip.price.toLocaleString()}</span>
          <Link href={`/trips/${trip._id}`}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-hover border border-border text-foreground text-xs font-bold hover:bg-accent hover:border-accent hover:text-white transition-all tap-target">
            View Details <TbArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
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

  const sendMessage = async (preset?: string) => {
    const textToSend = preset || input;
    if (!textToSend.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    
    await new Promise(r => setTimeout(r, 800 + Math.random() * 800));
    const { text, trips } = generateResponse(textToSend);
    const aiMsg = { id: (Date.now() + 1).toString(), role: 'assistant' as const, content: text, timestamp: new Date(), trips };
    
    setMessages(prev => [...prev, aiMsg]);
    setTyping(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Breadcrumbs />
      
      <div className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-6 pb-24">
        
        <div className="mb-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <TbCpu size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Chatbot</h1>
            <p className="text-muted mt-1">Your personal travel expert, available 24/7.</p>
          </div>
        </div>

        {messages.length === 1 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Show me beach options instead", "Make it cheaper", "I want an adventure trip", "Family trip under ₹30000"].map(prompt => (
              <button 
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="p-4 rounded-2xl border border-border bg-card hover:border-accent hover:shadow-md transition-all text-left flex items-center gap-3 tap-target group"
              >
                <TbMessageCircle className="text-muted group-hover:text-accent transition-colors" size={20} />
                <span className="font-medium text-sm group-hover:text-accent transition-colors">{prompt}</span>
              </button>
            ))}
          </div>
        )}

        <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden flex flex-col h-[600px] max-h-[70vh]">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface/30">
            {messages.length === 0 && (
              <EmptyState 
                icon={<TbMessageCircle size={40} />}
                title="Start a conversation"
                description="Tell me your dream trip — budget, days, vibe, group size."
              />
            )}
            
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[70%]`}>
                  <div className={`px-5 py-4 rounded-3xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.role === 'user' ? 'bg-accent text-white rounded-br-sm' : 'bg-surface-hover text-foreground rounded-bl-sm border border-border/50'}`}>
                    {msg.content}
                  </div>
                  {msg.trips && msg.trips.length > 0 && (
                    <div className="mt-2 flex overflow-x-auto gap-3 pb-2 scrollbar-none">
                      {msg.trips.map(trip => (
                        <div key={trip._id} className="flex-shrink-0">
                          <ChatTripCard trip={trip} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {typing && (
              <div className="flex justify-start">
                <div className="bg-surface-hover border border-border/50 px-5 py-4 rounded-3xl rounded-bl-sm flex gap-1 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-surface border-t border-border">
            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="relative flex items-center">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                placeholder="Try: 'beach trips under ₹15000' or 'make it cheaper'"
                className="w-full pl-5 pr-14 py-4 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent tap-target" 
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="absolute right-2 p-2.5 rounded-xl bg-accent text-white disabled:opacity-50 hover:bg-accent-dark transition-all tap-target"
              >
                <TbSend size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
