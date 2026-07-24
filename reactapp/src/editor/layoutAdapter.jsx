import React from 'react';
import { Element } from '@craftjs/core';
import { editorNodes } from './nodes';

export function layoutToCraft(node) {
  const Node = editorNodes[node.type];
  const children = node.children.map((child, index) =>
    React.cloneElement(layoutToCraft(child), {
      // Layout schema v1 has no persisted node id.
      // eslint-disable-next-line react/no-array-index-key
      key: `${child.type}-${index}`,
    })
  );
  if (Node.craft.isCanvas) {
    return (
      <Element is={Node} canvas>
        {children}
      </Element>
    );
  }
  return <Node />;
}

export function craftToLayout(query) {
  const nodes = query.getSerializedNodes();
  const visit = (id) => {
    const node = nodes[id];
    const type = node.custom?.layoutType;
    if (!type) throw new Error(`Node ${id} has no persistent component type.`);
    return {
      type,
      props: {},
      children: (node.nodes || []).map(visit),
    };
  };
  return { schemaVersion: 1, root: visit('ROOT') };
}
