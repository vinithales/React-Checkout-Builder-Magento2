import React from 'react';
import { useNode } from '@craftjs/core';
import Button from '@hyva/react-checkout/components/common/Button';
import PropTypes from 'prop-types';

export function CraftableButton({ children }) {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))} className="craft-wrapper mb-4">
      <Button>{children}</Button>
    </div>
  );
}

CraftableButton.propTypes = {
  children: PropTypes.node,
};

CraftableButton.defaultProps = {
  children: 'Botão',
};

CraftableButton.craft = {
  displayName: 'Bloco de Botão',
};
