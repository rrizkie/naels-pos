import useBreakPoints from "@/hooks/useBreakPoints";
import { numberFormat } from "@/utils/currency";
import { RightOutlined } from "@ant-design/icons";
import React, { FC } from "react";

interface TransactionNotificationProps {
  total: number;
  onClick: () => void;
}

const TransactionNotification: FC<TransactionNotificationProps> = ({
  total,
  onClick,
}) => {
  const { isMobile } = useBreakPoints();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 5,
        width: isMobile ? "82%" : "68%",
        margin: "auto",
      }}
    >
      <div
        className="flex flex-row justify-between items-center p-16 w-full"
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          background: "#232D3F",
          color: "white",
        }}
      >
        <div className="flex flex-col gap=6">
          <div style={{ fontSize: 16, fontWeight: 600 }}>Total</div>
          <div style={{ fontSize: 19, fontWeight: 700 }}>
            Rp.{numberFormat(total)}
          </div>
        </div>
        <div
          className="p-12 rounded-md cursor-pointer"
          style={{
            background: "white",
            color: "#232D3F",
            fontWeight: 600,
            fontSize: 16,
          }}
          onClick={onClick}
        >
          Checkout <RightOutlined />
        </div>
      </div>
    </div>
  );
};

export default TransactionNotification;
