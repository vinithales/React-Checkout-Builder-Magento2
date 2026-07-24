import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Editor, useEditor } from '@craftjs/core';
import PropTypes from 'prop-types';
import { defaultLayout } from '../shared/defaultLayout';
import { parseLayout } from '../shared/layout';
import EditorLayout from './EditorLayout';
import { craftToLayout } from './layoutAdapter';
import { resolver } from './nodes';
import { loadLayout, publishLayout, saveLayout } from './api';

function ConnectedEditor({ config, record, onRecord, storeId, onStore }) {
  const [device, setDevice] = useState('desktop');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: 'Ready' });
  const initialized = useRef(false);
  const { query, revision } = useEditor((state) => ({
    revision: state.nodes,
  }));

  useEffect(() => {
    if (initialized.current) {
      setDirty(true);
    } else {
      initialized.current = true;
    }
  }, [revision]);

  const currentLayout = useCallback(() => craftToLayout(query), [query]);
  const run = async (operation, success) => {
    setSaving(true);
    setStatus({ type: 'idle', message: 'Working…' });
    try {
      const next = await operation();
      onRecord({ ...record, ...next });
      setDirty(false);
      setStatus({ type: 'success', message: success });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const save = () =>
    run(
      () => saveLayout(config, storeId, currentLayout(), record.version),
      'Draft saved'
    );
  const publish = async () => {
    if (dirty) {
      setStatus({
        type: 'error',
        message: 'Save the draft before publishing.',
      });
      return;
    }
    await run(
      () => publishLayout(config, storeId, record.version),
      'Layout published'
    );
  };

  useEffect(() => {
    const warn = (event) => {
      if (dirty) {
        event.preventDefault();
        // Required by Chromium to trigger its native leave-page prompt.
        // eslint-disable-next-line no-param-reassign
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  return (
    <EditorLayout
      layout={record.layout}
      stores={config.stores}
      storeId={storeId}
      onStore={onStore}
      inherited={record.inherited}
      status={status}
      device={device}
      onDevice={setDevice}
      onSave={save}
      onPublish={publish}
      onPreview={() =>
        window.open(
          config.stores.find((store) => store.value === storeId).checkoutUrl,
          '_blank'
        )
      }
      saving={saving}
      dirty={dirty}
    />
  );
}

ConnectedEditor.propTypes = {
  config: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  onRecord: PropTypes.func.isRequired,
  storeId: PropTypes.number.isRequired,
  onStore: PropTypes.func.isRequired,
};

export default function CheckoutEditor({ config }) {
  const [storeId, setStoreId] = useState(config.storeId);
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');
  const reload = useCallback(
    (nextStore) => {
      setRecord(null);
      setError('');
      loadLayout(config, nextStore)
        .then((data) =>
          setRecord({
            layout: parseLayout(data.json, defaultLayout),
            version: data.version,
            inherited: data.inherited,
          })
        )
        .catch((requestError) => setError(requestError.message));
    },
    [config]
  );
  useEffect(() => reload(storeId), [reload, storeId]);
  if (error) return <div className="editor-fatal">{error}</div>;
  if (!record) return <div className="editor-loading">Loading editor…</div>;
  return (
    <Editor key={storeId} resolver={resolver}>
      <ConnectedEditor
        config={config}
        record={record}
        onRecord={setRecord}
        storeId={storeId}
        onStore={setStoreId}
      />
    </Editor>
  );
}

CheckoutEditor.propTypes = { config: PropTypes.object.isRequired };
