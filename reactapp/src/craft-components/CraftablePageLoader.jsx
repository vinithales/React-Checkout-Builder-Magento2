import React from 'react';
import { useNode, useEditor } from '@craftjs/core';
import PageLoader from '@hyva/react-checkout/components/common/Loader';

export function CraftablePageLoader() {
  const {
    connectors: { connect, drag },
  } = useNode();

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  if (enabled) {
    return (
      <div
        ref={(ref) => connect(drag(ref))}
        className="craft-wrapper mb-4 opacity-50"
      >
        <div className="rounded-lg border-2 border-dashed border-slate-600 bg-slate-800 p-6 text-center text-sm font-semibold text-slate-400">
          Page Loader (Invisible in Editor)
        </div>
      </div>
    );
  }

  return (
    <div className="craft-wrapper mb-4">
      <PageLoader />
    </div>
  );
}

CraftablePageLoader.craft = {
  displayName: 'Bloco de Loader',
};
