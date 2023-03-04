import { Title } from '@mantine/core'
import Head from 'next/head'
import Hero from 'src/components/landing/Hero'
import { AppShell } from '@mantine/core'
import PageHeader from 'src/components/PageHeader'

export default function Landing() {
  return (
    <>
      <Head>
        <title>Tonic</title>
        <meta name="description" content="Tonic" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AppShell header={<PageHeader />}>
          <Hero />
        </AppShell>
      </main>
    </>
  )
}
