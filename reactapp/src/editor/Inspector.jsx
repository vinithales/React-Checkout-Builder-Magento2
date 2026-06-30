import React from 'react';

export function Inspector() {
  return (
    <aside className="inspector z-10 w-80 flex-shrink-0 border-l border-slate-700 bg-slate-950 px-5 py-6 text-slate-200">
      <div className="mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
          Inspector
        </h2>
      </div>
      <div className="space-y-5">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Selected block</div>
          <div className="mt-3 text-sm font-medium text-slate-100">CraftableContainer</div>
          <div className="mt-2 text-sm text-slate-400">A flexible wrapper for checkout sections.</div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Settings</div>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between rounded-2xl bg-slate-950/80 px-3 py-2">
              <span>Show labels</span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">On</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-950/80 px-3 py-2">
              <span>Enable drag</span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Yes</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
