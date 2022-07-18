import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import GraphFlow from './flow/App';


render(
  <React.StrictMode>
    <BrowserRouter><GraphFlow /></BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
