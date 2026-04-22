'use client';
import React from 'react';
import { FiMap, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { mockTrips } from '@/lib/mockData';

export default function AgencyTripsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Trips</h1>
          <p className="text-sm text-muted">Manage your listed experiences</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90"><FiPlus/> Add Trip</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTrips.map(t => (
          <div key={t._id} className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all">
            {t.images && t.images[0] ? <img src={t.images[0]} className="w-full h-40 object-cover" /> : <div className="w-full h-40 bg-surface-hover" />}
            <div className="p-5">
              <h3 className="font-bold truncate">{t.title}</h3>
              <p className="text-xs text-muted mb-4">{t.destination} • {t.duration} days</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">₹{t.price}</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-surface-hover rounded-lg hover:text-primary"><FiEdit size={14}/></button>
                  <button className="p-2 bg-surface-hover rounded-lg hover:text-red-500"><FiTrash2 size={14}/></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}