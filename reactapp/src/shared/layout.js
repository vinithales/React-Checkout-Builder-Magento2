import { componentDefinitions } from './componentDefinitions';

export function validateLayout(layout) {
  if (!layout || layout.schemaVersion !== 1 || !layout.root) {
    throw new Error('Unsupported or incomplete checkout layout.');
  }
  const visit = (node, root = false) => {
    const definition = componentDefinitions[node?.type];
    if (!definition || !node.props || !Array.isArray(node.children)) {
      throw new Error(
        `Invalid checkout component: ${node?.type || 'unknown'}.`
      );
    }
    if (Object.keys(node.props).length) {
      throw new Error(
        'Schema version 1 does not support component properties.'
      );
    }
    if (root && node.type !== 'Container') {
      throw new Error('The root checkout component must be a Container.');
    }
    if (node.children.length && !definition.container) {
      throw new Error(`${definition.label} cannot contain children.`);
    }
    node.children.forEach((child) => visit(child));
  };
  visit(layout.root, true);
  return layout;
}

export function parseLayout(json, fallback) {
  try {
    return validateLayout(typeof json === 'string' ? JSON.parse(json) : json);
  } catch (error) {
    if (fallback) return validateLayout(fallback);
    throw error;
  }
}
