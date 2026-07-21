import React from 'react';
import { useEditor } from '@craftjs/core';

export function Inspector() {
  const { selected, actions } = useEditor((state) => {
    const [selectedId] = state.events.selected;
    if (selectedId) {
      const node = state.nodes[selectedId];
      return {
        selected: {
          id: selectedId,
          name: node.data.displayName || node.data.name,
          isDeletable: node.data.isDeletable !== false && selectedId !== 'ROOT',
        },
      };
    }
    return {};
  });

  return (
    <aside className="inspector z-10 w-80 flex-shrink-0 border-l border-slate-800 bg-slate-950 px-5 py-6 text-slate-200">
      <div className="mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
          Inspector
        </h2>
        <p className="text-xs text-slate-500 mt-1">Configure selected block</p>
      </div>
      <div className="space-y-5">
        {selected ? (
          <>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Selected block
              </div>
              <div className="mt-3 text-sm font-semibold text-slate-100">
                {selected.name}
              </div>
              <div className="mt-1 text-xs text-slate-500 font-mono">
                ID: {selected.id}
              </div>
            </div>

            {selected.isDeletable ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <button
                  type="button"
                  onClick={() => actions.delete(selected.id)}
                  className="w-full rounded-xl bg-red-600/90 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 shadow-md active:translate-y-[1px]"
                >
                  Delete Block
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center text-xs text-slate-500">
                This block cannot be deleted.
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
            Click on an element in the canvas to select and inspect it.
          </div>
        )}
      </div>
    </aside>
  );
}
