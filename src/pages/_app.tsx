import { MantineProvider } from '@mantine/core'
import type { AppProps } from 'next/app'
import "../styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Component {...pageProps} />
    </MantineProvider>
  )
}
