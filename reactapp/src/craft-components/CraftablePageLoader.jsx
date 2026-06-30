import React from 'react';
import { useNode } from '@craftjs/core';
import PageLoader from '@hyva/react-checkout/components/common/Loader';

export function CraftablePageLoader() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <PageLoader />
    </div>
  );
}

CraftablePageLoader.craft = {
  displayName: 'Bloco de Loader',
};
