import { defaultLayout } from './defaultLayout';
import { parseLayout, validateLayout } from './layout';

describe('checkout layout schema', () => {
  it('accepts the default versioned layout', () => {
    expect(validateLayout(defaultLayout)).toBe(defaultLayout);
  });

  it('rejects unknown components', () => {
    expect(() =>
      validateLayout({
        schemaVersion: 1,
        root: { type: 'Unknown', props: {}, children: [] },
      })
    ).toThrow('Invalid checkout component');
  });

  it('falls back when persisted JSON is invalid', () => {
    expect(parseLayout('{invalid', defaultLayout)).toBe(defaultLayout);
  });

  it('rejects children on leaf components', () => {
    expect(() =>
      validateLayout({
        schemaVersion: 1,
        root: {
          type: 'Container',
          props: {},
          children: [
            {
              type: 'Login',
              props: {},
              children: [{ type: 'Totals', props: {}, children: [] }],
            },
          ],
        },
      })
    ).toThrow('Login cannot contain children');
  });
});
