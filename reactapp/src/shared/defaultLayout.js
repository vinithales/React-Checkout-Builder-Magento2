import {
  CURRENT_LAYOUT_SCHEMA_VERSION,
  COLUMN_CONTAINER_DEFAULTS,
} from './componentDefinitions';

export const defaultLayout = {
  schemaVersion: CURRENT_LAYOUT_SCHEMA_VERSION,
  root: {
    type: 'ColumnContainer',
    props: COLUMN_CONTAINER_DEFAULTS,
    children: [
      { type: 'Message', props: {}, children: [] },
      { type: 'Login', props: {}, children: [] },
      {
        type: 'AddressWrapper',
        props: {},
        children: [
          { type: 'ShippingAddress', props: {}, children: [] },
          { type: 'BillingAddress', props: {}, children: [] },
          { type: 'ShippingMethods', props: {}, children: [] },
          { type: 'PaymentMethod', props: {}, children: [] },
          { type: 'CheckoutAgreements', props: {}, children: [] },
          { type: 'CouponCode', props: {}, children: [] },
          { type: 'PlaceOrder', props: {}, children: [] },
        ],
      },
      { type: 'Totals', props: {}, children: [] },
      {
        type: 'StickySidebar',
        props: {},
        children: [{ type: 'CartItems', props: {}, children: [] }],
      },
    ],
  },
};
