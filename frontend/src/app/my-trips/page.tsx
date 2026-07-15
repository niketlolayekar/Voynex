'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TbTicket, TbHeart, TbCoin, TbMapPin, TbCalendar, TbUsers, TbSettings, TbBell, TbArrowRight, TbClock, TbStarFilled } from 'react-icons/tb';
import { mockTrips, type Trip } from '@/lib/mockData';
import Breadcrumbs from '@/components/Breadcrumbs';

type Tab = 'bookings' | 'saved' | 'credits';

export default function MyTripsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [priceAlerts, setPriceAlerts] = useState(false);

  // Mock booking data
  const upcomingBooking = {
    trip: mockTrips[0],
    id: 'VNX8Y3H21',
    date: 'Oct 15 - Oct 22, 2026',
    guests: '2 Adults',
    status: 'Confirmed'
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('voynex_saved_trips');
      if (saved) {
        const ids = JSON.parse(saved) as string[];
        setSavedTrips(mockTrips.filter(t => ids.includes(t._id)));
      }
    } catch (e) {}
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Breadcrumbs />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              {[
                { id: 'bookings', label: 'My Bookings', icon: TbTicket },
                { id: 'saved', label: 'Saved Trips', icon: TbHeart },
                { id: 'credits', label: 'Travel Credits', icon: TbCoin },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-accent/10 text-accent' 
                      : 'text-muted hover:bg-surface-hover hover:text-foreground'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                  {tab.id === 'saved' && savedTrips.length > 0 && (
                    <span className={`ml-auto px-2 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-accent text-white' : 'bg-surface border border-border text-foreground'}`}>
                      {savedTrips.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 min-w-0">
            
            {activeTab === 'bookings' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Upcoming Trips</h2>
                  
                  <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm flex flex-col md:flex-row group">
                    <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden img-dark-overlay">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600" />
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/90 backdrop-blur text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                        {upcomingBooking.status}
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Booking #{upcomingBooking.id}</p>
                          <h3 className="text-2xl font-bold">{upcomingBooking.trip.title}</h3>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                          <p className="text-sm text-muted font-medium flex items-center gap-1.5 mb-1"><TbMapPin size={16} /> Destination</p>
                          <p className="font-bold">{upcomingBooking.trip.destination}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted font-medium flex items-center gap-1.5 mb-1"><TbCalendar size={16} /> Dates</p>
                          <p className="font-bold">{upcomingBooking.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted font-medium flex items-center gap-1.5 mb-1"><TbUsers size={16} /> Guests</p>
                          <p className="font-bold">{upcomingBooking.guests}</p>
                        </div>
                      </div>
                      
                      <div className="mt-auto flex gap-3 border-t border-border pt-6">
                        <button className="px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-sm hover:shadow-lg hover:shadow-accent/30 transition-all tap-target flex items-center gap-2">
                          <TbSettings size={18} /> Manage Booking
                        </button>
                        <Link href={`/packing`} className="px-6 py-2.5 rounded-xl bg-surface border border-border font-bold text-sm hover:bg-surface-hover transition-all tap-target flex items-center gap-2">
                          Pack for this trip <TbArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-6">Past Bookings</h2>
                  <div className="text-center py-16 rounded-3xl border border-border border-dashed bg-surface/50">
                    <div className="mx-auto w-16 h-16 bg-surface border border-border rounded-full flex items-center justify-center text-muted mb-4">
                      <TbTicket size={32} />
                    </div>
                    <p className="font-bold text-lg mb-1">No past trips yet</p>
                    <p className="text-muted mb-6">Your past adventures will appear here once completed.</p>
                    <Link href="/trips" className="px-6 py-3 rounded-xl bg-accent/10 text-accent font-bold hover:bg-accent hover:text-white transition-colors">
                      Explore Destinations
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'saved' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold">Saved Trips</h2>
                    <p className="text-muted mt-1">Trips you&apos;ve added to your wishlist.</p>
                  </div>
                  
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-accent/5 border border-accent/20 cursor-pointer tap-target">
                    <TbBell size={20} className="text-accent" />
                    <div>
                      <p className="text-sm font-bold text-accent">AI Price Drop Alerts</p>
                      <p className="text-xs text-muted">Notify me when prices drop</p>
                    </div>
                    <div className="ml-4 relative">
                      <input type="checkbox" className="sr-only" checked={priceAlerts} onChange={() => setPriceAlerts(!priceAlerts)} />
                      <div className={`w-10 h-6 rounded-full transition-colors ${priceAlerts ? 'bg-accent' : 'bg-border'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${priceAlerts ? 'left-5' : 'left-1'}`} />
                      </div>
                    </div>
                  </label>
                </div>

                {savedTrips.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {savedTrips.map((trip, idx) => (
                      <div key={trip._id} className="relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                        <button 
                          onClick={() => setSavedTrips(prev => {
                            const updated = prev.filter(t => t._id !== trip._id);
                            localStorage.setItem('voynex_saved_trips', JSON.stringify(updated.map(u => u._id)));
                            return updated;
                          })}
                          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 backdrop-blur border border-white/20 text-accent hover:bg-black/60 transition-all tap-target"
                        >
                          <TbHeart size={18} className="fill-accent" />
                        </button>

                        <div className="relative aspect-video overflow-hidden img-dark-overlay">
                          <div className={`absolute inset-0 bg-gradient-to-br ${['from-blue-400 to-purple-600', 'from-orange-400 to-pink-500', 'from-teal-400 to-emerald-600', 'from-rose-400 to-red-500'][idx % 4]}`} />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-500" />
                          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10 text-white text-xs font-bold flex items-center gap-1">
                            <TbMapPin size={12} className="text-accent" /> {trip.destination}
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-accent transition-colors">{trip.title}</h3>
                          
                          <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center gap-1 text-xs font-bold text-muted"><TbClock size={14} /> {trip.duration}d</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-muted"><TbStarFilled size={14} className="text-yellow-500" /> {trip.rating}</span>
                          </div>

                          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-lg font-bold text-accent">₹{trip.price.toLocaleString()}</span>
                            <Link href={`/trips/${trip._id}`} className="px-4 py-2 rounded-lg bg-surface border border-border text-sm font-bold hover:bg-surface-hover hover:border-accent transition-all">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 rounded-3xl border border-border border-dashed bg-surface/50">
                    <TbHeart size={48} className="mx-auto text-muted mb-4 opacity-50" />
                    <p className="font-bold text-lg mb-1">Your wishlist is empty</p>
                    <p className="text-muted mb-6">Save trips you like to keep track of them here.</p>
                    <Link href="/trips" className="px-6 py-3 rounded-xl bg-accent text-white font-bold hover:shadow-lg hover:shadow-accent/30 transition-all">
                      Browse Trips
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'credits' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="text-3xl font-bold mb-6">Travel Credits</h2>
                
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-teal text-white shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-white/80 font-bold uppercase tracking-wider mb-2">Available Balance</p>
                      <p className="text-5xl font-bold font-mono">₹5,000</p>
                    </div>
                    <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-primary font-bold hover:shadow-lg transition-all tap-target">
                      Redeem Credits
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                  <h3 className="font-bold text-lg mb-6">Credit History</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Welcome Bonus', date: 'Oct 1, 2026', amount: '+₹2,500', isPositive: true },
                      { title: 'Referral Reward (Jane Doe)', date: 'Oct 5, 2026', amount: '+₹2,500', isPositive: true },
                    ].map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface hover:border-border-hover transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${h.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            <TbCoin size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{h.title}</p>
                            <p className="text-xs text-muted">{h.date}</p>
                          </div>
                        </div>
                        <span className={`font-bold ${h.isPositive ? 'text-green-500' : 'text-red-500'}`}>{h.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
