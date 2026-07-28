import * as visualComponents from './components';
import { componentDefinitions } from './componentDefinitions';

function createRegistryEntry(type) {
  const definition = componentDefinitions[type];
  return {
    ...definition,
    // T02 owns the visual implementations. Falling back to the legacy visual
    // keeps the shared contract buildable until those exports are introduced.
    component:
      visualComponents[definition.componentName] || visualComponents.Container,
  };
}

export const componentRegistry = Object.freeze(
  Object.fromEntries(
    Object.keys(componentDefinitions).map((type) => [
      type,
      createRegistryEntry(type),
    ])
  )
);

export const componentGroups = Object.freeze([
  Object.freeze({
    label: 'Layout',
    types: Object.freeze([
      'FlexContainer',
      'ColumnContainer',
      'AddressWrapper',
      'StickySidebar',
    ]),
  }),
  Object.freeze({
    label: 'Checkout',
    types: Object.freeze([
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
    ]),
  }),
]);
