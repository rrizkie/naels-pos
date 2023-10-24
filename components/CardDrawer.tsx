import { BRANCH, ROLE } from "@/constants";
import useBreakPoints from "@/hooks/useBreakPoints";
import { SelectedItem } from "@/pages/transaction";
import { BranchType, getBranches } from "@/services/branch";
import { PromotionType, getPromotions } from "@/services/promotion";
import { numberFormat } from "@/utils/currency";
import { DeleteOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Drawer, Select } from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    promo: PromotionType,
    grandTotal: number,
    downpayment: number,
    totalDiscount: number,
    branch?: BRANCH
  ) => void;
  loading: boolean;
  items: SelectedItem[];
  onRemove: (item: SelectedItem) => void;
  totalPrice: number;
  token: string;
  role: string;
}

const CartDrawer: FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  items,
  onRemove,
  totalPrice,
  token,
  role,
}) => {
  const { isMobile } = useBreakPoints();

  const [branchOptions, setBranchOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedBranch, setSelectedBranch] = useState<BRANCH | null>(null);

  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionType | null>(null);

  const [selectedDownpayment, setSelectedDownpayment] = useState<number>(0);

  const handleClose = () => {
    setSelectedPromotion(null);
    setSelectedBranch(null);
    setSelectedDownpayment(0);
    onClose();
  };

  const fetchPromotion = useCallback(async () => {
    await getPromotions({
      params: {
        isActive: true,
        ...((role === ROLE.DEV || role === ROLE.OWNER) && {
          branch: selectedBranch as BRANCH,
        }),
      },
      token,
      onSuccess: (data) => {
        setPromotions(data.data);
      },
    });
  }, [token, selectedBranch, role]);

  const handlePromotion = (id: string) => {
    const selected = promotions.find((promo: PromotionType) => promo.id === id);
    setSelectedPromotion(selected as PromotionType);
  };

  const handleConfirm = () => {
    const total = selectedPromotion
      ? totalPrice - (totalPrice * selectedPromotion?.value) / 100
      : totalPrice;
    const totalDiscount = selectedPromotion
      ? (totalPrice * selectedPromotion?.value!) / 100
      : 0;

    onConfirm(
      selectedPromotion as PromotionType,
      total,
      selectedDownpayment,
      totalDiscount,
      selectedBranch as BRANCH
    );
  };

  useEffect(() => {
    if (token) fetchPromotion();
  }, [fetchPromotion]);

  useEffect(() => {
    if (role === ROLE.DEV || role === ROLE.OWNER) {
      getBranches({
        token,
        onSuccess: (data: BranchType[]) => {
          const options = data.map((el: BranchType) => ({
            value: el.name,
            label: el.name,
          }));
          setBranchOptions(options);
        },
      });
    }
  }, [token, role]);

  return (
    <Drawer
      open={isOpen}
      title="Transaction Cart"
      closable={false}
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
        {(role === ROLE.DEV || role === ROLE.OWNER) && (
          <>
            <div
              style={{
                fontSize: "17px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              Branch
            </div>
            <Select
              value={selectedBranch}
              placeholder="please Select branch"
              options={branchOptions}
              onChange={(val) => setSelectedBranch(val as any)}
              allowClear
            />
            <Divider />
          </>
        )}
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
                  <div
                    className="cursor-pointer"
                    onClick={() => onRemove(item)}
                  >
                    <DeleteOutlined style={{ color: "red", fontSize: 14 }} />
                  </div>
                  <Divider type="vertical" />
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

        <div
          style={{
            fontSize: "17px",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          Down Payment
        </div>
        <Select
          value={selectedDownpayment}
          placeholder="No Downpayment applied"
          options={[
            {
              value: 0,
              label: "No Downpayment",
            },
            {
              value: 50000,
              label: "Rp.50,000",
            },
            {
              value: 85000,
              label: "Rp.85,000",
            },
          ]}
          onChange={(val) => setSelectedDownpayment(val ?? 0)}
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
          {selectedDownpayment > 0 && (
            <div className="flex flex-row justify-between items-center">
              <div style={{ fontSize: "15px", fontWeight: 700 }}>
                Down Payment
              </div>
              <div style={{ fontSize: "15px", fontWeight: 700 }}>
                - Rp.{numberFormat(selectedDownpayment as number)}
              </div>
            </div>
          )}
          <div className="flex flex-row justify-between items-center">
            <div style={{ fontSize: "15px", fontWeight: 700 }}>Grand Total</div>
            <div style={{ fontSize: "15px", fontWeight: 700 }}>
              Rp.
              {selectedPromotion
                ? numberFormat(
                    totalPrice -
                      (totalPrice * selectedPromotion?.value) / 100 -
                      selectedDownpayment
                  )
                : numberFormat(totalPrice - selectedDownpayment)}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default CartDrawer;
