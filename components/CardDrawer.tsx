import useBreakPoints from "@/hooks/useBreakPoints";
import { SelectedItem } from "@/pages/transaction";
import { PromotionType, getPromotions } from "@/services/promotion";
import { numberFormat } from "@/utils/currency";
import { Button, Divider, Drawer, Select } from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (promo: PromotionType, grandTotal: number) => void;
  loading: boolean;
  items: SelectedItem[];
  totalPrice: number;
  token: string;
}

const CartDrawer: FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  items,
  totalPrice,
  token,
}) => {
  const { isMobile } = useBreakPoints();
  const downPayment = totalPrice / 2;

  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionType | null>(null);

  const handleClose = () => {
    setSelectedPromotion(null);
    onClose();
  };

  const fetchPromotion = useCallback(async () => {
    await getPromotions({
      token,
      onSuccess: (data) => {
        setPromotions(data);
      },
    });
  }, [token]);

  const handlePromotion = (id: string) => {
    const selected = promotions.find((promo: PromotionType) => promo.id === id);
    setSelectedPromotion(selected as PromotionType);
  };

  const handleConfirm = () => {
    const total = selectedPromotion
      ? totalPrice - (totalPrice * selectedPromotion?.value) / 100 - downPayment
      : totalPrice - downPayment;
    onConfirm(selectedPromotion as PromotionType, total);
  };

  useEffect(() => {
    if (token) fetchPromotion();
  }, [fetchPromotion]);

  return (
    <Drawer
      open={isOpen}
      title="Cart"
      closable
      onClose={handleClose}
      width={isMobile ? "100%" : "30%"}
      footer={
        <div className="flex justify-between items-center gap-12">
          <Button
            className="w-full"
            type="default"
            danger
            style={{ fontWeight: 700 }}
            disabled={loading}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            style={{ background: "#232d3f", color: "white", fontWeight: 700 }}
            className="w-full"
            disabled={loading}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      }
    >
      <div className="flex flex-col">
        <div
          style={{
            fontSize: "17px",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          Items
        </div>
        {items.length > 0 &&
          items.map((item: SelectedItem, index: number) => (
            <>
              <div
                key={index}
                className="flex flex-row justify-between items-start"
              >
                <div className="flex flex-row gap-6">
                  <div style={{ fontSize: "14px" }}>{item.qty}x</div>
                  <div className="flex flex-col">
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#667085" }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>
                  Rp.{numberFormat(item.price)}
                </div>
              </div>
              <Divider />
            </>
          ))}
        <div
          style={{
            fontSize: "17px",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          Promotion
        </div>
        <Select
          value={selectedPromotion?.id}
          placeholder="No Promotion applied"
          options={promotions.map((promo: PromotionType) => ({
            value: promo.id,
            label: promo.name,
          }))}
          onChange={(val) => handlePromotion(val as string)}
          allowClear
        />

        <Divider />

        <div className="flex flex-col gap-12">
          <div className="flex flex-row justify-between items-center">
            <div style={{ fontSize: "15px", fontWeight: 700 }}>Total Price</div>
            <div style={{ fontSize: "15px", fontWeight: 700 }}>
              Rp.{numberFormat(totalPrice)}
            </div>
          </div>
          {selectedPromotion && (
            <div className="flex flex-row justify-between items-start">
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700 }}>
                  Promotions
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#667085",
                  }}
                >
                  {selectedPromotion.name}
                </div>
              </div>
              <div style={{ fontSize: "15px", fontWeight: 700 }}>
                - Rp.
                {numberFormat((totalPrice * selectedPromotion?.value) / 100)}
              </div>
            </div>
          )}
          <div className="flex flex-row justify-between items-center">
            <div style={{ fontSize: "15px", fontWeight: 700 }}>
              Down Payment
            </div>
            <div style={{ fontSize: "15px", fontWeight: 700 }}>
              - Rp.{numberFormat(downPayment)}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div style={{ fontSize: "15px", fontWeight: 700 }}>Grand Total</div>
            <div style={{ fontSize: "15px", fontWeight: 700 }}>
              Rp.
              {selectedPromotion
                ? numberFormat(
                    totalPrice -
                      (totalPrice * selectedPromotion?.value) / 100 -
                      downPayment
                  )
                : numberFormat(totalPrice - downPayment)}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default CartDrawer;
