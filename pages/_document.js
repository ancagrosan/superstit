import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class _document extends Document {
  render() {
    return (
      <Html lang="en-US" dir="ltr">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
