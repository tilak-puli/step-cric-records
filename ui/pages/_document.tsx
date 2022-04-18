import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <!--suppress HtmlRequiredTitleElement -->
          <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Fredericka+the+Great&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
