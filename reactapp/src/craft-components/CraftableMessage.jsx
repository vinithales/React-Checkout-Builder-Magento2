import React from 'react';
import { useNode } from '@craftjs/core';
import Message from '@hyva/react-checkout/components/common/Message';

export function CraftableMessage() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <Message />
    </div>
  );
}

CraftableMessage.craft = {
  displayName: 'Bloco de Mensagem',
};
