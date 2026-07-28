import React from 'react';
import { useEditor } from '@craftjs/core';
import PropTypes from 'prop-types';
import {
  ALIGN_ITEMS_VALUES,
  FLEX_DIRECTIONS,
  FLEX_WRAPS,
  JUSTIFY_CONTENT_VALUES,
  normalizeColor,
  normalizeComponentProps,
  normalizeSpacing,
} from '../shared/componentDefinitions';

const CONTAINER_TYPES = ['FlexContainer', 'ColumnContainer'];
const SPACING_SIDES = ['top', 'right', 'bottom', 'left'];

const HUMAN_LABELS = {
  top: 'Top',
  right: 'Right',
  bottom: 'Bottom',
  left: 'Left',
  row: 'Row',
  column: 'Column',
  nowrap: 'No wrap',
  wrap: 'Wrap',
  stretch: 'Stretch',
  'flex-start': 'Start',
  center: 'Center',
  'flex-end': 'End',
  'space-between': 'Space between',
  'space-around': 'Space around',
  'space-evenly': 'Space evenly',
};

function SelectControl({ id, label, value, values, onChange }) {
  return (
    <label htmlFor={id}>
      <span>{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {values.map((option) => (
          <option key={option} value={option}>
            {HUMAN_LABELS[option] || option}
          </option>
        ))}
      </select>
    </label>
  );
}

SelectControl.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

function NumberControl({ id, label, value, min, max, onChange }) {
  return (
    <label htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

NumberControl.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

function ColorControl({ id, label, value, onChange }) {
  const transparent = value === 'transparent';
  return (
    <fieldset>
      <legend>{label}</legend>
      <input
        id={id}
        type="color"
        value={transparent ? '#ffffff' : value}
        disabled={transparent}
        onChange={(event) => onChange(normalizeColor(event.target.value))}
      />
      <label htmlFor={`${id}-transparent`}>
        <input
          id={`${id}-transparent`}
          type="checkbox"
          checked={transparent}
          onChange={(event) =>
            onChange(event.target.checked ? 'transparent' : '#ffffff')
          }
        />
        Transparent
      </label>
    </fieldset>
  );
}

ColorControl.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function SpacingControl({ id, label, value, onChange }) {
  return (
    <fieldset>
      <legend>{label}</legend>
      {SPACING_SIDES.map((side) => (
        <NumberControl
          key={side}
          id={`${id}-${side}`}
          label={HUMAN_LABELS[side]}
          value={value[side]}
          min={0}
          max={300}
          onChange={(sideValue) =>
            onChange(
              normalizeSpacing({
                ...value,
                [side]: sideValue,
              })
            )
          }
        />
      ))}
    </fieldset>
  );
}

SpacingControl.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.shape({
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export function Inspector() {
  const { selected, actions } = useEditor((state, query) => {
    const id = [...state.events.selected][0];
    if (!id) return { selected: null };
    const node = state.nodes[id];
    return {
      selected: {
        id,
        name: node.data.displayName,
        type: node.data.custom?.layoutType,
        props: node.data.props,
        deletable: query.node(id).isDeletable(),
      },
    };
  });

  if (!selected) return null;

  const isContainer = CONTAINER_TYPES.includes(selected.type);
  const isFlexContainer = selected.type === 'FlexContainer';
  const updateProperty = (property, value) => {
    const normalized = normalizeComponentProps(selected.type, {
      ...selected.props,
      [property]: value,
    });
    actions.setProp(selected.id, (props) => {
      // Craft records this controlled mutation as part of its undo/redo history.
      // eslint-disable-next-line no-param-reassign
      props[property] = normalized[property];
    });
  };

  return (
    <aside className="editor-inspector">
      <span className="editor-kicker">Selected component</span>
      <h2>{selected.name}</h2>
      {isContainer ? (
        <>
          <details className="inspector-section" open>
            <summary>Layout</summary>
            {isFlexContainer && (
              <>
                <SelectControl
                  id={`${selected.id}-direction`}
                  label="Direction"
                  value={selected.props.direction}
                  values={FLEX_DIRECTIONS}
                  onChange={(value) => updateProperty('direction', value)}
                />
                <SelectControl
                  id={`${selected.id}-wrap`}
                  label="Wrap"
                  value={selected.props.wrap}
                  values={FLEX_WRAPS}
                  onChange={(value) => updateProperty('wrap', value)}
                />
                <SelectControl
                  id={`${selected.id}-justify`}
                  label="Justify content"
                  value={selected.props.justifyContent}
                  values={JUSTIFY_CONTENT_VALUES}
                  onChange={(value) => updateProperty('justifyContent', value)}
                />
              </>
            )}
            <SelectControl
              id={`${selected.id}-align`}
              label="Align items"
              value={selected.props.alignItems}
              values={ALIGN_ITEMS_VALUES}
              onChange={(value) => updateProperty('alignItems', value)}
            />
            <NumberControl
              id={`${selected.id}-gap`}
              label="Gap"
              value={selected.props.gap}
              min={0}
              max={200}
              onChange={(value) => updateProperty('gap', value)}
            />
          </details>
          <details className="inspector-section">
            <summary>Style</summary>
            <ColorControl
              id={`${selected.id}-background`}
              label="Background color"
              value={selected.props.backgroundColor}
              onChange={(value) => updateProperty('backgroundColor', value)}
            />
            <ColorControl
              id={`${selected.id}-border`}
              label="Border color"
              value={selected.props.borderColor}
              onChange={(value) => updateProperty('borderColor', value)}
            />
          </details>
          <details className="inspector-section">
            <summary>Advanced</summary>
            <SpacingControl
              id={`${selected.id}-margin`}
              label="Margin"
              value={selected.props.margin}
              onChange={(value) => updateProperty('margin', value)}
            />
            <SpacingControl
              id={`${selected.id}-padding`}
              label="Padding"
              value={selected.props.padding}
              onChange={(value) => updateProperty('padding', value)}
            />
          </details>
        </>
      ) : (
        <div className="inspector-section">
          <h3>Content</h3>
          <p>This component has no editable properties.</p>
        </div>
      )}
      {selected.deletable && (
        <button
          type="button"
          className="danger"
          onClick={() => actions.delete(selected.id)}
        >
          Delete component
        </button>
      )}
    </aside>
  );
}
