"use client";

import React, { useState } from "react";
import { color, radius, spacing, Button, Card } from "@merit-circle/ui";
import { AppProviders } from "../providers/AppProviders";
import { Topbar } from "../components/layout/Topbar";
import { LiquidMetalButton } from "../components/ui/liquid-metal-button";
import { ShieldIcon, ZapIcon, TargetIcon } from "../components/layout/Icons";

function LandingPageContent() {
  const [selectedTier, setSelectedTier] = useState<number>(2);

  const samplePools = [
    { tier: 1, name: "START-1 (Newcomer)", members: 3, contrib: "0.0008 tBNB", payout: "0.0024 tBNB", minRep: 0 },
    { tier: 2, name: "CIT-1 (Citizen)", members: 3, contrib: "0.0010 tBNB", payout: "0.0030 tBNB", minRep: 101 },
    { tier: 3, name: "BLD-1 (Builder)", members: 5, contrib: "0.0030 tBNB", payout: "0.0150 tBNB", minRep: 401 },
    { tier: 4, name: "TRU-A1 (Trusted Auction)", members: 5, contrib: "0.0100 tBNB", payout: "0.0500 tBNB", minRep: 701 },
    { tier: 5, name: "PRM-A1 (Prime Auction)", members: 10, contrib: "0.0200 tBNB", payout: "0.2000 tBNB", minRep: 901 },
  ];

  const currentPool = samplePools.find((p) => p.tier === selectedTier) || samplePools[1];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-app)",
        color: "var(--text-primary)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* 21st.dev Ambient Glowing Orb Atmosphere */}
      <div
        style={{
          position: "absolute",
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "550px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(77, 142, 255, 0.22) 0%, rgba(0, 229, 255, 0.12) 40%, transparent 70%)",
          filter: "blur(110px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "35%",
          right: "-10%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, transparent 70%)",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Topbar />

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1160px",
          margin: "0 auto",
          padding: `72px 24px 64px`,
          textAlign: "center",
        }}
      >
        {/* Floating Web3 Badges (21st.dev Floating Elements) */}
        <div
          className="animate-float"
          style={{
            position: "absolute",
            top: "80px",
            left: "40px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: radius.full,
            backgroundColor: "rgba(20, 24, 36, 0.8)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            boxShadow: "0 0 24px rgba(245, 158, 11, 0.25)",
            fontSize: "13px",
            fontWeight: 700,
            color: "#F59E0B",
            pointerEvents: "none",
          }}
        >
          <span className="mc-live-dot" style={{ backgroundColor: "#F59E0B", boxShadow: "0 0 8px #F59E0B" }} />
          <span>BNB Chain Testnet</span>
        </div>

        <div
          className="animate-float-slow"
          style={{
            position: "absolute",
            top: "140px",
            right: "40px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: radius.full,
            backgroundColor: "rgba(20, 24, 36, 0.8)",
            border: "1px solid rgba(0, 229, 255, 0.4)",
            boxShadow: "0 0 24px rgba(0, 229, 255, 0.25)",
            fontSize: "13px",
            fontWeight: 700,
            color: "#00E5FF",
            pointerEvents: "none",
          }}
        >
          <ShieldIcon size={16} />
          <span>1000 Pts Reputation</span>
        </div>

        {/* Pill Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 20px",
            borderRadius: radius.full,
            backgroundColor: "rgba(27, 32, 48, 0.8)",
            border: "1px solid rgba(77, 142, 255, 0.4)",
            boxShadow: "0 0 20px rgba(77, 142, 255, 0.2)",
            fontSize: "13px",
            fontWeight: 600,
            color: color.brand.accentElectric,
            marginBottom: spacing["6"],
          }}
        >
          <span className="mc-live-dot" />
          <span>Arisan Finansial Komunitas • Tanpa Agunan • Reputasi On-Chain</span>
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-1.5px",
            marginBottom: spacing["6"],
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: "linear-gradient(135deg, #FFFFFF 30%, #ADC6FF 70%, #00E5FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Decentralized ROSCA <br />
          Powered by On-Chain Reputation.
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "var(--text-secondary)",
            maxWidth: "760px",
            margin: `0 auto ${spacing["8"]}`,
            lineHeight: 1.6,
          }}
        >
          Akses permodalan komunitas yang adil dan transparan di <strong>BNB Smart Chain Testnet</strong>.
          Kumpulkan simpanan bergilir tanpa jaminan aset, tanpa KYC, dengan mekanisme lelang carried reward yang
          menjamin <strong>surplus akhir tuntas 0 tBNB</strong>.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", justifyContent: "center", gap: spacing["4"], marginBottom: "56px" }}>
          <LiquidMetalButton
            href="/dashboard"
            size="lg"
            variant="primary"
          >
            Buka Dashboard →
          </LiquidMetalButton>
          <LiquidMetalButton
            href="/pools"
            size="lg"
            variant="cyan"
          >
            Katalog ROSCA Pool
          </LiquidMetalButton>
        </div>

        {/* Protocol Invariant Stats Strip (21st.dev Metric Bar) */}
        <div
          className="mc-glass"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: radius.xl,
            overflow: "hidden",
            marginBottom: "64px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          {[
            { label: "Blockchain Network", value: "BNB Testnet 97", sub: "Fast 3s Finality" },
            { label: "Collateral Requirement", value: "0% Agunan", sub: "Reputation-driven" },
            { label: "Reputation Scoring", value: "0–1000 Pts", sub: "5 Tier Progression" },
            { label: "Final Surplus Invariant", value: "0 tBNB Surplus", sub: "Full Payout Cycle" },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "rgba(16, 20, 32, 0.9)",
                padding: "20px 24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 500 }}>
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: color.text.white,
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "12px", color: color.brand.accentElectric, fontWeight: 600 }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* 21st.dev Cyber Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", textAlign: "left", marginBottom: "72px" }}>
          {/* Card 1 */}
          <div
            className="mc-liquid-glass"
            style={{
              padding: "32px",
              borderRadius: radius.xl,
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(77, 142, 255, 0.15)",
                border: "1px solid rgba(77, 142, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                color: color.brand.primary,
              }}
            >
              <ShieldIcon size={24} />
            </div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 800,
                margin: "0 0 10px 0",
                color: color.text.white,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Reputation Engine (0–1000)
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
              Sistem reputasi on-chain bertingkat Tier 1 (Newcomer) hingga Tier 5 (Prime). Setiap setoran tepat waktu
              menambah poin reputasi dan membuka akses arisan multi-group dengan nilai iuran lebih besar.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="mc-liquid-glass mc-liquid-cyan"
            style={{
              padding: "32px",
              borderRadius: radius.xl,
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(0, 229, 255, 0.15)",
                border: "1px solid rgba(0, 229, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                color: "#00E5FF",
              }}
            >
              <ZapIcon size={24} />
            </div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 800,
                margin: "0 0 10px 0",
                color: color.text.white,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Carried Reward Auction
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
              Anggota yang membutuhkan likuiditas segera dapat menawar diskon reward. Selisih diskon otomatis ditransfer
              ke siklus berikutnya sebagai insentif tambahan bagi anggota penyimpan yang sabar.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="mc-liquid-glass mc-liquid-gold"
            style={{
              padding: "32px",
              borderRadius: radius.xl,
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                color: "#F59E0B",
              }}
            >
              <TargetIcon size={24} />
            </div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 800,
                margin: "0 0 10px 0",
                color: color.text.white,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              No Final Surplus Invariant
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
              Pada siklus penutup (final cycle), peserta terakhir dijamin menerima 100% full reward pool tanpa potongan
              diskon, memastikan seluruh dana tersalurkan dan sisa saldo kelompok menjadi tepat 0.
            </p>
          </div>
        </div>

        {/* Interactive ROSCA Live Simulator Widget */}
        <div
          className="mc-liquid-glass"
          style={{
            borderRadius: radius["2xl"],
            padding: "40px",
            textAlign: "left",
            marginBottom: "72px",
            border: "1px solid rgba(77, 142, 255, 0.3)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(77, 142, 255, 0.15)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: color.brand.accentElectric, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                Interactive Simulator
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Eksplorasi Skema Arisan per Tier
              </h2>
            </div>

            {/* Tier Selector Buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {samplePools.map((p) => (
                <button
                  key={p.tier}
                  type="button"
                  onClick={() => setSelectedTier(p.tier)}
                  className={`mc-button ${selectedTier === p.tier ? "mc-btn-liquid-metal" : ""}`}
                  style={{
                    padding: "8px 18px",
                    borderRadius: radius.full,
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    backgroundColor: selectedTier === p.tier ? color.brand.primary : "rgba(255, 255, 255, 0.05)",
                    color: selectedTier === p.tier ? "#FFFFFF" : color.text.muted,
                    border: selectedTier === p.tier ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: selectedTier === p.tier ? "0 0 16px rgba(77, 142, 255, 0.4)" : "none",
                  }}
                >
                  Tier {p.tier}
                </button>
              ))}
            </div>
          </div>

          {/* Simulator Details Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
            <div style={{ backgroundColor: "rgba(16, 20, 32, 0.8)", padding: "20px", borderRadius: radius.lg, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: "12px", color: color.text.muted, marginBottom: "4px" }}>Nama Katalog</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: color.text.white }}>{currentPool.name}</div>
            </div>
            <div style={{ backgroundColor: "rgba(16, 20, 32, 0.8)", padding: "20px", borderRadius: radius.lg, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: "12px", color: color.text.muted, marginBottom: "4px" }}>Iuran per Siklus</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: color.brand.accentElectric }}>{currentPool.contrib}</div>
            </div>
            <div style={{ backgroundColor: "rgba(16, 20, 32, 0.8)", padding: "20px", borderRadius: radius.lg, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: "12px", color: color.text.muted, marginBottom: "4px" }}>Total Payout Giliran</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: color.status.success }}>{currentPool.payout}</div>
            </div>
            <div style={{ backgroundColor: "rgba(16, 20, 32, 0.8)", padding: "20px", borderRadius: radius.lg, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: "12px", color: color.text.muted, marginBottom: "4px" }}>Minimal Reputasi</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#F59E0B" }}>{currentPool.minRep} Pts</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <LiquidMetalButton
              href="/pools"
              size="md"
              variant="primary"
            >
              Lihat Pool {currentPool.name.split(" ")[0]} di Marketplace →
            </LiquidMetalButton>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        style={{
          position: "relative",
          backgroundColor: "rgba(16, 20, 32, 0.7)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: color.brand.accentElectric, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
              Alur Partisipasi Arisan
            </div>
            <h2 style={{ fontSize: "36px", fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              4 Langkah Mudah Menjalankan Arisan
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {[
              { step: "01", title: "Koneksi Wallet", desc: "Hubungkan MetaMask atau Web3 wallet Anda ke BNB Smart Chain Testnet (Chain ID 97)." },
              { step: "02", title: "Verifikasi Profil", desc: "Daftarkan username dan verifikasi email Anda untuk membuka Tier 1 dan reputasi awal." },
              { step: "03", title: "Pilih Pool & Setor", desc: "Pilih kelompok arisan sesuai kapasitas. Setor iuran tepat waktu melalui smart contract." },
              { step: "04", title: "Lelang & Payout", desc: "Ikuti lelang bila butuh dana cepat, atau nikmati bonus carried reward pada giliran Anda." },
            ].map((st) => (
              <div
                key={st.step}
                className="mc-glass-interactive"
                style={{
                  padding: "28px",
                  borderRadius: radius.lg,
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: color.brand.primary,
                    fontFamily: "'JetBrains Mono', monospace",
                    marginBottom: "12px",
                  }}
                >
                  {st.step}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: color.text.white }}>
                  {st.title}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {st.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "48px 24px",
          textAlign: "center",
          fontSize: "13px",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span className="mc-live-dot" style={{ backgroundColor: "#F59E0B", boxShadow: "0 0 10px #F59E0B" }} />
          <strong style={{ color: color.text.white }}>BNB Smart Chain Testnet Notice:</strong>
        </div>
        <p style={{ margin: 0 }}>
          Merit Circle berjalan di jaringan uji coba BNB Smart Chain Testnet (Chain ID 97). Token tBNB adalah aset uji coba
          tanpa nilai moneter riil. Seluruh invariant ROSCA terverifikasi secara matematis & audit on-chain.
        </p>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <AppProviders>
      <LandingPageContent />
    </AppProviders>
  );
}
