import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';

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
  return (
    <div className="craft-editor">
      <Editor
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
        <Frame>
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
        </Frame>
      </Editor>
    </div>
  );
}

export default CheckoutFormSteps;
