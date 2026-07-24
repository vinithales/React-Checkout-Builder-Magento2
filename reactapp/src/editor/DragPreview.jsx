import React, { useEffect, useState } from 'react';
import { componentRegistry } from '../shared/registry';

const EVENT = 'checkout-builder-drag-preview';

export function startDragPreview(type, event) {
  const transparent = new Image();
  transparent.src =
    'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  event.dataTransfer?.setDragImage(transparent, 0, 0);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: type }));
}

export function stopDragPreview() {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: null }));
}

export function DragPreview() {
  const [type, setType] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const select = (event) => setType(event.detail);
    const move = (event) => setPosition({ x: event.clientX, y: event.clientY });
    window.addEventListener(EVENT, select);
    window.addEventListener('dragover', move);
    window.addEventListener('drop', stopDragPreview);
    return () => {
      window.removeEventListener(EVENT, select);
      window.removeEventListener('dragover', move);
      window.removeEventListener('drop', stopDragPreview);
    };
  }, []);
  if (!type) return null;
  const Component = componentRegistry[type].component;
  return (
    <div
      className="drag-preview"
      style={{ left: position.x + 16, top: position.y + 16 }}
      aria-hidden="true"
    >
      <Component />
    </div>
  );
}
