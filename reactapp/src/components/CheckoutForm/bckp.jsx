import React, { useEffect, useMemo, useState } from 'react';
import { useFormikContext } from 'formik';
import { bool, func, number } from 'prop-types';

import Login from '@hyva/react-checkout/components/login';
import Totals from '@hyva/react-checkout/components/totals';
import CartItemsForm from '@hyva/react-checkout/components/items';
import PlaceOrder from '@hyva/react-checkout/components/placeOrder';
import CouponCode from '@hyva/react-checkout/components/couponCode';
import Message from '@hyva/react-checkout/components/common/Message';
import Button from '@hyva/react-checkout/components/common/Button';
import PageLoader from '@hyva/react-checkout/components/common/Loader';
import { AddressWrapper } from '@hyva/react-checkout/components/address';
import PaymentMethod from '@hyva/react-checkout/components/paymentMethod';
import BillingAddress from '@hyva/react-checkout/components/billingAddress';
import ShippingAddress from '@hyva/react-checkout/components/shippingAddress';
import ShippingMethodsForm from '@hyva/react-checkout/components/shippingMethod';
import StickyRightSidebar from '@hyva/react-checkout/components/StickyRightSidebar';
import CheckoutAgreements from '@hyva/react-checkout/components/checkoutAgreements';
import { config } from '@hyva/react-checkout/config';
import { aggregatedQueryRequest } from '@hyva/react-checkout/api';
import LocalStorage from '@hyva/react-checkout/utils/localStorage';
import useCheckoutFormContext from '@hyva/react-checkout/hook/useCheckoutFormContext';
import useCheckoutFormAppContext from '@hyva/react-checkout/components/CheckoutForm/hooks/useCheckoutFormAppContext';
import useCheckoutFormCartContext from '@hyva/react-checkout/components/CheckoutForm/hooks/useCheckoutFormCartContext';
import {
  hasLoginErrors,
  hasShippingAddressErrors,
  hasBillingAddressErrors,
  hasShippingMethodErrors,
} from '@hyva/react-checkout/components/placeOrder/utility';

const STEP_INFO = {
  customer: 1,
  shippingMethod: 2,
  payment: 3,
};

function getStepTitle(step, isVirtualCart) {
  if (step === STEP_INFO.customer) {
    return 'Identificação e Endereço';
  }

  if (!isVirtualCart && step === STEP_INFO.shippingMethod) {
    return 'Método de Entrega';
  }

  return 'Pagamento e Revisão';
}

function StepActions({ step, totalSteps, onPrev, onNext, isLoading }) {
  const canGoBack = step > STEP_INFO.customer;
  const isLastStep = step >= totalSteps;

  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      {canGoBack && (
        <Button variant="secondary" click={onPrev} disable={isLoading}>
          Voltar
        </Button>
      )}

      {!isLastStep && (
        <Button variant="primary" click={onNext} disable={isLoading}>
          Continuar
        </Button>
      )}
    </div>
  );
}

StepActions.propTypes = {
  step: number.isRequired,
  totalSteps: number.isRequired,
  onPrev: func.isRequired,
  onNext: func.isRequired,
  isLoading: bool.isRequired,
};

function CheckoutFormSteps() {
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEP_INFO.customer);

  const { errors, values } = useFormikContext();
  const { storeAggregatedFormStates } = useCheckoutFormContext();
  const { orderId, isVirtualCart, storeAggregatedCartStates } =
    useCheckoutFormCartContext();
  const {
    pageLoader,
    appDispatch,
    setErrorMessage,
    setPageLoader,
    storeAggregatedAppStates,
  } = useCheckoutFormAppContext();

  const totalSteps = useMemo(
    () => (isVirtualCart ? STEP_INFO.shippingMethod : STEP_INFO.payment),
    [isVirtualCart]
  );

  const stepTitle = useMemo(
    () => getStepTitle(currentStep, isVirtualCart),
    [currentStep, isVirtualCart]
  );

  useEffect(() => {
    if (isVirtualCart && currentStep === STEP_INFO.shippingMethod) {
      setCurrentStep(STEP_INFO.payment);
    }
  }, [currentStep, isVirtualCart]);

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

  const handleNext = () => {
    if (currentStep === STEP_INFO.customer) {
      if (hasLoginErrors(errors)) {
        setErrorMessage('Preencha os dados de login/e-mail para continuar.');
        return;
      }

      if (hasShippingAddressErrors(errors)) {
        setErrorMessage('Preencha o endereço de entrega para continuar.');
        return;
      }

      if (hasBillingAddressErrors(errors, values, isVirtualCart)) {
        setErrorMessage('Preencha o endereço de cobrança para continuar.');
        return;
      }

      setCurrentStep(
        isVirtualCart ? STEP_INFO.payment : STEP_INFO.shippingMethod
      );
      return;
    }

    if (!isVirtualCart && currentStep === STEP_INFO.shippingMethod) {
      if (hasShippingMethodErrors(errors)) {
        setErrorMessage('Selecione o método de entrega para continuar.');
        return;
      }

      setCurrentStep(STEP_INFO.payment);
    }
  };

  const handlePrev = () => {
    if (currentStep === STEP_INFO.payment) {
      setCurrentStep(
        isVirtualCart ? STEP_INFO.customer : STEP_INFO.shippingMethod
      );
      return;
    }

    if (currentStep === STEP_INFO.shippingMethod) {
      setCurrentStep(STEP_INFO.customer);
    }
  };

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
    <>
      <Message />
      <div className="flex justify-center">
        <div className="container">
          <div className="flex items-center justify-between mt-4 mb-2">
            <h2 className="text-lg font-semibold">{stepTitle}</h2>
            <span className="text-sm opacity-70">
              Etapa {currentStep} de {totalSteps}
            </span>
          </div>

          <div className="flex flex-col my-6 space-y-2 md:flex-row md:space-y-0">
            <div className="w-full lg:w-3/5 md:mr-2">
              <div className="w-full space-y-2 md:max-w-md xl:max-w-full">
                {currentStep === STEP_INFO.customer && (
                  <>
                    <Login />
                    <AddressWrapper>
                      {!isVirtualCart && <ShippingAddress />}
                      <BillingAddress />
                    </AddressWrapper>
                  </>
                )}

                {!isVirtualCart && currentStep === STEP_INFO.shippingMethod && (
                  <AddressWrapper>
                    <ShippingMethodsForm />
                  </AddressWrapper>
                )}

                {currentStep === STEP_INFO.payment && (
                  <AddressWrapper>
                    <PaymentMethod />
                    <CouponCode />
                  </AddressWrapper>
                )}

                <StepActions
                  step={currentStep}
                  totalSteps={totalSteps}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  isLoading={pageLoader}
                />
              </div>
            </div>

            <StickyRightSidebar>
              <CartItemsForm />
              <Totals />
              {currentStep === STEP_INFO.payment && (
                <>
                  <CheckoutAgreements />
                  <PlaceOrder />
                </>
              )}
            </StickyRightSidebar>
          </div>
          {pageLoader && <PageLoader />}
        </div>
      </div>
    </>
  );
}

export default CheckoutFormSteps;
