import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store.js";
import App from "./App";
import { LoaderProvider } from "./Reducers/LoaderProvider.js";
import GlobalLoader from "./component/GlobalLoader.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <LoaderProvider>
    <App />
    <GlobalLoader />
    </LoaderProvider>
  </Provider>
);
