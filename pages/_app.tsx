import { BRANCH, ROLE } from "@/constants";
import MainLayout from "@/layout/MainLayout";
import { mainPageHandler } from "@/props/server";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export async function getServerSideProps(context: any) {
  return mainPageHandler(context);
}

export type PageProps = {
  access_token: string;
  username: string;
  role: ROLE;
  branch: BRANCH;
  isLoggedIn: boolean;
};

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  if (pathname !== "/") {
    return (
      <MainLayout username={pageProps.username}>
        <Component {...pageProps} />
      </MainLayout>
    );
  }
  return <Component {...pageProps} />;
}
