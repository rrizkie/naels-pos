import { mainPageHandler } from "@/props/server";
import React from "react";

export async function getServerSideProps(context: any) {
  return mainPageHandler(context);
}

const Transaction = () => {
  return <div>transaction</div>;
};

export default Transaction;
