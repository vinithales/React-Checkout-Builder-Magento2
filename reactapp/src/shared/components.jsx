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

export function Container({ children }) {
  return <div className="min-h-[100px] space-y-3">{children}</div>;
}

export function CheckoutAddressWrapper({ children }) {
  return <AddressWrapper>{children}</AddressWrapper>;
}

export function CheckoutStickySidebar({ children }) {
  return <StickySidebar>{children}</StickySidebar>;
}

Container.propTypes = { children: PropTypes.node };
CheckoutAddressWrapper.propTypes = { children: PropTypes.node };
CheckoutStickySidebar.propTypes = { children: PropTypes.node };
Container.defaultProps = { children: null };
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
