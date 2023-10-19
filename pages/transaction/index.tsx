import { IMAGE_PLACEHOLDER, MENU } from "@/constants";
import { mainPageHandler } from "@/props/server";
import { ItemType, getitems } from "@/services/item";
import { Card, Col, Row, Typography } from "antd";
import Image from "next/image";
import React, { FC, useCallback, useEffect, useState } from "react";
import { PageProps } from "../_app";
import { numberFormat } from "@/utils/currency";
import useBreakPoints from "@/hooks/useBreakPoints";
import TransactionNotification from "@/components/TransactionNotification";
import { PlusOutlined } from "@ant-design/icons";
import CustomItemDialog, {
  CustomItemType,
} from "@/components/CustomItemDialog";
import CartDrawer from "@/components/CardDrawer";
import { PromotionType } from "@/services/promotion";
import { createTransaction } from "@/services/transaction";
import { useRouter } from "next/router";

export async function getServerSideProps(context: any) {
  return mainPageHandler(context);
}

export type SelectedItem = {
  name: string;
  desc: string;
  price: number;
  qty: number;
};

const Transaction: FC<PageProps> = (props) => {
  const { access_token, branch, username } = props;
  const { isMobile } = useBreakPoints();
  const { push } = useRouter();

  const [isCustomItemDialog, setIsCustomItemDialog] = useState<boolean>(false);
  const [cartDrawer, setCartDrawer] = useState<boolean>(false);

  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const fetchItems = useCallback(async () => {
    await getitems({
      token: access_token,
      onSuccess: (data: ItemType[]) => {
        setItems(data);
      },
      setLoading,
    });
  }, [access_token]);

  const handleAddToCart = (item: ItemType) => {
    setTotalPrice((prev) => prev + item.price);

    const copySelectedItems = [...selectedItems];
    const itemIndex = selectedItems.findIndex(
      (ex: SelectedItem) => ex.name === item.name
    );

    if (itemIndex !== -1) {
      copySelectedItems[itemIndex] = {
        ...copySelectedItems[itemIndex],
        qty: copySelectedItems[itemIndex].qty + 1,
        price: copySelectedItems[itemIndex].price + item.price,
      };
      setSelectedItems(copySelectedItems);
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          name: item.name,
          desc: item.description,
          price: item.price,
          qty: 1,
        },
      ]);
    }
  };

  const handleAddCustomItem = (val: CustomItemType) => {
    setTotalPrice((prev) => prev + val.price);
    setSelectedItems((prev) => [
      ...prev,
      {
        name: val.name,
        desc: val.desc,
        price: val.price,
        qty: val.qty,
      } as SelectedItem,
    ]);
  };

  const handleConfirmCart = async (
    promo: PromotionType | null,
    total: number
  ) => {
    const payload = {
      total_price: total,
      nail_artist: username,
      branch_name: branch,
      ...(promo && {
        promotion_name: promo.name,
        promotion_value: promo.value,
      }),
    };

    await createTransaction({
      token: access_token,
      payload,
      onSuccess: (data) => {
        console.log(data);
        (window as any)?.snap.pay(data.token, {
          onSuccess: (result: any) => {
            console.log(result);
            setCartDrawer(false);
            setSelectedItems([]);
            setTotalPrice(0);
          },
        });
      },
      setLoading,
    });
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="flex flex-col justify-between">
      <Row
        gutter={[24, 24]}
        justify={isMobile ? "center" : "start"}
        style={{ marginBottom: "75px" }}
      >
        <Col span={24}>
          <div
            className="flex flex-row items-center gap-8 cursor-pointer rounded-md"
            style={{
              background: "#232d3f",
              padding: "8px 16px",
              color: "white",
              width: "fit-content",
            }}
            onClick={() => setIsCustomItemDialog(true)}
          >
            <PlusOutlined />
            <Typography
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "white",
              }}
            >
              Add Custom Item
            </Typography>
          </div>
        </Col>
        {!loading &&
          items.map((item: ItemType) => (
            <Col key={item.id}>
              <Card
                loading={loading}
                hoverable
                cover={
                  <Image
                    src={IMAGE_PLACEHOLDER}
                    alt="placeholder"
                    width={240}
                    height={300}
                  />
                }
                style={{ width: 280 }}
                onClick={() => handleAddToCart(item)}
              >
                <div style={{ minHeight: 70 }}>
                  <Typography
                    style={{
                      color: "#232D3F",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography style={{ color: "#667085" }}>
                    {item.description}
                  </Typography>
                </div>
                <div className="flex justify-end items-end mt-16">
                  <Typography
                    style={{
                      color: "#232D3F",
                      fontWeight: 700,
                      fontSize: 20,
                    }}
                  >
                    Rp.{numberFormat(item.price)}
                  </Typography>
                </div>
              </Card>
            </Col>
          ))}
      </Row>
      {totalPrice > 0 && !cartDrawer && (
        <TransactionNotification
          total={totalPrice}
          onClick={() => setCartDrawer(true)}
        />
      )}
      <CustomItemDialog
        isOpen={isCustomItemDialog}
        onClose={() => setIsCustomItemDialog(false)}
        loading={loading}
        onAdd={handleAddCustomItem}
      />
      <CartDrawer
        isOpen={cartDrawer}
        items={selectedItems}
        totalPrice={totalPrice}
        onClose={() => setCartDrawer(false)}
        onConfirm={handleConfirmCart}
        loading={loading}
        token={access_token}
      />
    </div>
  );
};

export default Transaction;
