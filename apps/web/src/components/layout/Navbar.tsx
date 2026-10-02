"use client";

import React from "react";
import { color, radius, spacing } from "@merit-circle/ui";
import {
  BarChartIcon,
  CoinsIcon,
  CreditCardIcon,
  ZapIcon,
  StarIcon,
  SettingsIcon,
} from "./Icons";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <BarChartIcon size={18} /> },
  { label: "Pool Marketplace", href: "/pools", icon: <CoinsIcon size={18} /> },
  { label: "Payment Hub", href: "/pay", icon: <CreditCardIcon size={18} /> },
  { label: "Auction", href: "/auction", icon: <ZapIcon size={18} /> },
  { label: "Reputation", href: "/reputation", icon: <StarIcon size={18} /> },
  { label: "Settings", href: "/settings", icon: <SettingsIcon size={18} /> },
];

export interface NavbarProps {
  activeHref?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeHref = "/dashboard" }) => {
  return (
    <aside
      className="mc-glass"
      style={{
        width: "260px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: `${spacing["6"]} ${spacing["4"]}`,
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        boxSizing: "border-box",
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          marginBottom: spacing["8"],
          padding: `0 ${spacing["2"]}`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            color: color.text.primary,
          }}
        >
          <img
            src="/logo.png"
            alt="Merit Circle Logo"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              boxShadow: "0 0 20px rgba(77, 142, 255, 0.4)",
              objectFit: "contain",
              display: "block",
            }}
          />
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "16px",
                letterSpacing: "0.5px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: "linear-gradient(90deg, #FFFFFF 40%, #ADC6FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MERIT CIRCLE
            </div>
            <div style={{ fontSize: "11px", color: color.brand.accentElectric, fontWeight: 600 }}>
              BNB Testnet ROSCA
            </div>
          </div>
        </a>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeHref === item.href || (item.href !== "/" && activeHref.startsWith(item.href));
          return (
            <a
              key={item.href}
              href={item.href}
              className={isActive ? "" : "mc-glass-interactive"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: radius.md,
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#FFFFFF" : color.text.secondary,
                backgroundColor: isActive ? "rgba(77, 142, 255, 0.15)" : "transparent",
                border: isActive ? "1px solid rgba(77, 142, 255, 0.45)" : "1px solid transparent",
                boxShadow: isActive ? "0 0 20px rgba(77, 142, 255, 0.2)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: radius.full,
                    backgroundColor: color.brand.primary,
                    color: "#FFFFFF",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Testnet Disclaimer */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
        <div
          style={{
            padding: "12px",
            backgroundColor: "rgba(20, 24, 36, 0.6)",
            borderRadius: radius.md,
            border: "1px solid rgba(255, 255, 255, 0.06)",
            fontSize: "11px",
            color: color.text.muted,
            lineHeight: "1.4",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: color.status.warning, fontWeight: 700, marginBottom: "4px" }}>
            <span className="mc-live-dot" style={{ backgroundColor: color.status.warning, boxShadow: `0 0 8px ${color.status.warning}` }} />
            <span>BNB Chain Testnet</span>
          </div>
          Chain ID 97 • Zero Collateral • Zero KYC
        </div>
      </div>
    </aside>
  );
};
