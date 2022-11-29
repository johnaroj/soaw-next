import React, { useState, useEffect } from "react";
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, LinearProgress } from '@mui/material';
import theme from '../styles/theme';
import { SessionProvider } from 'next-auth/react'
import { useRouter } from "next/router";
import Loader from "@/components/atoms/Loader";
import { Provider } from "@/context/Provider";


function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  const getLayout = Component.getLayout || ((page) => page)
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeError", (e) => setLoading(false));
    router.events.on("routeChangeStart", (e) => setLoading(true));
    router.events.on("routeChangeComplete", (e) => setLoading(false));

    return () => {
      router.events.off("routeChangeError", (e) => setLoading(false));
      router.events.off("routeChangeStart", (e) => setLoading(true));
      router.events.off("routeChangeComplete", (e) => setLoading(false));
    };
  }, [router.events]);
  return (
    <>
      {loading && <Loader loading={loading} />}
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <Provider>
          <Head>
            <title>Bijstand - SOAW</title>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </Provider>
      </SessionProvider>
    </>


  );
}

export default MyApp;
