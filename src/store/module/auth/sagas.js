/* eslint-disable no-unused-vars */
import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import { get } from 'lodash';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/api';

function* loginRequest({ payload }) {
  try {
    const response = yield call(axios.post, '/tokens', payload);
    yield put(actions.LoginSuccess({ ...response.data }));

    toast.success('Você fez login');
    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;

    payload.history.push(payload.prevPath);
  } catch (err) {
    console.log(err);
    toast.error('Usuário ou senha inválidos.');

    yield put(actions.LoginFailure());
  }
}

function persistRehydrate({ payload }) {
  const token = get(payload, 'auth.token', '');
  if (!token) return;
  axios.defaults.headers.Authorization = `Bearer ${token}`;
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
]);
