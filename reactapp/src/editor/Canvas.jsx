import React from 'react';
import { Frame, Element } from '@craftjs/core';
import CraftableContainer from '../craft-components/CraftableContainer';
import { CraftableMessage } from '../craft-components/CraftableMessage';
import { CraftablePageLoader } from '../craft-components/CraftablePageLoader';
import { CraftableLogin } from '../craft-components/CraftableLogin';
import { CraftableAddressWrapper } from '../craft-components/CraftableAddressWrapper';
import { CraftableShippingAddress } from '../craft-components/CraftableShippingAddress';
import { CraftableBillingAddress } from '../craft-components/CraftableBillingAddress';
import { CraftableShippingMethodsForm } from '../craft-components/CraftableShippingMethodsForm';
import { CraftablePaymentMethod } from '../craft-components/CraftablePaymentMethod';
import { CraftableCheckoutAgreements } from '../craft-components/CraftableCheckoutAgreements';
import { CraftableCouponCode } from '../craft-components/CraftableCouponCode';
import { CraftablePlaceOrder } from '../craft-components/CraftablePlaceOrder';
import { CraftableTotals } from '../craft-components/CraftableTotals';
import { CraftableStickyRightSidebar } from '../craft-components/CraftableStickyRightSidebar';
import { CraftableCartItemsForm } from '../craft-components/CraftableCartItemsForm';

export function Canvas() {
    return (
        <Frame>
            <div className="canvas min-h-[calc(100vh-95px)] rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.8)]">
                <div className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-400">
                    Craft Canvas
                </div>
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
            </div>
        </Frame>
    );
}
              