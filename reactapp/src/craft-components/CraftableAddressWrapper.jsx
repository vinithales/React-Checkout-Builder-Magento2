import React from 'react';
import { useNode } from '@craftjs/core';
import { AddressWrapper } from '@hyva/react-checkout/components/address';
import PropTypes from 'prop-types';

export function CraftableAddressWrapper({ children }) {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <AddressWrapper>{children}</AddressWrapper>
    </div>
  );
}

CraftableAddressWrapper.propTypes = {
  children: PropTypes.node,
};

CraftableAddressWrapper.defaultProps = {
  children: null,
};

CraftableAddressWrapper.craft = {
  displayName: 'Bloco de Wrapper de Endereço',
  isCanvas: true,
};
