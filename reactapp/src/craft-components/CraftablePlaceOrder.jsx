import React from 'react';
import { useNode } from '@craftjs/core';
import PlaceOrder from '@hyva/react-checkout/components/placeOrder';

export function CraftablePlaceOrder() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <PlaceOrder />
    </div>
  );
}

CraftablePlaceOrder.craft = {
  displayName: 'Bloco de Finalizar Pedido',
};
