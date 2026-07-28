import React from 'react';
import { useEditor, useNode } from '@craftjs/core';
import PropTypes from 'prop-types';

function getDropState(indicator, nodeId) {
  if (!indicator || indicator.placement?.parent?.id !== nodeId) return '';
  return indicator.error
    ? 'editor-node--drop-blocked'
    : 'editor-node--drop-allowed';
}

/**
 * Craft-only adapter for visual containers.
 *
 * The shared component remains unaware of selection, drag/drop and empty
 * states. Keeping those concerns in this wrapper prevents editor chrome from
 * leaking into the checkout Runtime.
 */
export function CraftableContainer({
  children,
  component: Component,
  componentProps,
  type,
}) {
  const {
    id,
    connectors: { connect, drag },
    hovered,
    selected,
    dragged,
  } = useNode((node) => ({
    id: node.id,
    hovered: node.events.hovered,
    selected: node.events.selected,
    dragged: node.events.dragged,
  }));
  const { indicator } = useEditor((state) => ({
    indicator: state.indicator,
  }));
  const empty = React.Children.count(children) === 0;
  const stateClasses = [
    hovered ? 'editor-node--hovered' : '',
    selected ? 'editor-node--selected' : '',
    dragged ? 'editor-node--dragging' : '',
    getDropState(indicator, id),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={(element) => element && connect(drag(element))}
      className={`editor-node editor-container-node ${stateClasses}`}
      data-component={type}
      data-empty={empty ? 'true' : 'false'}
    >
      <Component {...componentProps}>{children}</Component>
      {empty && (
        <div className="editor-container-empty" aria-hidden="true">
          Solte componentes aqui
        </div>
      )}
    </div>
  );
}

CraftableContainer.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType.isRequired,
  componentProps: PropTypes.object,
  type: PropTypes.string.isRequired,
};

CraftableContainer.defaultProps = {
  children: null,
  componentProps: {},
};
