import React, { useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Editor, Frame, useEditor } from '@craftjs/core';
import {
  createComponentProps,
} from '../shared/layout';

// craftToLayout only consumes the Craft query. Its rendering resolver imports
// the full Hyvä application (including ESM-only dependencies), which is not
// needed in this integration suite.
jest.mock('./nodes', () => ({ editorNodes: {} }));

import { craftToLayout } from './layoutAdapter';

function CanvasNode({ children }) {
  return <div>{children}</div>;
}

CanvasNode.craft = {
  displayName: 'Test container',
  isCanvas: true,
  custom: { layoutType: 'ColumnContainer' },
};

function LeafNode() {
  return <span>Checkout field</span>;
}

LeafNode.craft = {
  displayName: 'Test checkout field',
  custom: { layoutType: 'Login' },
};

function EditorHarness({ expose }) {
  const editor = useEditor();
  useEffect(() => {
    expose(editor);
  }, [editor, expose]);
  return null;
}

function serializedNode({
  type,
  layoutType,
  props,
  parent,
  nodes = [],
  canvas = false,
}) {
  return {
    type: { resolvedName: type },
    isCanvas: canvas,
    props,
    displayName: type,
    custom: { layoutType },
    parent,
    hidden: false,
    nodes,
    linkedNodes: {},
  };
}

function initialTree() {
  return {
    ROOT: serializedNode({
      type: 'CanvasNode',
      layoutType: 'FlexContainer',
      props: createComponentProps('FlexContainer'),
      parent: null,
      nodes: ['left', 'right'],
      canvas: true,
    }),
    left: serializedNode({
      type: 'CanvasNode',
      layoutType: 'ColumnContainer',
      props: createComponentProps('ColumnContainer'),
      parent: 'ROOT',
      nodes: ['a'],
      canvas: true,
    }),
    right: serializedNode({
      type: 'CanvasNode',
      layoutType: 'ColumnContainer',
      props: createComponentProps('ColumnContainer'),
      parent: 'ROOT',
      nodes: ['b', 'c'],
      canvas: true,
    }),
    a: serializedNode({
      type: 'LeafNode',
      layoutType: 'Login',
      props: {},
      parent: 'left',
    }),
    b: serializedNode({
      type: 'LeafNode',
      layoutType: 'Login',
      props: {},
      parent: 'right',
    }),
    c: serializedNode({
      type: 'LeafNode',
      layoutType: 'Login',
      props: {},
      parent: 'right',
    }),
  };
}

describe('Craft structural editing and history integration', () => {
  let host;
  let root;
  let editor;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
    act(() => {
      root.render(
        <Editor resolver={{ CanvasNode, LeafNode }}>
          <Frame data={initialTree()} />
          <EditorHarness expose={(value) => (editor = value)} />
        </Editor>
      );
    });
    expect(editor).toBeDefined();
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    global.IS_REACT_ACT_ENVIRONMENT = false;
  });

  const childrenOf = (id) => editor.query.node(id).get().data.nodes;

  it('adds, nests and reorders nodes, with structural undo and redo', () => {
    const tree = editor.query.parseReactElement(<LeafNode />).toNodeTree(
      (node) => {
        node.id = 'new-field';
      }
    );

    act(() => editor.actions.addNodeTree(tree, 'left'));
    expect(childrenOf('left')).toEqual(['a', 'new-field']);
    expect(editor.query.node('new-field').get().data.parent).toBe('left');

    act(() => editor.actions.move('new-field', 'right', 1));
    expect(childrenOf('left')).toEqual(['a']);
    expect(childrenOf('right')).toEqual(['b', 'new-field', 'c']);
    expect(editor.query.node('new-field').get().data.parent).toBe('right');

    act(() => editor.actions.move('c', 'right', 0));
    expect(childrenOf('right')).toEqual(['c', 'b', 'new-field']);

    act(() => editor.actions.history.undo());
    expect(childrenOf('right')).toEqual(['b', 'new-field', 'c']);

    act(() => editor.actions.history.undo());
    expect(childrenOf('left')).toEqual(['a', 'new-field']);
    expect(childrenOf('right')).toEqual(['b', 'c']);

    act(() => editor.actions.history.redo());
    expect(childrenOf('left')).toEqual(['a']);
    expect(childrenOf('right')).toEqual(['b', 'new-field', 'c']);

    const persisted = craftToLayout(editor.query);
    expect(persisted.root.children[1].children.map(({ id }) => id)).toEqual([
      'b',
      'new-field',
      'c',
    ]);
  });

  it('tracks container value changes in undo/redo and serialization', () => {
    act(() => {
      editor.actions.setProp('left', (props) => {
        props.gap = 88;
        props.alignItems = 'center';
        props.backgroundColor = '#123456';
        props.margin = { top: 1, right: 2, bottom: 3, left: 4 };
      });
    });

    expect(editor.query.node('left').get().data.props).toMatchObject({
      gap: 88,
      alignItems: 'center',
      backgroundColor: '#123456',
      margin: { top: 1, right: 2, bottom: 3, left: 4 },
    });

    act(() => editor.actions.history.undo());
    expect(editor.query.node('left').get().data.props).toMatchObject({
      gap: 16,
      alignItems: 'stretch',
      backgroundColor: 'transparent',
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    act(() => editor.actions.history.redo());
    expect(editor.query.node('left').get().data.props).toMatchObject({
      gap: 88,
      alignItems: 'center',
      backgroundColor: '#123456',
      margin: { top: 1, right: 2, bottom: 3, left: 4 },
    });

    const persisted = craftToLayout(editor.query);
    expect(persisted.root.children[0].props).toMatchObject({
      gap: 88,
      alignItems: 'center',
      backgroundColor: '#123456',
      margin: { top: 1, right: 2, bottom: 3, left: 4 },
    });
  });
});
