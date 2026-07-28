import React from 'react';
import { useNode } from '@craftjs/core';
import PropTypes from 'prop-types';
import { CraftableContainer } from '../craft-components/CraftableContainer';
import { getComponentDefaults } from '../shared/componentDefinitions';
import { componentRegistry } from '../shared/registry';

function createNode(type) {
  const definition = componentRegistry[type];
  const Component = definition.component;

  function EditorNode({ children, ...componentProps }) {
    const {
      connectors: { connect, drag },
      hovered,
      selected,
      dragged,
    } = useNode((node) => ({
      hovered: node.events.hovered,
      selected: node.events.selected,
      dragged: node.events.dragged,
    }));

    if (definition.container) {
      return (
        <CraftableContainer
          component={Component}
          componentProps={componentProps}
          type={type}
        >
          {children}
        </CraftableContainer>
      );
    }

    return (
      <div
        ref={(element) => element && connect(drag(element))}
        className={[
          'editor-node',
          hovered ? 'editor-node--hovered' : '',
          selected ? 'editor-node--selected' : '',
          dragged ? 'editor-node--dragging' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        data-component={type}
      >
        <Component {...componentProps}>{children}</Component>
      </div>
    );
  }
  EditorNode.propTypes = { children: PropTypes.node };
  EditorNode.defaultProps = { children: null };
  Object.assign(EditorNode.defaultProps, getComponentDefaults(type));
  EditorNode.craft = {
    displayName: definition.label,
    isCanvas: Boolean(definition.container),
    custom: { layoutType: type },
    rules: {
      canMoveIn: (nodes) =>
        Boolean(definition.container) &&
        nodes.every((node) => componentRegistry[node.data.custom.layoutType]),
    },
  };
  return EditorNode;
}

export const editorNodes = Object.fromEntries(
  Object.keys(componentRegistry).map((type) => [type, createNode(type)])
);

export const resolver = Object.fromEntries(
  Object.entries(editorNodes).map(([type, component]) => [
    `${type}Node`,
    component,
  ])
);
