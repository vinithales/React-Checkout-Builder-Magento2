import React from 'react';
import PropTypes from 'prop-types';
import { Canvas } from './Canvas';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';
import { Inspector } from './Inspector';
import { DragPreview } from './DragPreview';

export default function EditorLayout(props) {
  const { layout, stores, storeId, onStore, status, inherited, device } = props;
  return (
    <div className="checkout-editor">
      <Toolbar {...props} />
      <div className="editor-subbar">
        <span>Store view</span>
        <select
          id="store-view"
          value={storeId}
          onChange={(event) => onStore(Number(event.target.value))}
        >
          {stores.map((store) => (
            <option key={store.value} value={store.value}>
              {store.label}
            </option>
          ))}
        </select>
        {inherited && <span className="inherited">Using inherited layout</span>}
        <span className={`editor-status editor-status--${status.type}`}>
          {status.message}
        </span>
      </div>
      <div className="editor-workspace">
        <Sidebar />
        <Canvas layout={layout} device={device} />
        <Inspector />
      </div>
      <DragPreview />
    </div>
  );
}

EditorLayout.propTypes = {
  layout: PropTypes.object.isRequired,
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      checkoutUrl: PropTypes.string.isRequired,
    })
  ).isRequired,
  storeId: PropTypes.number.isRequired,
  onStore: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired,
  inherited: PropTypes.bool.isRequired,
  device: PropTypes.string.isRequired,
};
