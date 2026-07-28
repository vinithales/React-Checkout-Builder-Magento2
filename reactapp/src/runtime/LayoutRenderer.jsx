import React from 'react';
import PropTypes from 'prop-types';
import { componentRegistry } from '../shared/registry';

function LayoutNode({ node }) {
  const definition = componentRegistry[node.type];
  if (!definition || !definition.component) return null;

  const Component = definition.component;
  return (
    <Component {...node.props}>
      {node.children.map((child, index) => (
        // IDs are optional while version 1 layouts remain readable.
        // eslint-disable-next-line react/no-array-index-key
        <LayoutNode key={child.id || `${child.type}-${index}`} node={child} />
      ))}
    </Component>
  );
}

LayoutNode.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    props: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default LayoutNode;
