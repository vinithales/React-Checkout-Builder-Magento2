import React, { useEffect, useState } from 'react';
import { config } from '@hyva/react-checkout/config';
import { aggregatedQueryRequest } from '@hyva/react-checkout/api';
import LocalStorage from '@hyva/react-checkout/utils/localStorage';
import useCheckoutFormContext from '@hyva/react-checkout/hook/useCheckoutFormContext';
import useCheckoutFormAppContext from '@hyva/react-checkout/components/CheckoutForm/hooks/useCheckoutFormAppContext';
import useCheckoutFormCartContext from '@hyva/react-checkout/components/CheckoutForm/hooks/useCheckoutFormCartContext';
import PageLoader from '@hyva/react-checkout/components/common/Loader';
import { defaultLayout } from '../shared/defaultLayout';
import { parseLayout } from '../shared/layout';
import LayoutRenderer from './LayoutRenderer';

const layout = parseLayout(
  document.getElementById('react-checkout')?.dataset.checkout_layout,
  defaultLayout
);

export default function CheckoutRuntime() {
  const [requested, setRequested] = useState(false);
  const { storeAggregatedFormStates } = useCheckoutFormContext();
  const { orderId, storeAggregatedCartStates } = useCheckoutFormCartContext();
  const { pageLoader, appDispatch, setPageLoader, storeAggregatedAppStates } =
    useCheckoutFormAppContext();

  useEffect(() => {
    if (requested) return;
    if (!LocalStorage.getCartId()) LocalStorage.saveCartId(config.cartId);
    setRequested(true);
    setPageLoader(true);
    aggregatedQueryRequest(appDispatch)
      .then((data) => {
        storeAggregatedCartStates(data);
        storeAggregatedAppStates(data);
        storeAggregatedFormStates(data);
      })
      .catch((error) => console.error(error))
      .finally(() => setPageLoader(false));
  }, [
    appDispatch,
    requested,
    setPageLoader,
    storeAggregatedAppStates,
    storeAggregatedCartStates,
    storeAggregatedFormStates,
  ]);

  if (orderId && config.isDevelopmentMode) {
    return (
      <div className="m-10 text-center">{`Order Number: #${orderId}`}</div>
    );
  }
  return (
    <>
      <LayoutRenderer node={layout.root} />
      {pageLoader && <PageLoader />}
    </>
  );
}
