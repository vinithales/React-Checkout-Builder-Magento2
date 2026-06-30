import React from 'react';
import { useNode } from '@craftjs/core';
import ShippingMethodsForm from '@hyva/react-checkout/components/shippingMethod';

export function CraftableShippingMethodsForm() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <ShippingMethodsForm />
    </div>
  );
}

CraftableShippingMethodsForm.craft = {
  displayName: 'Bloco de Métodos de Entrega',
};
