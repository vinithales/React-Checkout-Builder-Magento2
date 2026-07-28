import React from 'react';
import { act, Simulate } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import {
  createComponentProps,
} from '../shared/layout';

jest.mock('@craftjs/core', () => {
  let selected = null;
  const actions = {
    setProp: jest.fn(),
    delete: jest.fn(),
  };
  return {
    __actions: actions,
    __select(type, props) {
      selected = type
        ? {
            id: 'selected',
            type,
            props,
            name: type,
          }
        : null;
    },
    useEditor(selector) {
      const state = {
        events: { selected: new Set(selected ? [selected.id] : []) },
        nodes: selected
          ? {
              [selected.id]: {
                data: {
                  displayName: selected.name,
                  custom: { layoutType: selected.type },
                  props: selected.props,
                },
              },
            }
          : {},
      };
      return {
        ...selector(state, {
          node: () => ({ isDeletable: () => true }),
        }),
        actions,
      };
    },
  };
});

import { __actions, __select } from '@craftjs/core';
import { Inspector } from './Inspector';

describe('contextual container Inspector', () => {
  let host;
  let root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
    __actions.setProp.mockClear();
    __actions.delete.mockClear();
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    global.IS_REACT_ACT_ENVIRONMENT = false;
  });

  function renderSelection(type) {
    __select(type, createComponentProps(type));
    act(() => root.render(<Inspector />));
  }

  it('exposes every FlexContainer control in contextual groups', () => {
    renderSelection('FlexContainer');

    expect(host.textContent).toContain('Layout');
    expect(host.textContent).toContain('Style');
    expect(host.textContent).toContain('Advanced');
    [
      'Direction',
      'Wrap',
      'Justify content',
      'Align items',
      'Gap',
      'Background color',
      'Border color',
      'Margin',
      'Padding',
    ].forEach((label) => expect(host.textContent).toContain(label));
    expect(host.querySelectorAll('input[type="number"]')).toHaveLength(9);
  });

  it('hides Flex-only controls for ColumnContainer', () => {
    renderSelection('ColumnContainer');

    expect(host.textContent).not.toContain('Direction');
    expect(host.textContent).not.toContain('Wrap');
    expect(host.textContent).not.toContain('Justify content');
    expect(host.textContent).toContain('Align items');
    expect(host.textContent).toContain('Gap');
    expect(host.querySelectorAll('input[type="number"]')).toHaveLength(9);
  });

  it('normalizes an input before mutating a Craft node', () => {
    renderSelection('FlexContainer');
    const gap = host.querySelector('#selected-gap');

    act(() => {
      Simulate.change(gap, { target: { value: '999' } });
    });

    expect(__actions.setProp).toHaveBeenCalledTimes(1);
    const [, mutate] = __actions.setProp.mock.calls[0];
    const props = {};
    mutate(props);
    expect(props.gap).toBe(200);
  });
});
