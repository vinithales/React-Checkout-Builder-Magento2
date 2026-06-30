import React from 'react';
import { useNode } from '@craftjs/core';
import Totals from '@hyva/react-checkout/components/totals';

export function CraftableTotals() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <Totals />
    </div>
  );
}

CraftableTotals.craft = {
  displayName: 'Bloco de Total',
};
