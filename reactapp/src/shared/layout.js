import {
  CURRENT_LAYOUT_SCHEMA_VERSION,
  LEGACY_LAYOUT_SCHEMA_VERSION,
  MAX_LAYOUT_DEPTH,
  componentDefinitions,
  getComponentDefaults,
  normalizeColor,
  normalizeComponentProps,
} from './componentDefinitions';

const SUPPORTED_SCHEMA_VERSIONS = [
  LEGACY_LAYOUT_SCHEMA_VERSION,
  CURRENT_LAYOUT_SCHEMA_VERSION,
];
const ROOT_TYPES = ['FlexContainer', 'ColumnContainer'];
const SPACING_SIDES = ['top', 'right', 'bottom', 'left'];
const HEX_COLOR = /^#[0-9a-f]{6}$/;

function fail(message) {
  throw new Error(message);
}

function assertDepth(depth) {
  if (depth > MAX_LAYOUT_DEPTH) {
    fail(`Checkout layout exceeds the maximum depth of ${MAX_LAYOUT_DEPTH}.`);
  }
}

function migrateNode(node, sourceVersion, activeNodes, depth) {
  assertDepth(depth);
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    fail('The checkout layout contains an invalid node.');
  }
  if (activeNodes.has(node)) {
    fail('The checkout layout contains a cycle.');
  }
  activeNodes.add(node);

  try {
    const sourceType = node.type;
    let type = sourceType;
    if (sourceType === 'Container') {
      type =
        node.props?.direction === 'row' ? 'FlexContainer' : 'ColumnContainer';
    }
    const definition = componentDefinitions[type];
    if (!definition) {
      fail(`Invalid checkout component: ${sourceType || 'unknown'}.`);
    }
    if (!Array.isArray(node.children)) {
      fail(`Invalid checkout component: ${sourceType || 'unknown'}.`);
    }

    const sourceProps =
      node.props && typeof node.props === 'object' && !Array.isArray(node.props)
        ? node.props
        : {};
    const normalizedProps = normalizeComponentProps(type, sourceProps);

    // Unknown properties from a current document remain visible to strict
    // validation, as do invalid values for known properties. Legacy documents
    // intentionally retain only normalized, recognized styles while they are
    // converted to the current whitelist.
    const props =
      sourceVersion === CURRENT_LAYOUT_SCHEMA_VERSION &&
      sourceType !== 'Container'
        ? { ...getComponentDefaults(type), ...sourceProps }
        : normalizedProps;

    return {
      ...node,
      type,
      props,
      children: node.children.map((child) =>
        migrateNode(child, sourceVersion, activeNodes, depth + 1)
      ),
    };
  } finally {
    activeNodes.delete(node);
  }
}

function structurallyEqual(left, right) {
  try {
    return JSON.stringify(left) === JSON.stringify(right);
  } catch (error) {
    return false;
  }
}

/**
 * Converts supported persisted documents to the current DTO.
 *
 * The conversion is idempotent, preserves document metadata, node IDs, child
 * order and children, and never mutates the input tree.
 */
export function migrateLayout(layout) {
  if (!layout || typeof layout !== 'object' || Array.isArray(layout)) {
    fail('Unsupported or incomplete checkout layout.');
  }
  if (
    !SUPPORTED_SCHEMA_VERSIONS.includes(layout.schemaVersion) ||
    !layout.root
  ) {
    fail('Unsupported or incomplete checkout layout.');
  }

  const migrated = {
    ...layout,
    schemaVersion: CURRENT_LAYOUT_SCHEMA_VERSION,
    root: migrateNode(layout.root, layout.schemaVersion, new WeakSet(), 0),
  };

  return structurallyEqual(layout, migrated) ? layout : migrated;
}

function validateSpacing(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`Property "${name}" must contain numeric spacing values.`);
  }
  const keys = Object.keys(value);
  if (
    keys.length !== SPACING_SIDES.length ||
    keys.some((key) => !SPACING_SIDES.includes(key))
  ) {
    fail(`Property "${name}" must define top, right, bottom and left.`);
  }
  SPACING_SIDES.forEach((side) => {
    if (
      typeof value[side] !== 'number' ||
      !Number.isFinite(value[side]) ||
      value[side] < 0 ||
      value[side] > 300
    ) {
      fail(`Property "${name}.${side}" must be between 0 and 300.`);
    }
  });
}

function validateProps(type, props) {
  if (!props || typeof props !== 'object' || Array.isArray(props)) {
    fail(`Invalid checkout component: ${type}.`);
  }
  const definition = componentDefinitions[type];
  const schema = definition.propSchema;
  const expected = Object.keys(schema);
  const received = Object.keys(props);
  if (
    received.length !== expected.length ||
    received.some((name) => !schema[name])
  ) {
    fail(`Component "${type}" contains unsupported properties.`);
  }

  expected.forEach((name) => {
    const value = props[name];
    const rule = schema[name];
    if (rule.type === 'enum' && !rule.values.includes(value)) {
      fail(`Property "${name}" contains an unsupported value.`);
    }
    if (
      rule.type === 'number' &&
      (typeof value !== 'number' ||
        !Number.isFinite(value) ||
        value < rule.min ||
        value > rule.max)
    ) {
      fail(`Property "${name}" must be between ${rule.min} and ${rule.max}.`);
    }
    if (
      rule.type === 'color' &&
      value !== 'transparent' &&
      (typeof value !== 'string' ||
        !HEX_COLOR.test(value) ||
        normalizeColor(value) !== value)
    ) {
      fail(`Property "${name}" must be a normalized hexadecimal color.`);
    }
    if (rule.type === 'spacing') validateSpacing(value, name);
  });
}

function validateNode(node, activeNodes, depth, root = false) {
  assertDepth(depth);
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    fail('The checkout layout contains an invalid node.');
  }
  if (activeNodes.has(node)) fail('The checkout layout contains a cycle.');
  activeNodes.add(node);

  try {
    const definition = componentDefinitions[node.type];
    if (!definition || definition.legacy || !Array.isArray(node.children)) {
      fail(`Invalid checkout component: ${node.type || 'unknown'}.`);
    }
    if (
      Object.prototype.hasOwnProperty.call(node, 'id') &&
      (typeof node.id !== 'string' || !node.id.trim())
    ) {
      fail('Checkout component IDs must be non-empty strings.');
    }
    validateProps(node.type, node.props);
    if (root && !ROOT_TYPES.includes(node.type)) {
      fail('The root checkout component must be a container.');
    }
    if (node.children.length && !definition.container) {
      fail(`${definition.label} cannot contain children.`);
    }
    node.children.forEach((child) =>
      validateNode(child, activeNodes, depth + 1)
    );
  } finally {
    activeNodes.delete(node);
  }
}

/**
 * Validates any supported schema and returns its normalized current DTO.
 */
export function validateLayout(layout) {
  const migrated = migrateLayout(layout);
  validateNode(migrated.root, new WeakSet(), 0, true);
  return migrated;
}

export function parseLayout(json, fallback) {
  try {
    return validateLayout(typeof json === 'string' ? JSON.parse(json) : json);
  } catch (error) {
    if (fallback) return validateLayout(fallback);
    throw error;
  }
}

/**
 * Returns normalized props for a new node without sharing mutable defaults.
 */
export function createComponentProps(type, props = {}) {
  if (!componentDefinitions[type] || componentDefinitions[type].legacy) {
    fail(`Invalid checkout component: ${type || 'unknown'}.`);
  }
  return {
    ...getComponentDefaults(type),
    ...normalizeComponentProps(type, props),
  };
}
