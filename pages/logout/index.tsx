import { logoutHandler } from "@/props/server";
import React from "react";

export async function getServerSideProps(context: any) {
  return logoutHandler(context);
}

const Logout = () => {
  return <></>;
};

export default Logout;
