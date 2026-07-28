export const CURRENT_LAYOUT_SCHEMA_VERSION = 2;
export const LEGACY_LAYOUT_SCHEMA_VERSION = 1;
export const MAX_LAYOUT_DEPTH = 100;

export const FLEX_DIRECTIONS = ['row', 'column'];
export const FLEX_WRAPS = ['nowrap', 'wrap'];
export const JUSTIFY_CONTENT_VALUES = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
];
export const ALIGN_ITEMS_VALUES = [
  'stretch',
  'flex-start',
  'center',
  'flex-end',
];

export const ZERO_SPACING = Object.freeze({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

export const CONTAINER_PADDING = Object.freeze({
  top: 16,
  right: 16,
  bottom: 16,
  left: 16,
});

export const FLEX_CONTAINER_DEFAULTS = Object.freeze({
  direction: 'row',
  wrap: 'nowrap',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: 16,
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  margin: ZERO_SPACING,
  padding: CONTAINER_PADDING,
});

export const COLUMN_CONTAINER_DEFAULTS = Object.freeze({
  alignItems: 'stretch',
  gap: 16,
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  margin: ZERO_SPACING,
  padding: CONTAINER_PADDING,
});

const spacingSchema = Object.freeze({
  type: 'spacing',
  min: 0,
  max: 300,
});

const sharedContainerSchema = Object.freeze({
  alignItems: Object.freeze({
    type: 'enum',
    values: ALIGN_ITEMS_VALUES,
  }),
  gap: Object.freeze({ type: 'number', min: 0, max: 200 }),
  backgroundColor: Object.freeze({ type: 'color' }),
  borderColor: Object.freeze({ type: 'color' }),
  margin: spacingSchema,
  padding: spacingSchema,
});

export const FLEX_CONTAINER_PROP_SCHEMA = Object.freeze({
  direction: Object.freeze({ type: 'enum', values: FLEX_DIRECTIONS }),
  wrap: Object.freeze({ type: 'enum', values: FLEX_WRAPS }),
  justifyContent: Object.freeze({
    type: 'enum',
    values: JUSTIFY_CONTENT_VALUES,
  }),
  ...sharedContainerSchema,
});

export const COLUMN_CONTAINER_PROP_SCHEMA = sharedContainerSchema;

const emptyProps = Object.freeze({});

/**
 * Persistent component contract. Consumers must use this map rather than
 * declaring local defaults or prop whitelists.
 *
 * `componentName` points to the visual export from `shared/components.jsx`.
 * `Container` remains registered only so persisted version 1 documents can be
 * read and migrated; it must not be offered for new layouts.
 */
export const componentDefinitions = Object.freeze({
  Container: Object.freeze({
    label: 'Container',
    container: true,
    legacy: true,
    componentName: 'Container',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  FlexContainer: Object.freeze({
    label: 'Flex Container',
    container: true,
    componentName: 'FlexContainer',
    defaultProps: FLEX_CONTAINER_DEFAULTS,
    propSchema: FLEX_CONTAINER_PROP_SCHEMA,
  }),
  ColumnContainer: Object.freeze({
    label: 'Column Container',
    container: true,
    componentName: 'ColumnContainer',
    defaultProps: COLUMN_CONTAINER_DEFAULTS,
    propSchema: COLUMN_CONTAINER_PROP_SCHEMA,
  }),
  AddressWrapper: Object.freeze({
    label: 'Address wrapper',
    container: true,
    componentName: 'CheckoutAddressWrapper',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  StickySidebar: Object.freeze({
    label: 'Sticky right sidebar',
    container: true,
    componentName: 'CheckoutStickySidebar',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  Login: Object.freeze({
    label: 'Login',
    componentName: 'Login',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  ShippingAddress: Object.freeze({
    label: 'Shipping address',
    componentName: 'ShippingAddress',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  BillingAddress: Object.freeze({
    label: 'Billing address',
    componentName: 'BillingAddress',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  ShippingMethods: Object.freeze({
    label: 'Shipping methods',
    componentName: 'ShippingMethods',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  PaymentMethod: Object.freeze({
    label: 'Payment method',
    componentName: 'PaymentMethod',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  CouponCode: Object.freeze({
    label: 'Coupon code',
    componentName: 'CouponCode',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  CartItems: Object.freeze({
    label: 'Cart items',
    componentName: 'CartItems',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  CheckoutAgreements: Object.freeze({
    label: 'Checkout agreements',
    componentName: 'CheckoutAgreements',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  Totals: Object.freeze({
    label: 'Totals summary',
    componentName: 'Totals',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  PlaceOrder: Object.freeze({
    label: 'Place order',
    componentName: 'PlaceOrder',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  Message: Object.freeze({
    label: 'System messages',
    componentName: 'Message',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
  PageLoader: Object.freeze({
    label: 'Page loader',
    componentName: 'PageLoader',
    defaultProps: emptyProps,
    propSchema: emptyProps,
  }),
});

export const componentTypes = Object.freeze(Object.keys(componentDefinitions));
export const currentComponentTypes = Object.freeze(
  componentTypes.filter((type) => !componentDefinitions[type].legacy)
);
export const containerTypes = Object.freeze(
  componentTypes.filter((type) => componentDefinitions[type].container)
);

function cloneSpacing(value) {
  return {
    top: value.top,
    right: value.right,
    bottom: value.bottom,
    left: value.left,
  };
}

export function getComponentDefaults(type) {
  const definition = componentDefinitions[type];
  if (!definition) {
    throw new Error(`Unknown checkout component: ${type || 'unknown'}.`);
  }

  return Object.fromEntries(
    Object.entries(definition.defaultProps).map(([name, value]) => [
      name,
      definition.propSchema[name]?.type === 'spacing'
        ? cloneSpacing(value)
        : value,
    ])
  );
}

function normalizeNumber(value, schema, fallback) {
  const numericValue =
    typeof value === 'number' ? value : Number.parseFloat(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.min(schema.max, Math.max(schema.min, numericValue));
}

export function normalizeColor(value, fallback = 'transparent') {
  if (typeof value !== 'string') return fallback;
  const color = value.trim().toLowerCase();
  if (color === 'transparent') return color;
  if (/^#[0-9a-f]{6}$/.test(color)) return color;
  if (/^#[0-9a-f]{3}$/.test(color)) {
    return `#${color
      .slice(1)
      .split('')
      .map((character) => character.repeat(2))
      .join('')}`;
  }
  return fallback;
}

export function normalizeSpacing(value, fallback = ZERO_SPACING) {
  const spacing = value && typeof value === 'object' ? value : {};
  return Object.fromEntries(
    ['top', 'right', 'bottom', 'left'].map((side) => [
      side,
      normalizeNumber(spacing[side], { min: 0, max: 300 }, fallback[side]),
    ])
  );
}

export function normalizeComponentProps(type, props = {}) {
  const definition = componentDefinitions[type];
  if (!definition) {
    throw new Error(`Unknown checkout component: ${type || 'unknown'}.`);
  }

  const source = props && typeof props === 'object' ? props : {};
  const defaults = getComponentDefaults(type);

  return Object.fromEntries(
    Object.entries(definition.propSchema).map(([name, schema]) => {
      const fallback = defaults[name];
      const value = source[name];
      if (schema.type === 'enum') {
        return [name, schema.values.includes(value) ? value : fallback];
      }
      if (schema.type === 'number') {
        return [name, normalizeNumber(value, schema, fallback)];
      }
      if (schema.type === 'color') {
        return [name, normalizeColor(value, fallback)];
      }
      return [name, normalizeSpacing(value, fallback)];
    })
  );
}
