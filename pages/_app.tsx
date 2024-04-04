import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import client from "@/lib/apolloClient";
import { Provider } from "react-redux";
import { store } from "../lib/redux/store";
import { ThemeProvider, CssBaseline } from "comp-library-vt-vp";
import theme from "../theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ApolloProvider>
    </ThemeProvider>
  );
}
