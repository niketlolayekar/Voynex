'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiMapPin, FiDollarSign, FiClock, FiUsers, FiStar, FiCheck } from 'react-icons/fi';
import { AITripPlan, GroupComposition } from '@/types';

const INTERESTS = ['adventure', 'nature', 'beach', 'culture', 'photography', 'wellness', 'nightlife', 'food', 'shopping', 'wildlife'];

function generateAIPlan(dest: string, budget: number, duration: number, group: GroupComposition, interests: string[]): AITripPlan {
  const hasKids = group.children > 0;
  const hasSeniors = group.seniors > 0;

  const days = Array.from({ length: duration }, (_, i) => {
    const activities: string[] = [];
    if (hasKids) activities.push(i === 0 ? 'Visit kid-friendly park or zoo' : 'Interactive museum or water park');
    if (hasSeniors) activities.push('Leisurely cultural walk with rest breaks');
    if (interests.includes('adventure') && !hasSeniors) activities.push('Adventure activity (trekking/rafting)');
    if (interests.includes('culture')) activities.push('Local temple or heritage site visit');
    if (interests.includes('food')) activities.push('Local cuisine food tour');
    if (interests.includes('photography')) activities.push('Scenic viewpoint for photography');
    if (interests.includes('beach')) activities.push('Beach relaxation & water activities');
    if (interests.includes('nature')) activities.push('Nature walk or garden visit');
    if (activities.length === 0) activities.push('Explore local attractions', 'Free time for personal activities');

    return {
      day: i + 1,
      title: i === 0 ? `Arrival in ${dest}` : i === duration - 1 ? 'Departure Day' : `Day ${i + 1} - ${interests[i % interests.length] || 'Exploration'}`,
      description: i === 0 ? `Arrive and settle in. ${hasSeniors ? 'Take it easy with a comfortable check-in.' : 'Light exploration of nearby areas.'}` :
        i === duration - 1 ? 'Last day shopping, packing, and departure.' :
        `Full day of activities tailored for your group${hasKids ? ' with kid-friendly options' : ''}${hasSeniors ? ' and senior-accessible venues' : ''}.`,
      activities: activities.slice(0, 4),
    };
  });

  const tips: string[] = [
    `Best time to visit ${dest}: October to March`,
    budget < 15000 ? 'Stay in hostels or budget homestays to save money' : 'Consider boutique hotels for a premium experience',
    hasKids ? 'Pack snacks, games, and a first-aid kit for children' : '',
    hasSeniors ? 'Ensure accommodations have elevator access and are close to medical facilities' : '',
    'Always carry a copy of your ID and travel insurance documents',
    'Download offline maps before your trip',
  ].filter(Boolean);

  return {
    destination: dest, duration, budget, groupComposition: group, interests,
    itinerary: days, estimatedCost: budget * (group.adults + group.children * 0.7 + group.seniors * 0.9),
    tips,
    accommodationSuggestions: [
      hasKids ? 'Family suites with connecting rooms' : hasSeniors ? 'Ground-floor accessible rooms' : 'Standard double rooms',
      budget > 20000 ? 'Premium resorts with amenities' : 'Clean budget hotels with good reviews',
    ],
  };
}

export default function AIPlannerPage() {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState(15000);
  const [duration, setDuration] = useState(5);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [seniors, setSeniors] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [plan, setPlan] = useState<AITripPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (i: string) => setSelectedInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const generatePlan = async () => {
    if (!destination) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    const result = generateAIPlan(destination, budget, duration, { adults, children, seniors }, selectedInterests);
    setPlan(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <FiCpu size={14} /> Powered by AI
          </div>
          <h1 className="text-4xl font-bold">AI Trip Planner</h1>
          <p className="text-muted mt-2 max-w-xl mx-auto">Tell us about your dream trip and we&apos;ll create a personalized itinerary tailored for your group.</p>
        </div>

        {!plan ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-1.5 block flex items-center gap-1"><FiMapPin size={14} /> Destination</label>
                <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g., Manali, Goa, Rajasthan"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-1"><FiDollarSign size={14} /> Budget (₹/person)</label>
                  <input type="number" value={budget} onChange={e => setBudget(+e.target.value)} min={5000} step={1000}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-1"><FiClock size={14} /> Duration (days)</label>
                  <input type="number" value={duration} onChange={e => setDuration(+e.target.value)} min={1} max={30}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1"><FiUsers size={14} /> Group Composition</label>
                <div className="grid grid-cols-3 gap-3">
                  {[{ l: 'Adults', v: adults, s: setAdults }, { l: 'Children', v: children, s: setChildren }, { l: 'Seniors', v: seniors, s: setSeniors }].map(g => (
                    <div key={g.l} className="text-center p-3 rounded-xl bg-surface-hover">
                      <p className="text-xs text-muted mb-2">{g.l}</p>
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => g.s(Math.max(g.l === 'Adults' ? 1 : 0, g.v - 1))} className="h-7 w-7 rounded-full border border-border flex items-center justify-center text-xs hover:bg-primary hover:text-white transition-all">−</button>
                        <span className="w-6 text-center font-medium">{g.v}</span>
                        <button onClick={() => g.s(g.v + 1)} className="h-7 w-7 rounded-full border border-border flex items-center justify-center text-xs hover:bg-primary hover:text-white transition-all">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                {(children > 0 || seniors > 0) && (
                  <p className="text-xs text-teal mt-2 flex items-center gap-1"><FiCheck size={12} /> AI will tailor the itinerary for all age groups</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1"><FiStar size={14} /> Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(i => (
                    <button key={i} onClick={() => toggleInterest(i)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                        selectedInterests.includes(i) ? 'bg-primary text-white' : 'bg-surface-hover text-muted hover:text-foreground'}`}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={generatePlan} disabled={loading || !destination}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-teal text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all">
                {loading ? (
                  <><div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Generating...</>
                ) : (
                  <><FiCpu size={18} /> Generate Itinerary</>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your AI-Generated Itinerary</h2>
              <button onClick={() => setPlan(null)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-surface-hover transition-all">
                Create New Plan
              </button>
            </div>

            {/* Summary Card */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div><p className="text-sm text-muted">Destination</p><p className="font-semibold text-primary">{plan.destination}</p></div>
                <div><p className="text-sm text-muted">Duration</p><p className="font-semibold">{plan.duration} Days</p></div>
                <div><p className="text-sm text-muted">Group</p><p className="font-semibold">{plan.groupComposition.adults + plan.groupComposition.children + plan.groupComposition.seniors} People</p></div>
                <div><p className="text-sm text-muted">Est. Cost</p><p className="font-semibold text-primary">₹{Math.round(plan.estimatedCost).toLocaleString()}</p></div>
              </div>
            </div>

            {/* Itinerary */}
            <div className="space-y-4">
              {plan.itinerary.map(day => (
                <div key={day.day} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{day.day}</div>
                    {day.day < plan.itinerary.length && <div className="w-0.5 flex-1 bg-border mt-2" />}
                  </div>
                  <div className="flex-1 pb-6 rounded-xl border border-border bg-card p-4">
                    <h4 className="font-semibold">{day.title}</h4>
                    <p className="text-sm text-muted mt-1">{day.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {day.activities.map(a => (
                        <span key={a} className="px-2 py-0.5 rounded bg-surface-hover text-xs text-muted">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg mb-4">💡 Travel Tips</h3>
              <ul className="space-y-2">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted"><FiCheck className="text-teal mt-0.5 flex-shrink-0" /> {tip}</li>
                ))}
              </ul>
            </div>

            {/* Accommodation */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg mb-4">🏨 Accommodation Suggestions</h3>
              <ul className="space-y-2">
                {plan.accommodationSuggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted"><FiCheck className="text-primary mt-0.5 flex-shrink-0" /> {s}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
