'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiTrash2 } from 'react-icons/fi';
import { mockReviews } from '@/lib/mockData';

export default function AgencyReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reviews Moderation</h1>
          <p className="text-sm text-muted">Monitor and moderate user feedback</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockReviews.map(r => (
          <div key={r._id} className="p-5 rounded-2xl border border-border bg-card hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold">{r.user.name}</p>
                <div className="flex text-yellow-500 text-xs mt-1">
                  {[...Array(5)].map((_, i) => <FiStar key={i} fill={i < r.rating ? 'currentColor' : 'none'} />)}
                </div>
              </div>
              <button className="p-1.5 text-muted hover:text-red-500 rounded-lg hover:bg-red-500/10"><FiTrash2 size={16}/></button>
            </div>
            <p className="text-sm text-muted italic">"{r.comment}"</p>
            <p className="text-[10px] text-muted mt-3 text-right">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}