'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiClock, FiUsers, FiCheck, FiX, FiCalendar, FiMinus, FiPlus } from 'react-icons/fi';
import { mockTrips, mockReviews } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';

const GRADIENTS = [
  'from-blue-400 to-purple-600', 'from-orange-400 to-pink-500', 'from-teal-400 to-emerald-600',
  'from-rose-400 to-red-500', 'from-indigo-400 to-blue-600', 'from-amber-400 to-orange-600',
];

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const trip = mockTrips.find(t => t._id === id);
  const reviews = mockReviews.filter(r => r.trip === id);

  const [selectedDate, setSelectedDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [seniors, setSeniors] = useState(0);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'reviews' | 'included'>('itinerary');

  if (!trip) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-xl text-muted">Trip not found</p></div>;

  const totalGuests = adults + children + seniors;
  const totalPrice = trip.price * totalGuests;
  const gradIdx = mockTrips.indexOf(trip);

  const handleBookNow = () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    const params = new URLSearchParams({
      tripId: trip._id, date: selectedDate || trip.startDates[0],
      adults: adults.toString(), children: children.toString(), seniors: seniors.toString(),
    });
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      {/* <div className={`relative h-[40vh] bg-gradient-to-br ${GRADIENTS[gradIdx % GRADIENTS.length]}`}> */}
      <div className="relative h-[40vh] overflow-hidden">
  <img
    src={trip.images[0]}
    alt={trip.title}
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-8 left-0 right-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-2 text-sm mb-2 opacity-90"><FiMapPin size={14} /> {trip.destination}</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{trip.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1"><FiStar size={14} fill="currentColor" /> {trip.rating} ({trip.reviewCount} reviews)</span>
            <span className="flex items-center gap-1"><FiClock size={14} /> {trip.duration} Days</span>
            <span className="flex items-center gap-1"><FiUsers size={14} /> Max {trip.maxGroupSize} people</span>
            <span className="capitalize px-2 py-0.5 rounded-full bg-white/20 text-xs">{trip.difficulty}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold mb-3">About This Trip</h2>
              <p className="text-muted leading-relaxed">{trip.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {trip.highlights.map(h => (
                  <span key={h} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{h}</span>
                ))}
              </div>
            </motion.div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-border mb-6">
                {(['itinerary', 'included', 'reviews'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium capitalize transition-all border-b-2 ${
                      activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'}`}>
                    {tab === 'included' ? 'Included / Excluded' : tab}
                  </button>
                ))}
              </div>

              {activeTab === 'itinerary' && (
                <div className="space-y-4">
                  {trip.itinerary.map(day => (
                    <motion.div key={day.day} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: day.day * 0.1 }}
                      className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{day.day}</div>
                        {day.day < trip.itinerary.length && <div className="w-0.5 flex-1 bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-6">
                        <h4 className="font-semibold">{day.title}</h4>
                        <p className="text-sm text-muted mt-1">{day.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {day.activities.map(a => (
                            <span key={a} className="px-2 py-0.5 rounded bg-surface-hover text-xs text-muted">{a}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'included' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-teal mb-3 flex items-center gap-2"><FiCheck /> Included</h4>
                    <ul className="space-y-2">
                      {trip.included.map(i => <li key={i} className="flex items-center gap-2 text-sm"><FiCheck size={14} className="text-teal" /> {i}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-500 mb-3 flex items-center gap-2"><FiX /> Excluded</h4>
                    <ul className="space-y-2">
                      {trip.excluded.map(i => <li key={i} className="flex items-center gap-2 text-sm"><FiX size={14} className="text-red-500" /> {i}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.length > 0 ? reviews.map(r => (
                    <div key={r._id} className="p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white text-sm font-bold">
                          {r.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{r.user.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted">
                            {Array.from({ length: 5 }, (_, i) => (
                              <FiStar key={i} size={12} className={i < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted">{r.comment}</p>
                    </div>
                  )) : <p className="text-muted text-center py-8">No reviews yet. Be the first to review!</p>}
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-lg">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-primary">₹{trip.price.toLocaleString()}</span>
                <span className="text-muted"> /person</span>
              </div>

              {/* Date Selection */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-1.5 block">Select Date</label>
                <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Choose a date</option>
                  {trip.startDates.map(d => <option key={d} value={d}>{new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</option>)}
                </select>
              </div>

              {/* Group Composition */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-medium">Group Composition</label>
                {[
                  { label: 'Adults', value: adults, set: setAdults, min: 1 },
                  { label: 'Children', value: children, set: setChildren, min: 0 },
                  { label: 'Seniors', value: seniors, set: setSeniors, min: 0 },
                ].map(g => (
                  <div key={g.label} className="flex items-center justify-between p-3 rounded-xl bg-surface-hover">
                    <span className="text-sm">{g.label}</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => g.set(Math.max(g.min, g.value - 1))} className="h-7 w-7 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"><FiMinus size={12} /></button>
                      <span className="w-6 text-center text-sm font-medium">{g.value}</span>
                      <button onClick={() => g.set(g.value + 1)} className="h-7 w-7 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"><FiPlus size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="border-t border-border pt-4 mb-6 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">₹{trip.price.toLocaleString()} × {totalGuests} guests</span><span>₹{totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between font-semibold text-base"><span>Total</span><span className="text-primary">₹{totalPrice.toLocaleString()}</span></div>
              </div>

              <button onClick={handleBookNow}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-teal text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all">
                Book Now
              </button>

              <p className="text-xs text-muted text-center mt-3">Free cancellation up to 48 hours before</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
