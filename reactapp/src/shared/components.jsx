import React from 'react';
import PropTypes from 'prop-types';
import { AddressWrapper } from '@hyva/react-checkout/components/address';
import BillingAddress from '@hyva/react-checkout/components/billingAddress';
import CartItems from '@hyva/react-checkout/components/items';
import CheckoutAgreements from '@hyva/react-checkout/components/checkoutAgreements';
import CouponCode from '@hyva/react-checkout/components/couponCode';
import Login from '@hyva/react-checkout/components/login';
import Message from '@hyva/react-checkout/components/common/Message';
import PageLoader from '@hyva/react-checkout/components/common/Loader';
import PaymentMethod from '@hyva/react-checkout/components/paymentMethod';
import PlaceOrder from '@hyva/react-checkout/components/placeOrder';
import ShippingAddress from '@hyva/react-checkout/components/shippingAddress';
import ShippingMethods from '@hyva/react-checkout/components/shippingMethod';
import StickySidebar from '@hyva/react-checkout/components/StickyRightSidebar';
import Totals from '@hyva/react-checkout/components/totals';
import { normalizeComponentProps } from './componentDefinitions';

export function Container({ children }) {
  return <div>{children}</div>;
}

function spacingToCss(spacing) {
  return `${spacing.top}px ${spacing.right}px ${spacing.bottom}px ${spacing.left}px`;
}

function containerStyle(type, props) {
  const normalized = normalizeComponentProps(type, props);

  return {
    display: 'flex',
    flexDirection: type === 'ColumnContainer' ? 'column' : normalized.direction,
    flexWrap: type === 'FlexContainer' ? normalized.wrap : 'nowrap',
    justifyContent:
      type === 'FlexContainer' ? normalized.justifyContent : 'flex-start',
    alignItems: normalized.alignItems,
    gap: `${normalized.gap}px`,
    backgroundColor: normalized.backgroundColor,
    border: `1px solid ${normalized.borderColor}`,
    margin: spacingToCss(normalized.margin),
    padding: spacingToCss(normalized.padding),
    boxSizing: 'border-box',
  };
}

export function FlexContainer({ children, ...props }) {
  return <div style={containerStyle('FlexContainer', props)}>{children}</div>;
}

export function ColumnContainer({ children, ...props }) {
  return <div style={containerStyle('ColumnContainer', props)}>{children}</div>;
}

export function CheckoutAddressWrapper({ children }) {
  return <AddressWrapper>{children}</AddressWrapper>;
}

export function CheckoutStickySidebar({ children }) {
  return <StickySidebar>{children}</StickySidebar>;
}

Container.propTypes = { children: PropTypes.node };
FlexContainer.propTypes = {
  children: PropTypes.node,
  direction: PropTypes.oneOf(['row', 'column']),
  wrap: PropTypes.oneOf(['nowrap', 'wrap']),
  justifyContent: PropTypes.oneOf([
    'flex-start',
    'center',
    'flex-end',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  alignItems: PropTypes.oneOf(['stretch', 'flex-start', 'center', 'flex-end']),
  gap: PropTypes.number,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
  padding: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
};
ColumnContainer.propTypes = {
  children: PropTypes.node,
  alignItems: PropTypes.oneOf(['stretch', 'flex-start', 'center', 'flex-end']),
  gap: PropTypes.number,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
  padding: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
};
CheckoutAddressWrapper.propTypes = { children: PropTypes.node };
CheckoutStickySidebar.propTypes = { children: PropTypes.node };
Container.defaultProps = { children: null };
FlexContainer.defaultProps = {
  children: null,
  direction: undefined,
  wrap: undefined,
  justifyContent: undefined,
  alignItems: undefined,
  gap: undefined,
  backgroundColor: undefined,
  borderColor: undefined,
  margin: undefined,
  padding: undefined,
};
ColumnContainer.defaultProps = {
  children: null,
  alignItems: undefined,
  gap: undefined,
  backgroundColor: undefined,
  borderColor: undefined,
  margin: undefined,
  padding: undefined,
};
CheckoutAddressWrapper.defaultProps = { children: null };
CheckoutStickySidebar.defaultProps = { children: null };

export {
  BillingAddress,
  CartItems,
  CheckoutAgreements,
  CouponCode,
  Login,
  Message,
  PageLoader,
  PaymentMethod,
  PlaceOrder,
  ShippingAddress,
  ShippingMethods,
  Totals,
};
