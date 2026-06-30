import React from 'react';
import { useNode } from '@craftjs/core';
import BillingAddress from '@hyva/react-checkout/components/billingAddress';

export function CraftableBillingAddress() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <BillingAddress />
    </div>
  );
}

CraftableBillingAddress.craft = {
  displayName: 'Bloco de Endereço de Cobrança',
};
