"use client";

import React from "react";
import { color, radius, spacing } from "@merit-circle/ui";
import { useWallet } from "../../hooks/useWallet";
import { useAuth } from "../../hooks/useAuth";
import { useReputation } from "../../hooks/useReputation";
import { formatAddress, formatPoint, formatTier } from "../../lib/format";
import { PanelLeftClose, PanelLeftOpen, AlertTriangleIcon, StarIcon, UserIcon, ZapIcon } from "./Icons";
import { LiquidMetalButton } from "../ui/liquid-metal-button";

export interface TopbarProps {
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  activeHref?: string;
  title?: string;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/pools": "Pool Marketplace",
  "/pay": "Payment Hub",
  "/auction": "Yield Auction",
  "/reputation": "Reputation Matrix",
  "/settings": "Settings",
  "/admin": "Admin Overview",
  "/admin/users": "User Directory",
  "/admin/pools": "Pool Governance",
  "/admin/groups": "Cycle Engine",
  "/admin/auctions": "Auction Controller",
  "/admin/reputation": "Reputation Matrix",
  "/admin/audit": "Audit Logs",
};

export const Topbar: React.FC<TopbarProps> = ({
  sidebarOpen = true,
  onToggleSidebar,
  activeHref,
  title,
}) => {
  const { address, isConnected, isCorrectNetwork, switchNetwork } = useWallet();
  const { user, isAuthenticated, loginWithWallet, logout } = useAuth();
  const { points: repPoints, tier: repTier } = useReputation();

  const currentPoints =
    !isAuthenticated || !user
      ? 0
      : (user.reputationPoints ?? repPoints ?? 0);
  const currentTier =
    !isAuthenticated || !user
      ? 1
      : (user.tier ?? repTier ?? 1);

  const isAdmin = activeHref?.startsWith("/admin");
  const currentTitle =
    title ||
    (activeHref ? PAGE_TITLES[activeHref] || activeHref.replace(/^\//, "").toUpperCase() : undefined);

  return (
    <header
      className="mc-header-glass"
      style={{
        height: "64px",
        minHeight: "64px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${spacing["6"]}`,
        position: "sticky",
        top: 0,
        zIndex: 40,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Left controls: Single Sidebar Toggle & Clean 21st Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="mc-button"
            style={{
              padding: "7px",
              borderRadius: radius.md,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: color.text.secondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            title={sidebarOpen ? "Collapse sidebar (Ctrl+B)" : "Expand sidebar (Ctrl+B)"}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        )}

        {/* Brand logo shown in topbar when sidebar is closed or on standalone landing page */}
        {(!sidebarOpen || !onToggleSidebar) && (
          <a
            href={isAdmin ? "/admin" : "/"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              color: color.text.primary,
            }}
          >
            <img
              src="/logo.png"
              alt="Merit Circle Logo"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                boxShadow: "0 0 14px rgba(77, 142, 255, 0.35)",
                objectFit: "contain",
                display: "block",
              }}
            />
            <span
              style={{
                fontWeight: 800,
                fontSize: "14px",
                letterSpacing: "0.5px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: "linear-gradient(90deg, #FFFFFF 40%, #ADC6FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MERIT CIRCLE
            </span>
          </a>
        )}

        {/* 21st Modern Breadcrumb Navigation */}
        {currentTitle && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
            {sidebarOpen && onToggleSidebar && (
              <>
                <span style={{ color: color.text.muted, fontWeight: 500 }}>
                  {isAdmin ? "Admin Console" : "Merit Circle"}
                </span>
                <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>/</span>
              </>
            )}
            {!sidebarOpen && onToggleSidebar && (
              <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>/</span>
            )}
            <span style={{ color: color.text.primary, fontWeight: 600 }}>
              {currentTitle}
            </span>
          </div>
        )}

        <div style={{ height: "16px", width: "1px", backgroundColor: "rgba(255, 255, 255, 0.12)", margin: "0 2px" }} />

        {isConnected && !isCorrectNetwork ? (
          <button
            type="button"
            onClick={switchNetwork}
            className="mc-button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 14px",
              borderRadius: radius.full,
              backgroundColor: color.status.warningBackground,
              border: `1px solid ${color.status.warning}`,
              color: color.status.warning,
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <AlertTriangleIcon size={14} />
            <span>Switch to BNB Testnet (97)</span>
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 12px",
              borderRadius: radius.full,
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              fontSize: "12px",
              color: color.text.secondary,
            }}
          >
            <span className="mc-live-dot" />
            <span style={{ fontWeight: 600, fontSize: "12px" }}>BNB Testnet 97</span>
          </div>
        )}
      </div>

      {/* User Info & Wallet Widget */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Reputation and Tier Preview */}
        {isAuthenticated && user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "5px 14px",
              backgroundColor: "rgba(27, 32, 48, 0.8)",
              borderRadius: radius.full,
              border: "1px solid rgba(77, 142, 255, 0.3)",
              boxShadow: "0 0 16px rgba(77, 142, 255, 0.15)",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: color.brand.accentElectric,
                fontFamily: "'JetBrains Mono', monospace",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <StarIcon size={14} style={{ color: color.brand.accentElectric }} />
              {formatPoint(currentPoints)}
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>|</span>
            <span
              style={{
                fontSize: "12px",
                color: color.text.white,
                fontWeight: 600,
              }}
            >
              {formatTier(currentTier)}
            </span>
          </div>
        )}

        {/* Auth / Wallet Button */}
        {isAuthenticated && user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <a
              href="/dashboard"
              className="mc-glass-interactive"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: radius.full,
                textDecoration: "none",
                color: color.text.primary,
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <UserIcon size={14} style={{ color: color.text.muted }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {user.username || formatAddress(user.walletAddress)}
              </span>
            </a>
            <button
              type="button"
              onClick={logout}
              className="mc-button"
              style={{
                padding: "6px 14px",
                borderRadius: radius.full,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: color.text.muted,
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <LiquidMetalButton
            size="sm"
            variant="primary"
            onClick={loginWithWallet}
            icon={<ZapIcon size={14} />}
          >
            Connect Wallet
          </LiquidMetalButton>
        )}
      </div>
    </header>
  );
};
