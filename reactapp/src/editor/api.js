function body(config, values) {
  const data = new URLSearchParams({ form_key: config.formKey });
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

async function request(url, options) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    ...options,
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Checkout Builder request failed.');
  }
  return payload.layout;
}

export const loadLayout = (config, storeId) =>
  request(`${config.urls.load}?store_id=${storeId}`, { method: 'GET' });

export const saveLayout = (config, storeId, layout, version) =>
  request(config.urls.save, {
    method: 'POST',
    body: body(config, {
      store_id: storeId,
      layout: JSON.stringify(layout),
      version,
    }),
  });

export const publishLayout = (config, storeId, version) =>
  request(config.urls.publish, {
    method: 'POST',
    body: body(config, { store_id: storeId, version }),
  });
