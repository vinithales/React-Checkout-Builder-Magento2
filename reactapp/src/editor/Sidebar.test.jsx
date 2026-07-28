import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@craftjs/core', () => ({
  Element: function Element() {
    return null;
  },
  useEditor: (selector) => ({
    connectors: { create: jest.fn() },
    ...(selector
      ? selector({ nodes: {}, events: { selected: new Set() } })
      : {}),
  }),
}));

jest.mock('./nodes', () => ({
  editorNodes: new Proxy(
    {},
    {
      get: () =>
        function MockEditorNode() {
          return null;
        },
    }
  ),
}));

jest.mock('./DragPreview', () => ({
  startDragPreview: jest.fn(),
  stopDragPreview: jest.fn(),
}));

jest.mock('../shared/components', () =>
  new Proxy(
    { __esModule: true },
    {
      get: (target, property) =>
        property === '__esModule'
          ? true
          : function MockVisualComponent() {
              return null;
            },
    }
  )
);

import { Sidebar } from './Sidebar';

describe('Editor component library', () => {
  it('lists both containers as minimal name-only cards', () => {
    const html = renderToStaticMarkup(<Sidebar />);
    const root = document.createElement('div');
    root.innerHTML = html;
    const cards = [...root.querySelectorAll('.library-card')];
    const labels = cards.map((card) => card.textContent.trim());

    expect(labels).toContain('Flex Container');
    expect(labels).toContain('Column Container');
    expect(
      cards
        .find((card) => card.textContent === 'Flex Container')
        .getAttribute('title')
    ).toBe('Drag Flex Container to the canvas');
    cards.forEach((card) => {
      expect(card.children).toHaveLength(0);
      expect(card.textContent.trim()).not.toBe('');
    });
    expect(root.querySelector('[data-component]')).toBeNull();
    expect(root.querySelector('.drag-preview__component')).toBeNull();
  });
});
