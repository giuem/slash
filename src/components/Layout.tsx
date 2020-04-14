import Head from "next/head";

interface Props {
  title?: string;
}

const TITLE = `<Slash />`;

const Layout: React.FC<Props> = ({ children, title = "" }) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} - ${TITLE}` : TITLE}</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔪</text></svg>"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      {children}
    </>
  );
};

export default Layout;
