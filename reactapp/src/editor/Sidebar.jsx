import React from 'react';
import { useEditor, Element } from '@craftjs/core';
import { CraftableContainer } from '../craft-components/CraftableContainer';
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

export function Sidebar() {
  const {
    connectors: { create },
  } = useEditor();

  const blocks = [
    {
      title: 'Layout Blocks',
      items: [
        {
          name: 'Container Column',
          component: <Element is={CraftableContainer} canvas />,
        },
        {
          name: 'Address Wrapper',
          component: <Element is={CraftableAddressWrapper} canvas />,
        },
        {
          name: 'Sticky Right Sidebar',
          component: <Element is={CraftableStickyRightSidebar} canvas />,
        },
      ],
    },
    {
      title: 'Checkout Components',
      items: [
        { name: 'Login Block', component: <CraftableLogin /> },
        { name: 'Shipping Address', component: <CraftableShippingAddress /> },
        { name: 'Billing Address', component: <CraftableBillingAddress /> },
        {
          name: 'Shipping Methods Form',
          component: <CraftableShippingMethodsForm />,
        },
        { name: 'Payment Method Form', component: <CraftablePaymentMethod /> },
        { name: 'Coupon Code Block', component: <CraftableCouponCode /> },
        { name: 'Cart Items Form', component: <CraftableCartItemsForm /> },
        {
          name: 'Checkout Agreements',
          component: <CraftableCheckoutAgreements />,
        },
        { name: 'Totals Summary', component: <CraftableTotals /> },
        { name: 'Place Order Button', component: <CraftablePlaceOrder /> },
        { name: 'System Message Block', component: <CraftableMessage /> },
        { name: 'Page Loader Block', component: <CraftablePageLoader /> },
      ],
    },
  ];

  return (
    <aside className="sidebar z-10 w-72 flex-shrink-0 border-r border-slate-800 bg-slate-950 px-4 py-5 text-slate-200">
      <div className="mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
          Components
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Drag elements into the canvas
        </p>
      </div>
      <div className="space-y-6">
        {blocks.map((cat) => (
          <div key={cat.title} className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              {cat.title}
            </h3>
            <div className="grid gap-2">
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  ref={(ref) => create(ref, item.component)}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white cursor-grab active:cursor-grabbing select-none"
                >
                  <svg
                    className="h-4 w-4 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
