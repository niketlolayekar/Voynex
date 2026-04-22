'use client';
import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheck, FiMapPin, FiCalendar, FiUsers, FiCreditCard } from 'react-icons/fi';
import { mockTrips } from '@/lib/mockData';
import ProtectedRoute from '@/components/ProtectedRoute';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripId = searchParams.get('tripId');
  const trip = mockTrips.find(t => t._id === tripId);
  const date = searchParams.get('date') || '';
  const adults = parseInt(searchParams.get('adults') || '2');
  const children = parseInt(searchParams.get('children') || '0');
  const seniors = parseInt(searchParams.get('seniors') || '0');
  const totalGuests = adults + children + seniors;
  const totalPrice = trip ? trip.price * totalGuests : 0;

  const [step, setStep] = useState<'summary' | 'payment' | 'confirmed'>('summary');
  const [processing, setProcessing] = useState(false);

  if (!trip) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted">Invalid booking</p></div>;

  const handlePayment = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setStep('confirmed');
    setProcessing(false);
  };

  const steps = [
    { id: 'summary', label: 'Summary' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirmed', label: 'Confirmed' },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold mb-8">Book Your Trip</h1>

        {/* Progress */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  steps.findIndex(x => x.id === step) >= i ? 'bg-primary text-white' : 'bg-surface-hover text-muted'}`}>
                  {steps.findIndex(x => x.id === step) > i ? <FiCheck /> : i + 1}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-12 sm:w-24 h-0.5 mx-2 ${steps.findIndex(x => x.id === step) > i ? 'bg-primary' : 'bg-border'}`} />}
            </React.Fragment>
          ))}
        </div>

        {step === 'summary' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-semibold text-lg mb-4">Booking Summary</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><FiMapPin className="text-primary" /><div><p className="text-sm text-muted">Trip</p><p className="font-medium">{trip.title}</p></div></div>
                <div className="flex items-center gap-3"><FiCalendar className="text-teal" /><div><p className="text-sm text-muted">Date</p><p className="font-medium">{date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Flexible'}</p></div></div>
                <div className="flex items-center gap-3"><FiUsers className="text-orange" /><div><p className="text-sm text-muted">Guests</p><p className="font-medium">{adults} Adults, {children} Children, {seniors} Seniors</p></div></div>
              </div>
              <div className="border-t border-border mt-6 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">₹{trip.price.toLocaleString()} × {totalGuests} guests</span><span>₹{totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted">Taxes & fees</span><span>₹{Math.round(totalPrice * 0.05).toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border"><span>Total</span><span className="text-primary">₹{Math.round(totalPrice * 1.05).toLocaleString()}</span></div>
              </div>
            </div>
            <button onClick={() => setStep('payment')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-teal text-white font-semibold hover:shadow-lg transition-all">
              Proceed to Payment
            </button>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><FiCreditCard /> Payment</h2>
              <div className="space-y-4">
                <div><label className="text-sm font-medium mb-1.5 block">Card Number</label><input placeholder="4242 4242 4242 4242" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium mb-1.5 block">Expiry</label><input placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                  <div><label className="text-sm font-medium mb-1.5 block">CVV</label><input placeholder="123" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                </div>
              </div>
              <p className="text-xs text-muted mt-4 flex items-center gap-1"><FiCheck className="text-teal" /> Secured by Razorpay. Your data is encrypted.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('summary')} className="flex-1 py-3.5 rounded-xl border border-border font-medium hover:bg-surface-hover transition-all">Back</button>
              <button onClick={handlePayment} disabled={processing}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary to-teal text-white font-semibold hover:shadow-lg disabled:opacity-50 transition-all">
                {processing ? 'Processing...' : `Pay ₹${Math.round(totalPrice * 1.05).toLocaleString()}`}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'confirmed' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="rounded-2xl border border-border bg-card p-12">
              <div className="h-20 w-20 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto mb-6"><FiCheck size={40} /></div>
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed! 🎉</h2>
              <p className="text-muted mb-6">Your trip to {trip.destination} has been booked successfully.</p>
              <div className="inline-block px-6 py-3 rounded-xl bg-surface-hover text-sm mb-6">
                {/* eslint-disable-next-line react-hooks/purity */}
                Booking ID: <span className="font-mono font-bold">VOY-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => router.push('/dashboard')} className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-all">Go to Dashboard</button>
                <button onClick={() => router.push('/trips')} className="px-6 py-3 rounded-xl border border-border font-medium hover:bg-surface-hover transition-all">Browse More Trips</button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
        <BookingContent />
      </Suspense>
    </ProtectedRoute>
  );
}
