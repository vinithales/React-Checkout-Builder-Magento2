import { useEffect } from 'react';
import useCheckoutFormContext from '@hyva/react-checkout/hook/useCheckoutFormContext';
import useCheckoutFormAppContext from '@hyva/react-checkout/components/CheckoutForm/hooks/useCheckoutFormAppContext';
import useCheckoutFormCartContext from '@hyva/react-checkout/components/CheckoutForm/hooks/useCheckoutFormCartContext';

const demoData = {
  customer: {
    customer: {},
    customerAddressList: [],
    defaultBillingAddress: '',
    defaultShippingAddress: '',
    isLoggedIn: false,
  },
  countryList: [
    { id: 'US', full_name_locale: 'United States', state_required: true },
  ],
  stateList: {},
  checkoutAgreements: [],
  cart: {
    loaded: true,
    id: 'checkout-builder-preview',
    email: 'customer@example.com',
    is_virtual: false,
    billing_address: null,
    shipping_address: {},
    selected_shipping_address: '',
    shipping_methods: [],
    selected_shipping_method: {},
    items: [],
    available_payment_methods: [
      { code: 'checkmo', title: 'Check / Money order' },
    ],
    selected_payment_method: { code: '', title: '' },
    applied_coupons: null,
    prices: {
      discounts: [],
      discountLabel: '',
      discountAmount: 0,
      hasDiscounts: false,
      subTotal: '$149.00',
      subTotalAmount: 149,
      grandTotal: '$149.00',
      grandTotalAmount: 149,
    },
  },
};

export default function DemoDataInitializer() {
  const { storeAggregatedFormStates } = useCheckoutFormContext();
  const { storeAggregatedCartStates } = useCheckoutFormCartContext();
  const { storeAggregatedAppStates } = useCheckoutFormAppContext();
  useEffect(() => {
    storeAggregatedCartStates(demoData);
    storeAggregatedAppStates(demoData);
    storeAggregatedFormStates(demoData);
  }, [
    storeAggregatedAppStates,
    storeAggregatedCartStates,
    storeAggregatedFormStates,
  ]);
  return null;
}
