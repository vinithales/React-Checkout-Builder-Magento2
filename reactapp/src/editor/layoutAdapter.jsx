import React from 'react';
import { Element } from '@craftjs/core';
import {
  CURRENT_LAYOUT_SCHEMA_VERSION,
  normalizeComponentProps,
} from '../shared/componentDefinitions';
import { editorNodes } from './nodes';

export function layoutToCraft(node) {
  const Node = editorNodes[node.type];
  if (!Node) {
    throw new Error(`Unknown editor component: ${node.type || 'unknown'}.`);
  }
  const children = node.children.map((child, index) =>
    React.cloneElement(layoutToCraft(child), {
      // eslint-disable-next-line react/no-array-index-key
      key: child.id || `${child.type}-${index}`,
    })
  );
  if (Node.craft.isCanvas) {
    return (
      <Element is={Node} canvas {...node.props}>
        {children}
      </Element>
    );
  }
  return <Node {...node.props} />;
}

export function craftToLayout(query) {
  const nodes = query.getSerializedNodes();
  const visit = (id) => {
    const node = nodes[id];
    const type = node.custom?.layoutType;
    if (!type) throw new Error(`Node ${id} has no persistent component type.`);
    return {
      id,
      type,
      props: normalizeComponentProps(type, node.props),
      children: (node.nodes || []).map(visit),
    };
  };
  return {
    schemaVersion: CURRENT_LAYOUT_SCHEMA_VERSION,
    root: visit('ROOT'),
  };
}
