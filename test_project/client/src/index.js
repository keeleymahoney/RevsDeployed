import React from 'react';
import ReactDOM from 'react-dom/client';
// import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//import { BrowserRouter, Route, Switch } from "react-router-dom";

// import Ingredients from "./Ingredients";

// const rootElement = document.getElementById("root");
// const root = ReactDOM.createRoot(rootElement);
// root.render(
//    <BrowserRouter>
//     <Switch>
//      <Route exact path="/" component={App} />
//      <Route path="/Ingredients" component={Ingredients} />
//    </Switch>
//    </BrowserRouter>
//  );

const root = ReactDOM.createRoot(document.getElementById('root'));
/**
 * Renders the root component of the application into the DOM.
 * Uses React StrictMode for additional checks in development mode.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ReactDOM.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>,
//   document.getElementByID("root")
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
