'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbWand, TbArrowRight, TbMapPin, TbCalendar, TbCoin, TbMoodSmile, TbCheck, TbInfoCircle, TbDownload, TbShare, TbChevronLeft } from 'react-icons/tb';
import Breadcrumbs from '@/components/Breadcrumbs';

const VIBES = ['Relaxing', 'Adventurous', 'Cultural', 'Party', 'Romantic', 'Family Friendly'];
const LOADING_STEPS = [
  "Analyzing destination options...",
  "Finding hidden gems and local favorites...",
  "Optimizing routes for minimal travel time...",
  "Checking budget constraints...",
  "Finalizing your personalized itinerary..."
];

type PlannerState = 'form' | 'loading' | 'results';

export default function AIPlannerPage() {
  const [state, setState] = useState<PlannerState>('form');
  const [loadingStep, setLoadingStep] = useState(0);
  
  // Form State
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('3');
  const [budget, setBudget] = useState('Moderate');
  const [vibe, setVibe] = useState('Adventurous');

  useEffect(() => {
    if (state === 'loading') {
      let step = 0;
      const interval = setInterval(() => {
        step += 1;
        if (step < LOADING_STEPS.length) {
          setLoadingStep(step);
        } else {
          clearInterval(interval);
          setTimeout(() => setState('results'), 800);
        }
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    setState('loading');
    setLoadingStep(0);
  };

  const handleReset = () => {
    setState('form');
    setDestination('');
    setDays('3');
    setBudget('Moderate');
    setVibe('Adventurous');
  };

  const MOCK_ITINERARY = Array.from({ length: parseInt(days) || 3 }, (_, i) => ({
    day: i + 1,
    title: i === 0 ? 'Arrival & City Introduction' : i === 1 ? 'Adventure & Exploration' : 'Relaxation & Departure',
    activities: [
      {
        time: '09:00 AM',
        title: 'Boutique Hotel Check-in',
        description: 'Drop your bags at this eco-friendly boutique stay.',
        reasoning: `Chosen because it fits your '${vibe}' preference and is 15% below average ${budget} budget.`
      },
      {
        time: '11:30 AM',
        title: 'Local Guided Tour',
        description: 'A 2-hour walking tour of the historic district.',
        reasoning: 'Highly rated by similar travelers interested in authentic experiences.'
      },
      {
        time: '02:00 PM',
        title: 'Lunch at Seaside Cafe',
        description: 'Fresh seafood with an ocean view.',
        reasoning: 'Perfectly matches your vibe, with a verified 4.8 star rating.'
      }
    ]
  }));

  return (
    <div className="min-h-screen bg-background pb-24">
      <Breadcrumbs />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-inner">
            <TbWand size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">AI Trip Planner</h1>
          <p className="text-muted max-w-xl mx-auto">Tell us what you want, and our AI will generate a personalized day-by-day itinerary in seconds.</p>
        </div>

        <AnimatePresence mode="wait">
          {/* FORM STATE */}
          {state === 'form' && (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="bg-card rounded-3xl border border-border p-6 sm:p-10 shadow-2xl"
            >
              <div className="space-y-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-3"><TbMapPin className="text-accent" /> Destination</label>
                  <input 
                    type="text" 
                    value={destination} 
                    onChange={e => setDestination(e.target.value)} 
                    placeholder="e.g. Bali, Paris, Tokyo or 'Anywhere'"
                    required
                    className="w-full px-5 py-4 rounded-2xl border border-border bg-background focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent tap-target" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold mb-3"><TbCalendar className="text-accent" /> How many days?</label>
                    <select 
                      value={days} 
                      onChange={e => setDays(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-border bg-background focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent tap-target"
                    >
                      {[1,2,3,4,5,6,7,10,14].map(d => <option key={d} value={d}>{d} Days</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold mb-3"><TbCoin className="text-accent" /> Budget Level</label>
                    <select 
                      value={budget} 
                      onChange={e => setBudget(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-border bg-background focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent tap-target"
                    >
                      {['Budget', 'Moderate', 'Luxury'].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-3"><TbMoodSmile className="text-accent" /> Travel Vibe</label>
                  <div className="flex flex-wrap gap-3">
                    {VIBES.map(v => (
                      <button 
                        key={v} 
                        type="button"
                        onClick={() => setVibe(v)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all tap-target border ${
                          vibe === v ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'bg-surface-hover border-border hover:border-muted text-foreground'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <button 
                  type="submit"
                  disabled={!destination.trim()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-teal text-white font-bold text-lg hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:transform-none tap-target flex items-center justify-center gap-2"
                >
                  Generate My Itinerary <TbWand size={20} />
                </button>
              </div>
            </motion.form>
          )}

          {/* LOADING STATE */}
          {state === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-3xl border border-border p-10 sm:p-16 shadow-2xl text-center"
            >
              <div className="relative h-24 w-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-surface-hover" />
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-teal"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <TbWand size={32} className="absolute inset-0 m-auto text-primary animate-pulse" />
              </div>
              
              <h2 className="text-2xl font-bold mb-6">AI is thinking...</h2>
              
              <div className="h-6 overflow-hidden max-w-sm mx-auto relative">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStep}
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-muted font-medium absolute inset-0 w-full"
                  >
                    {LOADING_STEPS[loadingStep]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Skeleton Preview */}
              <div className="mt-12 opacity-30 pointer-events-none">
                <div className="h-6 w-1/3 bg-surface-hover rounded mx-auto mb-8 animate-pulse" />
                <div className="space-y-4 max-w-md mx-auto text-left">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-4">
                      <div className="h-10 w-10 bg-surface-hover rounded-full flex-shrink-0 animate-pulse" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 w-3/4 bg-surface-hover rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-surface-hover rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS STATE */}
          {state === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <button onClick={handleReset} className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground transition-colors">
                  <TbChevronLeft size={16} /> Edit Preferences
                </button>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover border border-border text-sm font-semibold transition-colors">
                    <TbShare size={16} /> Share
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white border border-accent/20 text-sm font-bold transition-colors">
                    <TbDownload size={16} /> Save as PDF
                  </button>
                </div>
              </div>

              <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-2xl">
                <div className="p-8 sm:p-10 bg-gradient-to-br from-primary/10 to-teal/10 border-b border-border">
                  <div className="inline-flex px-3 py-1 rounded-full bg-background border border-border text-xs font-bold uppercase tracking-wider mb-4 text-accent">
                    {vibe} • {budget} • {days} Days
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2">Your AI Itinerary for {destination}</h2>
                  <p className="text-muted font-medium">Curated specifically based on your unique preferences.</p>
                </div>

                <div className="p-6 sm:p-10 space-y-12 bg-background">
                  {MOCK_ITINERARY.map(day => (
                    <div key={day.day}>
                      <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent text-white text-sm">D{day.day}</span>
                        {day.title}
                      </h3>
                      
                      <div className="space-y-6 pl-4 sm:pl-11 border-l-2 border-border/50 ml-4 sm:ml-0">
                        {day.activities.map((act, idx) => (
                          <div key={idx} className="relative group">
                            {/* Timeline Dot */}
                            <div className="absolute -left-[21px] sm:-left-[49px] top-1.5 h-3 w-3 rounded-full bg-border group-hover:bg-accent transition-colors" />
                            
                            <div className="bg-surface rounded-2xl border border-border p-5 hover:border-accent/50 hover:shadow-md transition-all">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div>
                                  <span className="text-xs font-bold text-accent mb-1 block">{act.time}</span>
                                  <h4 className="font-bold text-lg mb-1">{act.title}</h4>
                                  <p className="text-muted text-sm">{act.description}</p>
                                </div>
                                
                                {/* AI Reasoning Badge */}
                                <div className="group/badge relative flex-shrink-0">
                                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold cursor-help">
                                    <TbWand size={14} /> AI Pick
                                  </div>
                                  
                                  {/* Tooltip */}
                                  <div className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 w-64 p-3 rounded-xl bg-foreground text-background text-xs font-medium opacity-0 invisible group-hover/badge:opacity-100 group-hover/badge:visible transition-all shadow-xl z-10 pointer-events-none">
                                    <div className="flex items-start gap-2">
                                      <TbInfoCircle size={16} className="text-accent flex-shrink-0 mt-0.5" />
                                      {act.reasoning}
                                    </div>
                                    <div className="absolute -bottom-1 right-6 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-foreground rotate-45" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
