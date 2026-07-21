import React from 'react';
import 'react-app-polyfill/ie11';
import { createRoot } from 'react-dom/client';

import RootElement from '@hyva/react-checkout/utils/rootElement';
import AppDataProvider from '@hyva/react-checkout/context/App/AppDataProvider';
import CartDataProvider from '@hyva/react-checkout/context/Cart/CartDataProvider';
import CheckoutFormProvider from '@hyva/react-checkout/context/Form/CheckoutFormProvider';
import CheckoutForm from './components/CheckoutForm/CheckoutFormSteps';
import CheckoutEditor from './editor/CheckoutEditor';

import './index.css';

function Checkout() {
  const isEditor =
    window.location.pathname.includes('checkoutbuilder') ||
    new URLSearchParams(window.location.search).has('edit') ||
    new URLSearchParams(window.location.search).has('editor');

  return (
    <AppDataProvider>
      <CartDataProvider>
        <CheckoutFormProvider>
          {isEditor ? <CheckoutEditor /> : <CheckoutForm />}
        </CheckoutFormProvider>
      </CartDataProvider>
    </AppDataProvider>
  );
}

const root = createRoot(RootElement.getElement());

root.render(<Checkout />);
