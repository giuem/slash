import Head from "next/head";

interface Props {
  title?: string;
}

const TITLE = `<Slash />`;

const Layout: React.FC<Props> = ({ children, title = "" }) => {
  return (
    <div>
      <Head>
        <title>{title ? `${title} - ${TITLE}` : TITLE}</title>
      </Head>
      {children}
    </div>
  );
};

export default Layout;
