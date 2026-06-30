import React from 'react';

export function Toolbar() {
  return (
    <header className="toolbar flex items-center justify-between gap-4 px-6 py-4 bg-slate-900 border-b border-slate-700 text-slate-100">
      <div>
        <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Editor</div>
        <h1 className="text-xl font-semibold">Checkout Builder</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-700">
          Preview
        </button>
        <button className="rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-700">
          Save
        </button>
      </div>
    </header>
  );
}
