import React from 'react';
import { useNode } from '@craftjs/core';
import ShippingAddress from '@hyva/react-checkout/components/shippingAddress';

export function CraftableShippingAddress() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <ShippingAddress />
    </div>
  );
}

CraftableShippingAddress.craft = {
  displayName: 'Bloco de Endereço de Entrega',
};
