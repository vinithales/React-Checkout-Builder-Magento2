import React from 'react';
import { createRoot } from 'react-dom/client';
import AppDataProvider from '@hyva/react-checkout/context/App/AppDataProvider';
import CartDataProvider from '@hyva/react-checkout/context/Cart/CartDataProvider';
import CheckoutFormProvider from '@hyva/react-checkout/context/Form/CheckoutFormProvider';
import CheckoutEditor from './CheckoutEditor';
import DemoDataInitializer from './DemoDataInitializer';
import '../index.css';
import './styles.css';

const element = document.getElementById('checkout-builder-editor');
const config = JSON.parse(element.dataset.editor_config || '{}');

createRoot(element).render(
  <AppDataProvider>
    <CartDataProvider>
      <CheckoutFormProvider>
        <DemoDataInitializer />
        <CheckoutEditor config={config} />
      </CheckoutFormProvider>
    </CartDataProvider>
  </AppDataProvider>
);
