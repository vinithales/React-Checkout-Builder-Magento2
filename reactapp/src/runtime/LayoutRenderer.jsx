import React from 'react';
import PropTypes from 'prop-types';
import { componentRegistry } from '../shared/registry';

function LayoutNode({ node }) {
  const Component = componentRegistry[node.type].component;
  return (
    <Component {...node.props}>
      {node.children.map((child, index) => (
        // Layout schema v1 has no persisted node id.
        // eslint-disable-next-line react/no-array-index-key
        <LayoutNode key={`${child.type}-${index}`} node={child} />
      ))}
    </Component>
  );
}

LayoutNode.propTypes = {
  node: PropTypes.shape({
    type: PropTypes.string.isRequired,
    props: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default LayoutNode;
