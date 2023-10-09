import { redirectPageHandler } from "@/props/server";
import React from "react";

export async function getServerSideProps({ req, res, query }: any) {
  return redirectPageHandler({ req, res, query });
}

const Redirect = () => {
  return <>test</>;
};

export default Redirect;
