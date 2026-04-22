'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2 } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [{ month: 'Jan', rev: 4000 }, { month: 'Feb', rev: 3000 }, { month: 'Mar', rev: 2000 }, { month: 'Apr', rev: 2780 }, { month: 'May', rev: 1890 }, { month: 'Jun', rev: 2390 }, { month: 'Jul', rev: 3490 }];

export default function AgencyAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Revenue Analytics</h1>
        <p className="text-sm text-muted">Track your agency earnings</p>
      </div>
      <div className="h-[400px] w-full bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-6">Revenue Growth</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--brd)" />
            <XAxis dataKey="month" stroke="var(--mut)" />
            <YAxis stroke="var(--mut)" />
            <Tooltip />
            <Area type="monotone" dataKey="rev" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}