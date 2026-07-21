import React, { useEffect, useState } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';

import { config } from '@hyva/react-checkout/config';
import { aggregatedQueryRequest } from '@hyva/react-checkout/api';
import LocalStorage from '@hyva/react-checkout/utils/localStorage';
import useCheckoutFormContext from '@hyva/react-checkout/hook/useCheckoutFormContext';
import useCheckoutFormAppContext from '@hyva/react-checkout/components/CheckoutForm/hooks/useCheckoutFormAppContext';
import useCheckoutFormCartContext from '@hyva/react-checkout/components/CheckoutForm/hooks/useCheckoutFormCartContext';
import Message from '@hyva/react-checkout/components/common/Message';
import PageLoader from '@hyva/react-checkout/components/common/Loader';

import { CraftableContainer } from '../../craft-components/CraftableContainer';
import { CraftableLogin } from '../../craft-components/CraftableLogin';
import { CraftableAddressWrapper } from '../../craft-components/CraftableAddressWrapper';
import { CraftableShippingAddress } from '../../craft-components/CraftableShippingAddress';
import { CraftableBillingAddress } from '../../craft-components/CraftableBillingAddress';
import { CraftableShippingMethodsForm } from '../../craft-components/CraftableShippingMethodsForm';
import { CraftablePaymentMethod } from '../../craft-components/CraftablePaymentMethod';
import { CraftableCouponCode } from '../../craft-components/CraftableCouponCode';
import { CraftableTotals } from '../../craft-components/CraftableTotals';
import { CraftableCartItemsForm } from '../../craft-components/CraftableCartItemsForm';
import { CraftableStickyRightSidebar } from '../../craft-components/CraftableStickyRightSidebar';
import { CraftableMessage } from '../../craft-components/CraftableMessage';
import { CraftablePageLoader } from '../../craft-components/CraftablePageLoader';
import { CraftablePlaceOrder } from '../../craft-components/CraftablePlaceOrder';
import { CraftableCheckoutAgreements } from '../../craft-components/CraftableCheckoutAgreements';
import { CraftableButton } from '../../craft-components/CraftableButton';

function CheckoutFormSteps() {
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [savedLayout, setSavedLayout] = useState(null);
  const [isLayoutLoaded, setIsLayoutLoaded] = useState(false);

  const { storeAggregatedFormStates } = useCheckoutFormContext();
  const { orderId, storeAggregatedCartStates } = useCheckoutFormCartContext();
  const { pageLoader, appDispatch, setPageLoader, storeAggregatedAppStates } =
    useCheckoutFormAppContext();

  useEffect(() => {
    const layout = localStorage.getItem('hyva-checkout-builder-layout');
    if (layout) {
      setSavedLayout(layout);
    }
    setIsLayoutLoaded(true);
  }, []);

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

  if (!isLayoutLoaded) {
    return null;
  }

  if (orderId && config.isDevelopmentMode) {
    return (
      <div className="flex flex-col items-center justify-center mx-10 my-10">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <div className="flex flex-col items-center justify-center mt-4 space-y-3">
          <div>Your order is placed.</div>
          <div>{`Order Number: #${orderId}`}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="craft-editor-checkout-view">
      <Message />
      <Editor
        enabled={false}
        resolver={{
          CraftableContainer,
          CraftableLogin,
          CraftableAddressWrapper,
          CraftableShippingAddress,
          CraftableBillingAddress,
          CraftableShippingMethodsForm,
          CraftablePaymentMethod,
          CraftableCouponCode,
          CraftableTotals,
          CraftableCartItemsForm,
          CraftableStickyRightSidebar,
          CraftableMessage,
          CraftablePageLoader,
          CraftablePlaceOrder,
          CraftableCheckoutAgreements,
          CraftableButton,
        }}
      >
        <Frame data={savedLayout}>
          {!savedLayout && (
            <Element is={CraftableContainer} canvas>
              <CraftableMessage />
              <CraftablePageLoader />
              <CraftableLogin />
              <Element is={CraftableAddressWrapper} canvas>
                <CraftableShippingAddress />
                <CraftableBillingAddress />
                <CraftableShippingMethodsForm />
                <CraftablePaymentMethod />
                <CraftableCheckoutAgreements />
                <CraftableCouponCode />
                <CraftablePlaceOrder />
              </Element>
              <CraftableTotals />
              <Element is={CraftableStickyRightSidebar} canvas>
                <CraftableCartItemsForm />
              </Element>
            </Element>
          )}
        </Frame>
      </Editor>
      {pageLoader && <PageLoader />}
    </div>
  );
}

export default CheckoutFormSteps;
