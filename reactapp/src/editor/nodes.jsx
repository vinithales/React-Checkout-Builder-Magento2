import React from 'react';
import { useNode } from '@craftjs/core';
import PropTypes from 'prop-types';
import { componentRegistry } from '../shared/registry';

function createNode(type) {
  const definition = componentRegistry[type];
  function EditorNode({ children }) {
    const {
      connectors: { connect, drag },
      selected,
    } = useNode((node) => ({ selected: node.events.selected }));
    const Component = definition.component;
    return (
      <div
        ref={(element) => element && connect(drag(element))}
        className={`editor-node ${selected ? 'editor-node--selected' : ''}`}
        data-component={type}
      >
        <Component>{children}</Component>
      </div>
    );
  }
  EditorNode.propTypes = { children: PropTypes.node };
  EditorNode.defaultProps = { children: null };
  EditorNode.craft = {
    displayName: definition.label,
    isCanvas: Boolean(definition.container),
    custom: { layoutType: type },
    rules: {
      canMoveIn: (nodes) =>
        Boolean(definition.container) &&
        nodes.every((node) => componentRegistry[node.data.custom.layoutType]),
    },
  };
  return EditorNode;
}

export const ContainerNode = createNode('Container');
export const AddressWrapperNode = createNode('AddressWrapper');
export const StickySidebarNode = createNode('StickySidebar');
export const LoginNode = createNode('Login');
export const ShippingAddressNode = createNode('ShippingAddress');
export const BillingAddressNode = createNode('BillingAddress');
export const ShippingMethodsNode = createNode('ShippingMethods');
export const PaymentMethodNode = createNode('PaymentMethod');
export const CouponCodeNode = createNode('CouponCode');
export const CartItemsNode = createNode('CartItems');
export const CheckoutAgreementsNode = createNode('CheckoutAgreements');
export const TotalsNode = createNode('Totals');
export const PlaceOrderNode = createNode('PlaceOrder');
export const MessageNode = createNode('Message');
export const PageLoaderNode = createNode('PageLoader');

export const editorNodes = {
  Container: ContainerNode,
  AddressWrapper: AddressWrapperNode,
  StickySidebar: StickySidebarNode,
  Login: LoginNode,
  ShippingAddress: ShippingAddressNode,
  BillingAddress: BillingAddressNode,
  ShippingMethods: ShippingMethodsNode,
  PaymentMethod: PaymentMethodNode,
  CouponCode: CouponCodeNode,
  CartItems: CartItemsNode,
  CheckoutAgreements: CheckoutAgreementsNode,
  Totals: TotalsNode,
  PlaceOrder: PlaceOrderNode,
  Message: MessageNode,
  PageLoader: PageLoaderNode,
};

export const resolver = Object.fromEntries(
  Object.entries(editorNodes).map(([type, component]) => [
    `${type}Node`,
    component,
  ])
);
