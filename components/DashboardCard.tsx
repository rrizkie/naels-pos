import React, { FC } from "react";
import { Typography } from "antd";
import useBreakPoints from "@/hooks/useBreakPoints";

interface DashboardCardProps {
  label: string;
  value: number | string;
}

const DashboardCard: FC<DashboardCardProps> = ({ label, value }) => {
  const { isMobile } = useBreakPoints();
  return (
    <div
      className="flex flex-col justify-between w-full p-16 rounded-md"
      style={{ border: "2.5px solid #232d3f" }}
    >
      <Typography
        style={{
          fontSize: isMobile ? 14 : 18,
          fontWeight: 700,
          color: "#232d3f",
        }}
      >
        {label}
      </Typography>
      <Typography
        style={{
          fontSize: isMobile ? 11 : 16,
          fontWeight: 700,
          color: "#667085",
        }}
      >
        {value}
      </Typography>
    </div>
  );
};

export default DashboardCard;
