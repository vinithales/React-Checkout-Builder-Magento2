import {
  CURRENT_LAYOUT_SCHEMA_VERSION,
  FLEX_CONTAINER_DEFAULTS,
  COLUMN_CONTAINER_DEFAULTS,
  MAX_LAYOUT_DEPTH,
} from './componentDefinitions';
import { defaultLayout } from './defaultLayout';
import {
  createComponentProps,
  migrateLayout,
  parseLayout,
  validateLayout,
} from './layout';

const node = (type, props, children = [], id) => ({
  ...(id ? { id } : {}),
  type,
  props,
  children,
});

const document = (root, schemaVersion = CURRENT_LAYOUT_SCHEMA_VERSION) => ({
  schemaVersion,
  root,
});

describe('checkout layout schema', () => {
  it('accepts the default versioned layout', () => {
    expect(validateLayout(defaultLayout)).toBe(defaultLayout);
  });

  it('accepts both current container types with nested children', () => {
    const layout = document(
      node(
        'FlexContainer',
        FLEX_CONTAINER_DEFAULTS,
        [
          node(
            'ColumnContainer',
            COLUMN_CONTAINER_DEFAULTS,
            [node('Login', {}, [], 'login')],
            'column'
          ),
          node('Totals', {}, [], 'totals'),
        ],
        'root'
      )
    );

    expect(validateLayout(layout)).toEqual(layout);
  });

  it('rejects unknown components', () => {
    expect(() =>
      validateLayout(document(node('Unknown', {})))
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

  it('migrates legacy row containers while preserving metadata, IDs and order', () => {
    const legacy = {
      schemaVersion: 1,
      documentName: 'legacy checkout',
      root: node(
        'Container',
        {
          direction: 'row',
          gap: 28,
          backgroundColor: '#ABC',
          arbitraryCss: 'display:none',
        },
        [
          node('Login', {}, [], 'login'),
          node(
            'Container',
            { direction: 'column', padding: { left: 24 } },
            [node('Totals', {}, [], 'totals')],
            'nested'
          ),
        ],
        'root'
      ),
    };

    const migrated = migrateLayout(legacy);

    expect(migrated.schemaVersion).toBe(CURRENT_LAYOUT_SCHEMA_VERSION);
    expect(migrated.documentName).toBe('legacy checkout');
    expect(migrated.root).toMatchObject({
      id: 'root',
      type: 'FlexContainer',
      props: {
        direction: 'row',
        gap: 28,
        backgroundColor: '#aabbcc',
      },
    });
    expect(migrated.root.props).not.toHaveProperty('arbitraryCss');
    expect(migrated.root.children.map(({ id }) => id)).toEqual([
      'login',
      'nested',
    ]);
    expect(migrated.root.children[1]).toMatchObject({
      id: 'nested',
      type: 'ColumnContainer',
      props: {
        padding: { top: 16, right: 16, bottom: 16, left: 24 },
      },
    });
    expect(migrateLayout(migrated)).toBe(migrated);
  });

  it.each([
    ['direction', 'grid'],
    ['wrap', 'wrap-reverse'],
    ['justifyContent', 'baseline'],
    ['alignItems', 'baseline'],
    ['gap', -1],
    ['gap', 201],
    ['backgroundColor', 'red'],
    ['borderColor', '#ABCDEF'],
  ])('rejects invalid FlexContainer %s', (property, value) => {
    expect(() =>
      validateLayout(
        document(
          node('FlexContainer', {
            ...createComponentProps('FlexContainer'),
            [property]: value,
          })
        )
      )
    ).toThrow();
  });

  it.each([
    ['direction', 'column'],
    ['wrap', 'nowrap'],
    ['justifyContent', 'flex-start'],
    ['style', 'display:none'],
  ])('rejects unsupported ColumnContainer property %s', (property, value) => {
    expect(() =>
      validateLayout(
        document(
          node('ColumnContainer', {
            ...createComponentProps('ColumnContainer'),
            [property]: value,
          })
        )
      )
    ).toThrow('unsupported properties');
  });

  it.each([
    ['margin', 'top', -1],
    ['margin', 'right', 301],
    ['padding', 'bottom', Number.NaN],
    ['padding', 'left', '16'],
  ])('rejects invalid %s.%s spacing', (property, side, value) => {
    const props = createComponentProps('ColumnContainer');
    props[property][side] = value;

    expect(() =>
      validateLayout(document(node('ColumnContainer', props)))
    ).toThrow();
  });

  it('rejects missing and unknown spacing sides', () => {
    const missing = createComponentProps('ColumnContainer');
    delete missing.margin.left;
    const unknown = createComponentProps('ColumnContainer');
    unknown.padding.block = 1;

    expect(() =>
      validateLayout(document(node('ColumnContainer', missing)))
    ).toThrow('top, right, bottom and left');
    expect(() =>
      validateLayout(document(node('ColumnContainer', unknown)))
    ).toThrow('top, right, bottom and left');
  });

  it('rejects non-container roots and empty IDs', () => {
    expect(() => validateLayout(document(node('Login', {})))).toThrow(
      'root checkout component must be a container'
    );
    expect(() =>
      validateLayout(
        document(node('ColumnContainer', COLUMN_CONTAINER_DEFAULTS, [], ' '))
      )
    ).toThrow('IDs must be non-empty strings');
  });

  it('rejects cyclic trees and trees beyond the defensive depth limit', () => {
    const cyclicRoot = node(
      'ColumnContainer',
      createComponentProps('ColumnContainer')
    );
    cyclicRoot.children.push(cyclicRoot);

    expect(() => migrateLayout(document(cyclicRoot))).toThrow('cycle');

    const deepRoot = node(
      'ColumnContainer',
      createComponentProps('ColumnContainer')
    );
    let cursor = deepRoot;
    for (let depth = 0; depth <= MAX_LAYOUT_DEPTH; depth += 1) {
      const child = node(
        'ColumnContainer',
        createComponentProps('ColumnContainer')
      );
      cursor.children.push(child);
      cursor = child;
    }

    expect(() => migrateLayout(document(deepRoot))).toThrow(
      'maximum depth'
    );
  });

  it('returns independent nested defaults for newly created nodes', () => {
    const first = createComponentProps('ColumnContainer');
    const second = createComponentProps('ColumnContainer');

    first.padding.top = 99;

    expect(second.padding.top).toBe(16);
    expect(COLUMN_CONTAINER_DEFAULTS.padding.top).toBe(16);
  });
});
