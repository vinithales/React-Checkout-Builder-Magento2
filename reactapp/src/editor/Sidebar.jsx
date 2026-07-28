import React, { useState } from 'react';
import { Element, useEditor } from '@craftjs/core';
import PropTypes from 'prop-types';
import { getComponentDefaults } from '../shared/componentDefinitions';
import { componentGroups, componentRegistry } from '../shared/registry';
import { editorNodes } from './nodes';
import { startDragPreview, stopDragPreview } from './DragPreview';

function LibraryCard({ type }) {
  const {
    connectors: { create },
  } = useEditor();
  const definition = componentRegistry[type];
  const Node = editorNodes[type];
  const defaults = getComponentDefaults(type);
  const element = definition.container ? (
    <Element is={Node} canvas {...defaults} />
  ) : (
    <Node {...defaults} />
  );
  return (
    <button
      type="button"
      ref={(ref) => ref && create(ref, element)}
      className="library-card"
      title={`Drag ${definition.label} to the canvas`}
      aria-label={`Arraste ${definition.label} para o canvas`}
      onDragStart={(event) => startDragPreview(type, event)}
      onDragEnd={stopDragPreview}
    >
      {definition.label}
    </button>
  );
}

LibraryCard.propTypes = { type: PropTypes.string.isRequired };

export function Sidebar() {
  const [tab, setTab] = useState('library');
  const { tree } = useEditor((state) => ({
    tree: Object.values(state.nodes).map((node) => ({
      id: node.id,
      name: node.data.displayName,
    })),
  }));
  return (
    <aside className="editor-sidebar">
      <nav className="editor-tabs" aria-label="Editor panels">
        {['library', 'tree', 'settings'].map((name) => (
          <button
            key={name}
            type="button"
            className={tab === name ? 'is-active' : ''}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </nav>
      <div className="editor-sidebar__content">
        {tab === 'library' &&
          componentGroups.map((group) => (
            <section key={group.label} className="library-group">
              <h3>{group.label}</h3>
              <div className="library-group__cards">
                {group.types.map((type) => (
                  <LibraryCard key={type} type={type} />
                ))}
              </div>
            </section>
          ))}
        {tab === 'tree' && (
          <ul className="layout-tree">
            {tree.map((node) => (
              <li key={node.id}>{node.name}</li>
            ))}
          </ul>
        )}
        {tab === 'settings' && (
          <p className="editor-empty">
            Global settings will be introduced with a future schema version.
          </p>
        )}
      </div>
    </aside>
  );
}
