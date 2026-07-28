import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';

jest.mock('../shared/componentDefinitions', () => ({
  getComponentDefaults: (type) => ({ previewType: type, gap: 16 }),
}));

jest.mock('../shared/registry', () => {
  const ReactModule = require('react');
  return {
    componentRegistry: {
      FlexContainer: {
        label: 'Flex Container',
        container: true,
        component: function PreviewComponent({ previewType, gap }) {
          return ReactModule.createElement('div', {
            'data-real-component': previewType,
            'data-gap': gap,
          });
        },
      },
    },
  };
});

import {
  DragPreview,
  startDragPreview,
  stopDragPreview,
} from './DragPreview';

describe('Editor drag preview', () => {
  let host;
  let root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
    act(() => root.render(<DragPreview />));
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    global.IS_REACT_ACT_ENVIRONMENT = false;
  });

  it('uses the real registered component while keeping its label', () => {
    const setDragImage = jest.fn();
    act(() =>
      startDragPreview('FlexContainer', {
        dataTransfer: { setDragImage },
      })
    );
    act(() => {
      window.dispatchEvent(
        new MouseEvent('dragover', { clientX: 40, clientY: 60 })
      );
    });

    expect(setDragImage).toHaveBeenCalledTimes(1);
    expect(host.querySelector('.drag-preview__label').textContent).toBe(
      'Flex Container'
    );
    expect(
      host.querySelector('[data-real-component="FlexContainer"]')
    ).not.toBeNull();
    expect(host.querySelector('[data-real-component]').dataset.gap).toBe('16');
    expect(host.querySelector('.drag-preview').style.left).toBe('56px');
    expect(host.querySelector('.drag-preview').style.top).toBe('76px');

    act(() => stopDragPreview());
    expect(host.querySelector('.drag-preview')).toBeNull();
  });
});
