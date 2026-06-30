import React from 'react';
import { useNode } from '@craftjs/core';
import CheckoutAgreements from '@hyva/react-checkout/components/checkoutAgreements';

export function CraftableCheckoutAgreements() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <CheckoutAgreements />
    </div>
  );
}

CraftableCheckoutAgreements.craft = {
  displayName: 'Bloco de Acordos de Checkout',
};
