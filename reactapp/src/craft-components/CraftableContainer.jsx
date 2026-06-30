import React from 'react';
import { useNode } from '@craftjs/core';
import PropTypes from 'prop-types';

export function CraftableContainer({ children, className }) {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className={`min-h-[100px] border border-dashed border-gray-400 p-4 ${className}`}
    >
      {children}
    </div>
  );
}

// Isso resolve os erros de 'missing in props validation'
CraftableContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CraftableContainer.defaultProps = {
  children: null,
  className: '',
};

CraftableContainer.craft = {
  displayName: 'Container / Coluna',
  rules: { canMoveIn: () => true },
};
