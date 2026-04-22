'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch, FiEdit, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-sm text-muted">Manage all registered travelers</p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 rounded-xl border border-border bg-card text-sm focus:ring-2 focus:ring-primary/50 outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-hover/50 border-b border-border">
            <tr><th className="p-4 font-medium text-muted">Name</th><th className="p-4 font-medium text-muted">Email</th><th className="p-4 font-medium text-muted">Joined</th><th className="p-4 font-medium text-muted">Status</th><th className="p-4 font-medium text-muted text-right">Actions</th></tr>
          </thead>
          <tbody>
            {[1,2,3,4,5].map(i => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-surface-hover/30">
                <td className="p-4 font-medium">User {i}</td><td className="p-4 text-muted">user{i}@example.com</td><td className="p-4 text-muted">Oct 2025</td>
                <td className="p-4"><span className="px-2 py-1 rounded-full bg-teal/10 text-teal text-[10px] font-bold uppercase">Active</span></td>
                <td className="p-4 flex gap-2 justify-end">
                  <button className="p-1.5 text-muted hover:text-primary"><FiEdit size={16}/></button>
                  <button className="p-1.5 text-muted hover:text-orange"><FiUserX size={16}/></button>
                  <button className="p-1.5 text-muted hover:text-red-500"><FiTrash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}