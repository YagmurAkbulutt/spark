import api from './api';

export async function getRequest(URL, params) {
  const response = await api.get(URL, params);
  return response;
}
export async function postRequest(URL, payload) {
  const response = await api.post(URL, payload);
  return response;
}

export async function patchRequest(URL, payload, params = {}) {
  const response = await api.patch(URL, payload, {
    params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
}
