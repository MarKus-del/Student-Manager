import * as types from '../types';

export function clicaButaoRequest() {
  return {
    type: types.BOTAO_CLICADO_REQUEST,
  };
}

export function clicaButaoSuccess() {
  return {
    type: types.BOTAO_CLICADO_SUCCESS,
  };
}

export function clicaButaoFailure() {
  return {
    type: types.BOTAO_CLICADO_FAILURE,
  };
}
