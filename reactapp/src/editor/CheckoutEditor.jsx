import React from 'react';
import { Editor } from '@craftjs/core';
import EditorLayout from './EditorLayout';
import { resolver } from './resolver';

function CheckoutEditor() {
  return (
    <div className="craft-editor">
        <Editor resolver={resolver}>
            <EditorLayout />
        </Editor>
    </div>
  );
}

export default CheckoutEditor;
