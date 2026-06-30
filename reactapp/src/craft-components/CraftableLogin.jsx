import React from 'react';
import { useNode } from '@craftjs/core';
import Login from '@hyva/react-checkout/components/login';

export function CraftableLogin() {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))}>
      <Login />
    </div>
  );
}

CraftableLogin.craft = {
  displayName: 'Bloco de Login',
};
