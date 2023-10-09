import React, { useEffect, useState } from "react";

import type { MenuProps } from "antd";
import { Button, Drawer, Dropdown, Menu, Typography } from "antd";
import {
  CloseOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  TransactionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { LOGO, MENU } from "@/constants";
import { useRouter } from "next/router";
import useBreakPoints from "@/hooks/useBreakPoints";

type MenuItem = Required<MenuProps>["items"][number];

enum MenuKey {
  Dashboard = "dashboard",
  Transaction = "transaction",
}

type MainLayoutProps = {
  children: any;
  username: string;
};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const MainLayout: React.FC<MainLayoutProps> = ({ username, children }) => {
  const { push, pathname } = useRouter();
  const { isMobile } = useBreakPoints();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuKey>(MenuKey.Dashboard);

  const getMenuLabel = (menu: string) => {
    return !isCollapsed ? menu : "";
  };

  const menuItems = [
    getItem(
      getMenuLabel("Dashboard"),
      MenuKey.Dashboard,
      <HomeOutlined style={{ fontSize: 16 }} />
    ),
    getItem(
      getMenuLabel("Transaction"),
      MenuKey.Transaction,
      <TransactionOutlined style={{ fontSize: 16 }} />
    ),
  ];

  const userItems = [
    {
      key: 1,
      label: (
        <Button
          type="primary"
          danger
          onClick={() => push(MENU.LOGOUT)}
          style={{ width: "100%" }}
        >
          Logout
        </Button>
      ),
    },
  ];

  const onClickMenu = (e: any) => {
    setSelectedMenu(e.key);
    push(`/${e.key}`);
    isMobile && setIsDrawerOpen(false);
  };

  useEffect(() => {
    const sliced = pathname.slice(1);
    setSelectedMenu(sliced as MenuKey);
  }, []);

  return (
    <div className="flex h-screen">
      {isMobile && (
        <Drawer
          open={isDrawerOpen}
          placement="left"
          onClose={() => setIsDrawerOpen(false)}
          width={"70%"}
          style={{ background: "#232D3F", color: "white" }}
          closable={false}
        >
          <div className="flex justify-end mb-24">
            <CloseOutlined
              onClick={() => setIsDrawerOpen(false)}
              style={{ color: "white" }}
            />
          </div>
          <div className="flex justify-center items-center mb-24">
            <Image
              src={LOGO}
              width={isCollapsed ? 100 : 150}
              height={isCollapsed ? 50 : 100}
              alt="logo"
            />
          </div>
          <div className="flex flex-col gap-12">
            {menuItems.map((el: any) => (
              <div
                key={el.key}
                onClick={() => onClickMenu(el)}
                className="flex flex-row gap-12"
                style={
                  selectedMenu === el.key
                    ? {
                        background: "white",
                        color: "#232D3F",
                        padding: "12px",
                        borderRadius: "4px",
                      }
                    : { padding: "12px" }
                }
              >
                {el.icon}
                <Typography
                  style={{
                    color: selectedMenu === el.key ? "#232D3F" : "white",
                  }}
                >
                  {el.label}
                </Typography>
              </div>
            ))}
          </div>
        </Drawer>
      )}
      {!isMobile && (
        <div className={`py-16 h-full`} style={{ background: "#232D3F" }}>
          {!isCollapsed && (
            <div className="flex justify-center items-center mb-24">
              <Image
                src={LOGO}
                width={isCollapsed ? 100 : 150}
                height={isCollapsed ? 50 : 100}
                alt="logo"
              />
            </div>
          )}
          <Menu
            onClick={onClickMenu}
            style={{ width: isCollapsed ? 50 : 256, background: "#232D3F" }}
            defaultSelectedKeys={[selectedMenu]}
            selectedKeys={[selectedMenu]}
            mode="inline"
            items={menuItems}
          />
        </div>
      )}
      <div className="flex flex-col w-full">
        <div
          className="flex justify-between items-center p-16"
          style={{ borderBottom: "0.5px solid #232d3f" }}
        >
          {isMobile ? (
            <MenuOutlined
              onClick={() => setIsDrawerOpen(true)}
              style={{ fontSize: 25, color: "#232d3f", cursor: "pointer" }}
            />
          ) : !isCollapsed ? (
            <MenuFoldOutlined
              onClick={() => setIsCollapsed((prev) => !prev)}
              style={{ fontSize: 25, color: "#232d3f", cursor: "pointer" }}
            />
          ) : (
            <MenuUnfoldOutlined
              onClick={() => setIsCollapsed((prev) => !prev)}
              style={{ fontSize: 25, color: "#232d3f", cursor: "pointer" }}
            />
          )}
          <Dropdown menu={{ items: userItems }}>
            <div
              className="flex flex-row items-center gap-12"
              style={{ cursor: "pointer" }}
            >
              <UserOutlined style={{ fontSize: 25, color: "#232d3f" }} />
              <Typography style={{ fontSize: 20 }}>{username}</Typography>
            </div>
          </Dropdown>
        </div>
        <div className="p-16">
          <Typography
            className="mb-24"
            style={{
              fontSize: 25,
              fontWeight: 600,
              textTransform: "capitalize",
              color: "#232d3f",
            }}
          >
            {selectedMenu}
          </Typography>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
