import React from 'react';
import Head from 'next/head';

import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
JavascriptTimeAgo.locale(en);

const CustomHead = (props) => {
  const title = props.title ? props.title : 'The Superstitious Network';

  return (
    <Head>
      <meta charSet="utf-8" />

      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#ffffff" />

      <title>{title}</title>
      <meta name="description"
        content="Get your daily dose of superstition, from all around the world! Irrational, funny or perfectly logic, we have them all!" />
      <meta name="keywords"
        content="superstition, superstitions, personal superstition, general superstition, beliefs, irrational beliefs, worldwide beliefs, superstitious network" />

      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://superstitious.network/" />
      <meta property="og:image" content="https://superstitious.network/images/superstitious-network.png" />
      <meta property="og:description"
        content="Get your daily dose of superstition, from all around the world! Irrational, funny or perfectly logic, we have them all!" />
      <meta property="og:site_name" content="The Superstitious Network" />
      <meta property="fb:app_id" content="355244101959044" />
      <meta property="fb:admins" content="1045891216" />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description"
        content="Get your daily dose of superstition, from all around the world! Irrational, funny or perfectly logic, we have them all!" />
      <meta name="twitter:image" content="https://superstitious.network/images/superstitious-network.png" />
      <meta name="twitter:site" content="@superstitiousnw" />
      <meta name="twitter:image:alt" content="The Superstitious Network" />
      <meta name="twitter:card" content="summary" />

      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"
        integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossOrigin="anonymous" />
      <link rel="manifest" href="/manifest.json" />

      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-131413870-1"></script>
      <script dangerouslySetInnerHTML={{
        __html: `window.dataLayer = window.dataLayer || [];function gtag() {dataLayer.push(arguments); }gtag('js', new Date());gtag('config', 'UA-131413870-1'); `
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: `{ 
          "@context" : "http://schema.org",
          "@type" : "Article",
          "name" : "Superstitious Network",
          "author" : "Superstitious Network",
          "headline" :  "The invisible network that holds our world together.",
          "publisher" : {
            "@type" : "Organization",
            "name" : "Superstitious Network"
          },
          "sameAs" : ["https://twitter.com/superstitiousnw", "https://www.facebook.com/superstitiousnetwork"],
          "datePublished" : "2019-01-01",
          "image" : "https://superstitious.network/images/superstitious-network.png",
          "logo" : "https://superstitious.network/images/superstitious-network.png",
          "url" : "https://superstitious.network/"
        } `}} />

      {props.children}
    </Head>
  )
};

export default CustomHead;