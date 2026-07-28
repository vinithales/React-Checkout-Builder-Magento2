import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@craftjs/core', () => ({
  Element: function Element({ children, is: Component, ...props }) {
    return <Component {...props}>{children}</Component>;
  },
}));

jest.mock('./nodes', () => {
  const ReactModule = require('react');
  const component = (type, canvas = false) => {
    function Node({ children }) {
      return ReactModule.createElement(
        'div',
        { 'data-craft-node': type },
        children
      );
    }
    Node.craft = { isCanvas: canvas };
    return Node;
  };
  return {
    editorNodes: {
      FlexContainer: component('FlexContainer', true),
      ColumnContainer: component('ColumnContainer', true),
      Login: component('Login'),
      Totals: component('Totals'),
    },
  };
});

import { craftToLayout, layoutToCraft } from './layoutAdapter';
import { createComponentProps } from '../shared/layout';

describe('Craft DTO adapter', () => {
  it('reloads a DTO recursively without wrappers that lose children', () => {
    const element = layoutToCraft({
      id: 'root',
      type: 'FlexContainer',
      props: createComponentProps('FlexContainer'),
      children: [
        {
          id: 'column',
          type: 'ColumnContainer',
          props: createComponentProps('ColumnContainer'),
          children: [
            { id: 'login', type: 'Login', props: {}, children: [] },
            { id: 'totals', type: 'Totals', props: {}, children: [] },
          ],
        },
      ],
    });
    const html = renderToStaticMarkup(element);

    expect(html.match(/data-craft-node=/g)).toHaveLength(4);
    expect(html.indexOf('ColumnContainer')).toBeLessThan(html.indexOf('Login'));
    expect(html.indexOf('Login')).toBeLessThan(html.indexOf('Totals'));
  });

  it('serializes children in Craft order with normalized container props', () => {
    const query = {
      getSerializedNodes: () => ({
        ROOT: {
          custom: { layoutType: 'FlexContainer' },
          props: { ...createComponentProps('FlexContainer'), gap: '42' },
          nodes: ['totals', 'column'],
        },
        totals: {
          custom: { layoutType: 'Totals' },
          props: {},
          nodes: [],
        },
        column: {
          custom: { layoutType: 'ColumnContainer' },
          props: createComponentProps('ColumnContainer'),
          nodes: ['login'],
        },
        login: {
          custom: { layoutType: 'Login' },
          props: {},
          nodes: [],
        },
      }),
    };

    const layout = craftToLayout(query);

    expect(layout.schemaVersion).toBe(2);
    expect(layout.root.id).toBe('ROOT');
    expect(layout.root.props.gap).toBe(42);
    expect(layout.root.children.map(({ id }) => id)).toEqual([
      'totals',
      'column',
    ]);
    expect(layout.root.children[1].children[0].id).toBe('login');
  });
});
