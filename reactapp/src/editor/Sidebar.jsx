import React from 'react';

export function Sidebar() {
  return (
    <aside className="sidebar z-10 w-72 flex-shrink-0 border-r border-slate-700 bg-slate-950 px-4 py-5 text-slate-200">
      <div className="mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
          Component Tree
        </h2>
      </div>
      <div className="space-y-3 text-sm leading-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Root</div>
          <div className="mt-2 text-slate-100">CraftableContainer</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Section</div>
          <div className="mt-2 text-slate-100">CraftableAddressWrapper</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Widgets</div>
          <ul className="mt-2 space-y-1 text-slate-300">
            <li>Shipping Address</li>
            <li>Billing Address</li>
            <li>Payment Method</li>
            <li>Totals + Sidebar</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
