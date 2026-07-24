import {
  BillingAddress,
  CartItems,
  CheckoutAddressWrapper,
  CheckoutAgreements,
  CheckoutStickySidebar,
  Container,
  CouponCode,
  Login,
  Message,
  PageLoader,
  PaymentMethod,
  PlaceOrder,
  ShippingAddress,
  ShippingMethods,
  Totals,
} from './components';
import { componentDefinitions } from './componentDefinitions';

export const componentRegistry = {
  Container: { ...componentDefinitions.Container, component: Container },
  AddressWrapper: {
    ...componentDefinitions.AddressWrapper,
    component: CheckoutAddressWrapper,
  },
  StickySidebar: {
    ...componentDefinitions.StickySidebar,
    component: CheckoutStickySidebar,
  },
  Login: { ...componentDefinitions.Login, component: Login },
  ShippingAddress: {
    ...componentDefinitions.ShippingAddress,
    component: ShippingAddress,
  },
  BillingAddress: {
    ...componentDefinitions.BillingAddress,
    component: BillingAddress,
  },
  ShippingMethods: {
    ...componentDefinitions.ShippingMethods,
    component: ShippingMethods,
  },
  PaymentMethod: {
    ...componentDefinitions.PaymentMethod,
    component: PaymentMethod,
  },
  CouponCode: { ...componentDefinitions.CouponCode, component: CouponCode },
  CartItems: { ...componentDefinitions.CartItems, component: CartItems },
  CheckoutAgreements: {
    ...componentDefinitions.CheckoutAgreements,
    component: CheckoutAgreements,
  },
  Totals: { ...componentDefinitions.Totals, component: Totals },
  PlaceOrder: { ...componentDefinitions.PlaceOrder, component: PlaceOrder },
  Message: { ...componentDefinitions.Message, component: Message },
  PageLoader: { ...componentDefinitions.PageLoader, component: PageLoader },
};

export const componentGroups = [
  {
    label: 'Layout',
    types: ['Container', 'AddressWrapper', 'StickySidebar'],
  },
  {
    label: 'Checkout',
    types: [
      'Login',
      'ShippingAddress',
      'BillingAddress',
      'ShippingMethods',
      'PaymentMethod',
      'CouponCode',
      'CartItems',
      'CheckoutAgreements',
      'Totals',
      'PlaceOrder',
      'Message',
      'PageLoader',
    ],
  },
];
