import React, { FC } from "react";
import { Typography } from "antd";

interface DashboardCardProps {
  label: string;
  value: number | string;
}

const DashboardCard: FC<DashboardCardProps> = ({ label, value }) => {
  return (
    <div
      className="w-full p-16 rounded-md"
      style={{ border: "2.5px solid #b3c8e2" }}
    >
      <Typography style={{ fontSize: 18, fontWeight: 600, color: "#101828" }}>
        {label}
      </Typography>
      <Typography style={{ fontSize: 16, fontWeight: 500, color: "#667085" }}>
        {value}
      </Typography>
    </div>
  );
};

export default DashboardCard;
