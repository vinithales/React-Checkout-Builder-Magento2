import React from 'react';
import { useEditor } from '@craftjs/core';

export function Toolbar() {
  const { query } = useEditor();

  const handleSave = () => {
    try {
      const json = query.serialize();
      localStorage.setItem('hyva-checkout-builder-layout', json);
      alert(
        'Layout saved successfully! Open the checkout page to view your layout.'
      );
    } catch (e) {
      console.error(e);
      alert(`Failed to save layout: ${e.message}`);
    }
  };

  const handleReset = () => {
    if (
      window.confirm('Are you sure you want to reset the layout to default?')
    ) {
      localStorage.removeItem('hyva-checkout-builder-layout');
      window.location.reload();
    }
  };

  const handlePreview = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('edit');
    url.searchParams.delete('editor');
    if (url.pathname.includes('checkoutbuilder')) {
      url.pathname = url.pathname.replace('checkoutbuilder', 'checkout');
    }
    window.open(url.toString(), '_blank');
  };

  return (
    <header className="toolbar flex items-center justify-between gap-4 px-6 py-4 bg-slate-900 border-b border-slate-800 text-slate-100">
      <div>
        <div className="text-xs uppercase tracking-[0.32em] text-slate-500">
          Editor
        </div>
        <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Checkout Builder
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handlePreview}
          className="rounded-full border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-700 active:translate-y-[1px]"
        >
          Preview Checkout
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-red-900/60 hover:bg-red-950/20 active:translate-y-[1px]"
        >
          Reset to Default
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-sm font-semibold transition shadow-md active:translate-y-[1px]"
        >
          Save Layout
        </button>
      </div>
    </header>
  );
}
