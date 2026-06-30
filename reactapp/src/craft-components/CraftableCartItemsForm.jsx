import React from 'react';
import { useNode } from '@craftjs/core';
import CartItemsForm from '@hyva/react-checkout/components/items';

export function CraftableCartItemsForm() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <CartItemsForm />
    </div>
  );
}

CraftableCartItemsForm.craft = {
  displayName: 'Bloco de Itens do Carrinho',
};
