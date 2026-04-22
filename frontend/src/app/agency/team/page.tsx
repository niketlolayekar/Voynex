'use client';
import React from 'react';
import { FiUsers, FiUserPlus } from 'react-icons/fi';

export default function AgencyTeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-sm text-muted">Manage agency staff access</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90"><FiUserPlus/> Add Member</button>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-hover/50 border-b border-border">
            <tr><th className="p-4 font-medium text-muted">Name</th><th className="p-4 font-medium text-muted">Role</th><th className="p-4 font-medium text-muted">Status</th></tr>
          </thead>
          <tbody>
            {['Rajesh Kumar', 'Priya Sharma', 'Amit Singh'].map((name, i) => (
              <tr key={i} className="border-b border-border hover:bg-surface-hover/30">
                <td className="p-4 font-medium">{name}</td>
                <td className="p-4 text-muted capitalize">{i===0?'Admin':'Staff'}</td>
                <td className="p-4"><span className="px-2 py-1 rounded-full bg-teal/10 text-teal text-[10px] font-bold uppercase">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}