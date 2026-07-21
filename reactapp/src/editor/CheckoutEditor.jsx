import React, { useEffect, useState } from 'react';
import { Editor } from '@craftjs/core';

import { config } from '@hyva/react-checkout/config';
import { aggregatedQueryRequest } from '@hyva/react-checkout/api';
import LocalStorage from '@hyva/react-checkout/utils/localStorage';
import useCheckoutFormContext from '@hyva/react-checkout/hook/useCheckoutFormContext';
import useCheckoutFormAppContext from '@hyva/react-checkout/components/CheckoutForm/hooks/useCheckoutFormAppContext';
import useCheckoutFormCartContext from '@hyva/react-checkout/components/CheckoutForm/hooks/useCheckoutFormCartContext';
import PageLoader from '@hyva/react-checkout/components/common/Loader';

import EditorLayout from './EditorLayout';
import { resolver } from './resolver';

function CheckoutEditor() {
  const [isRequestSent, setIsRequestSent] = useState(false);
  const { storeAggregatedFormStates } = useCheckoutFormContext();
  const { storeAggregatedCartStates } = useCheckoutFormCartContext();
  const { pageLoader, appDispatch, setPageLoader, storeAggregatedAppStates } =
    useCheckoutFormAppContext();

  useEffect(() => {
    if (isRequestSent) {
      return;
    }

    if (!LocalStorage.getCartId()) {
      LocalStorage.saveCartId(config.cartId);
    }

    (async () => {
      try {
        setPageLoader(true);
        setIsRequestSent(true);
        const data = await aggregatedQueryRequest(appDispatch);
        storeAggregatedCartStates(data);
        storeAggregatedAppStates(data);
        storeAggregatedFormStates(data);
      } catch (error) {
        console.error(error);
      } finally {
        setPageLoader(false);
      }
    })();
  }, [
    appDispatch,
    isRequestSent,
    setPageLoader,
    storeAggregatedAppStates,
    storeAggregatedCartStates,
    storeAggregatedFormStates,
  ]);

  return (
    <div className="craft-editor">
      {pageLoader && <PageLoader />}
      <Editor resolver={resolver}>
        <EditorLayout />
      </Editor>
    </div>
  );
}

export default CheckoutEditor;
