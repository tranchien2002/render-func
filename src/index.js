import React from 'react';
import ReactDOM from 'react-dom';
import Fastclick from 'fastclick';
import App from './App';
import createStore from './store';
import initialState from './initialState';
import * as record from './record';
import './css/index.css';

let state = {
  initialState: { ...initialState },
  ...initialState,
};

let store = createStore(state);

function renderToDOM(state) {
  console.log('state', state);
  console.log('store', store.getState());
  return ReactDOM.render(
    <App state={state || store.getState()} actions={store.actions} record={record} />,
    document.getElementById('root')
  );
}

store.subscribe((data) => {
  let { actionType, currentState } = data;

  if (actionType === 'START_PLAY') {
    playing();
    return;
  }

  if (actionType === 'PLAYING' || actionType === 'FLY_UP') {
    renderToDOM();
    if (currentState.game.status === 'over') {
      stopPlaying();
    }
    return;
  }
});

let { PLAYING } = store.actions;
let requestID = null;
function playing() {
  requestID = requestAnimationFrame(playing);
  PLAYING();
}
function stopPlaying() {
  cancelAnimationFrame(requestID);
}

renderToDOM();

if ('ontouchstart' in document) {
  Fastclick.attach(document.body);
}
