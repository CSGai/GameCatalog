import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import GetUser from './components/op_comp/GetUser';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GetUser/>
  </React.StrictMode>
);