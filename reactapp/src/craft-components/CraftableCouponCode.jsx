import React from 'react';
import { useNode } from '@craftjs/core';
import CouponCode from '@hyva/react-checkout/components/couponCode';

export function CraftableCouponCode() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <CouponCode />
    </div>
  );
}

CraftableCouponCode.craft = {
  displayName: 'Bloco de Cupom',
};
