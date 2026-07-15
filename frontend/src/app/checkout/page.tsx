'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TbCheck, TbCreditCard, TbLock, TbBuildingBank, TbChevronLeft } from 'react-icons/tb';
import { mockTrips } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';

type CheckoutStep = 1 | 2 | 3;

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const tripId = searchParams.get('tripId');
  const date = searchParams.get('date');
  const adults = parseInt(searchParams.get('adults') || '2');
  const children = parseInt(searchParams.get('children') || '0');
  const seniors = parseInt(searchParams.get('seniors') || '0');
  
  const trip = mockTrips.find(t => t._id === tripId);
  const [step, setStep] = useState<CheckoutStep>(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // In a real flow, the AuthModal would have been handled first.
    }
  }, [isAuthenticated, router]);

  if (!trip) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-bold">Invalid Booking Request</p>
        <button onClick={() => router.push('/trips')} className="mt-4 text-accent hover:underline">Return to Trips</button>
      </div>
    </div>
  );

  const totalGuests = adults + children + seniors;
  const subtotal = trip.price * totalGuests;
  const taxes = subtotal * 0.18; // 18% GST approx
  const total = subtotal + taxes;

  const renderProgress = () => (
    <div className="mb-10">
      <div className="flex items-center justify-between relative max-w-lg mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-hover -z-10 -translate-y-1/2 rounded-full" />
        <div className="absolute top-1/2 left-0 h-1 bg-accent -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />
        
        {[
          { num: 1, label: 'Review' },
          { num: 2, label: 'Details' },
          { num: 3, label: 'Payment' }
        ].map(s => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-background px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= s.num ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-surface border-2 border-border text-muted'
            }`}>
              {step > s.num ? <TbCheck size={16} /> : s.num}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-foreground' : 'text-muted'}`}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24 pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => step > 1 ? setStep((step - 1) as CheckoutStep) : router.back()} className="flex items-center gap-2 text-sm font-bold text-muted hover:text-foreground mb-8 tap-target">
          <TbChevronLeft size={16} /> {step === 1 ? 'Back to Trip' : 'Previous Step'}
        </button>

        {renderProgress()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: REVIEW */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Review your booking</h2>
                  
                  <div className="p-6 rounded-2xl border border-border bg-card">
                    <h3 className="font-bold text-lg mb-4 text-accent">Trip Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-muted uppercase">Destination</p>
                        <p className="font-medium mt-1">{trip.title}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted uppercase">Dates</p>
                        <p className="font-medium mt-1">{date ? new Date(date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Flexible'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted uppercase">Duration</p>
                        <p className="font-medium mt-1">{trip.duration} Days</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted uppercase">Guests</p>
                        <p className="font-medium mt-1">{totalGuests} ({adults} Adults{children > 0 ? `, ${children} Children` : ''})</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-border bg-surface-hover">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <TbCheck className="text-green-500" /> Free cancellation before {date ? new Date(new Date(date).getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString() : 'departure'}
                    </p>
                  </div>

                  <button onClick={() => setStep(2)} className="w-full py-4 rounded-xl bg-accent text-white font-bold text-lg hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 transition-all tap-target">
                    Continue to Details
                  </button>
                </motion.div>
              )}

              {/* STEP 2: DETAILS */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Traveler Details</h2>
                  
                  <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">First Name *</label>
                        <input type="text" defaultValue="John" required className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Last Name *</label>
                        <input type="text" defaultValue="Doe" required className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Email Address *</label>
                        <input type="email" defaultValue="user@example.com" required className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Phone Number *</label>
                        <input type="tel" defaultValue="+91 9876543210" required className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Special Requests (Optional)</label>
                      <textarea placeholder="Dietary requirements, accessibility needs..." rows={3} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent resize-none" />
                    </div>
                  </div>

                  <button onClick={() => setStep(3)} className="w-full py-4 rounded-xl bg-accent text-white font-bold text-lg hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 transition-all tap-target">
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                  
                  <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-8">
                    {/* Payment Type Toggle */}
                    <div className="grid grid-cols-2 gap-4">
                      <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-accent bg-accent/5 text-accent font-bold">
                        <TbCreditCard size={24} /> Credit/Debit Card
                      </button>
                      <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border hover:border-accent/50 hover:bg-surface-hover text-muted font-bold transition-all">
                        <TbBuildingBank size={24} /> UPI / Netbanking
                      </button>
                    </div>

                    {/* Card Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Card Number</label>
                        <div className="relative">
                          <TbCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                          <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Expiry Date</label>
                          <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">CVV</label>
                          <input type="password" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Name on Card</label>
                        <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-muted bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-green-600">
                      <TbLock size={16} /> Your payment information is secure and encrypted.
                    </div>
                  </div>

                  <button onClick={() => router.push('/booking-success')} className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-teal text-white font-bold text-lg hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 transition-all tap-target flex items-center justify-center gap-2">
                    <TbLock size={20} /> Pay ₹{total.toLocaleString()} & Confirm Booking
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-xl">
              <h3 className="font-bold text-lg mb-6 pb-4 border-b border-border">Order Summary</h3>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm leading-tight line-clamp-2 mb-1">{trip.title}</h4>
                  <p className="text-xs text-muted font-medium">{totalGuests} Guests • {trip.duration} Days</p>
                </div>
              </div>

              <div className="space-y-4 text-sm font-medium mb-6">
                <div className="flex justify-between text-muted">
                  <span>₹{trip.price.toLocaleString()} × {totalGuests} guests</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Taxes & Fees (18%)</span>
                  <span>₹{taxes.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-border pt-6 flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-accent">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
