import React from 'react';
import PropTypes from 'prop-types';
import { useEditor } from '@craftjs/core';

export function Toolbar({
  device,
  onDevice,
  onSave,
  onPublish,
  onPreview,
  saving,
  dirty,
}) {
  const { actions, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));
  return (
    <header className="editor-toolbar">
      <div>
        <span className="editor-kicker">Hyvä</span>
        <h1>Checkout Builder</h1>
      </div>
      <div className="toolbar-actions">
        <button
          type="button"
          disabled={!canUndo}
          onClick={() => actions.history.undo()}
        >
          Undo
        </button>
        <button
          type="button"
          disabled={!canRedo}
          onClick={() => actions.history.redo()}
        >
          Redo
        </button>
        <select
          aria-label="Preview device"
          value={device}
          onChange={(event) => onDevice(event.target.value)}
        >
          <option value="desktop">Desktop</option>
          <option value="tablet">Tablet</option>
          <option value="mobile">Mobile</option>
        </select>
        <button type="button" onClick={onPreview}>
          Checkout
        </button>
        <button type="button" disabled={saving || !dirty} onClick={onSave}>
          Save draft
        </button>
        <button
          type="button"
          className="primary"
          disabled={saving}
          onClick={onPublish}
        >
          Publish
        </button>
      </div>
    </header>
  );
}

Toolbar.propTypes = {
  device: PropTypes.string.isRequired,
  onDevice: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
};
