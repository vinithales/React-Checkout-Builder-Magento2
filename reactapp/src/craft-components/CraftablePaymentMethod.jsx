import React from 'react';
import { useNode } from '@craftjs/core';
import PaymentMethod from '@hyva/react-checkout/components/paymentMethod';

export function CraftablePaymentMethod() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <PaymentMethod />
    </div>
  );
}

CraftablePaymentMethod.craft = {
  displayName: 'Bloco de Método de Pagamento',
};
