import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('../shared/registry', () => {
  const ReactModule = require('react');
  const component = (type) =>
    function TestComponent({ children, ...props }) {
      return ReactModule.createElement(
        'section',
        {
          'data-runtime-type': type,
          'data-runtime-props': JSON.stringify(props),
        },
        children
      );
    };

  return {
    componentRegistry: {
      FlexContainer: { component: component('FlexContainer') },
      ColumnContainer: { component: component('ColumnContainer') },
      Login: { component: component('Login') },
      Totals: { component: component('Totals') },
    },
  };
});

import LayoutRenderer from './LayoutRenderer';

describe('Runtime LayoutRenderer', () => {
  it('renders the persisted tree recursively and preserves child order', () => {
    const html = renderToStaticMarkup(
      <LayoutRenderer
        node={{
          id: 'root',
          type: 'FlexContainer',
          props: { gap: 12 },
          children: [
            {
              id: 'left',
              type: 'ColumnContainer',
              props: { alignItems: 'stretch' },
              children: [
                { id: 'login', type: 'Login', props: {}, children: [] },
              ],
            },
            { id: 'totals', type: 'Totals', props: {}, children: [] },
          ],
        }}
      />
    );

    expect(html.match(/data-runtime-type=/g)).toHaveLength(4);
    expect(html.indexOf('FlexContainer')).toBeLessThan(
      html.indexOf('ColumnContainer')
    );
    expect(html.indexOf('ColumnContainer')).toBeLessThan(html.indexOf('Login'));
    expect(html.indexOf('Login')).toBeLessThan(html.indexOf('Totals'));
    expect(html).toContain('&quot;gap&quot;:12');
  });

  it('does not render unknown registry types or editor artifacts', () => {
    const html = renderToStaticMarkup(
      <LayoutRenderer
        node={{ type: 'Unknown', props: {}, children: [] }}
      />
    );

    expect(html).toBe('');
    expect(html).not.toMatch(/editor|craft|drop|overlay/i);
  });
});
