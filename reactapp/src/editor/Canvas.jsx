import React from 'react';
import PropTypes from 'prop-types';
import { Frame } from '@craftjs/core';
import { layoutToCraft } from './layoutAdapter';

export function Canvas({ layout, device }) {
  const widths = { desktop: '100%', tablet: '768px', mobile: '390px' };
  return (
    <main className="editor-canvas">
      <div
        className="editor-canvas__viewport"
        style={{ maxWidth: widths[device] }}
      >
        <Frame>{layoutToCraft(layout.root)}</Frame>
      </div>
    </main>
  );
}

Canvas.propTypes = {
  layout: PropTypes.object.isRequired,
  device: PropTypes.oneOf(['desktop', 'tablet', 'mobile']).isRequired,
};
