import React from 'react';
import { useEditor } from '@craftjs/core';

export function Inspector() {
  const { selected, actions } = useEditor((state, query) => {
    const id = [...state.events.selected][0];
    if (!id) return { selected: null };
    const node = state.nodes[id];
    return {
      selected: {
        id,
        name: node.data.displayName,
        deletable: query.node(id).isDeletable(),
      },
    };
  });
  if (!selected) return null;
  return (
    <aside className="editor-inspector">
      <span className="editor-kicker">Selected component</span>
      <h2>{selected.name}</h2>
      <div className="inspector-section">
        <h3>Content</h3>
        <p>This component has no editable content in schema version 1.</p>
      </div>
      {selected.deletable && (
        <button
          type="button"
          className="danger"
          onClick={() => actions.delete(selected.id)}
        >
          Delete component
        </button>
      )}
    </aside>
  );
}
