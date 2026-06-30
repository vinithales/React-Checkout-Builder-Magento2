import React from 'react';
import { useNode } from '@craftjs/core';
import StickyRightSidebar from '@hyva/react-checkout/components/StickyRightSidebar';
import PropTypes from 'prop-types';

export function CraftableStickyRightSidebar({ children }) {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <StickyRightSidebar>{children}</StickyRightSidebar>
    </div>
  );
}

CraftableStickyRightSidebar.propTypes = {
  children: PropTypes.node,
};

CraftableStickyRightSidebar.defaultProps = {
  children: null,
};

CraftableStickyRightSidebar.craft = {
  displayName: 'Bloco de Sidebar Direita',
  isCanvas: true,
};
