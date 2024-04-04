import "@/styles/globals.css";
import "@fontsource/poppins";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import client from "@/lib/apolloClient";
import { Provider } from "react-redux";
import { persistor, store } from "../lib/redux/store";
import { ThemeProvider, CssBaseline } from "comp-library-vt-vp";
import theme from "../theme";

import { useEffect } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useAppDispatch } from "../lib/redux/hooks";
import { login } from "../lib/redux/authSlice";
import { PersistGate } from "redux-persist/integration/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <PersistGate loading={null} persistor={persistor}>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </PersistGate>
      </ApolloProvider>
    </ThemeProvider>
  );
}
