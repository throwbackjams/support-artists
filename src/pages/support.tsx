import type { NextPage } from "next";
import Head from "next/head";
import { SupportView } from "views/support";

const SupportPage: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Artists Patreon</title>
        <meta
          name="description"
          content="Support Artists"
        />
      </Head>
      <SupportView />
    </div>
  );
};

export default SupportPage;
