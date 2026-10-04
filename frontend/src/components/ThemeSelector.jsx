import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { PaletteIcon, CheckIcon, ChevronDownIcon } from "./Icons";

export default function ThemeSelector() {
  const { currentTheme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-selector-btn"
        aria-label="Select Color Theme"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "7px 12px",
          borderRadius: "10px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-card)",
          color: "var(--text-main)",
          fontSize: "12px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          {currentTheme.colors.map((c, i) => (
            <span
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: c,
                boxShadow: `0 0 6px ${c}`
              }}
            />
          ))}
        </div>
        <span style={{ fontWeight: 700 }}>{currentTheme.name}</span>
        <ChevronDownIcon size={14} color="var(--text-muted)" />
      </button>

      {isOpen && (
        <div
          className="theme-dropdown-menu"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "300px",
            background: "var(--bg-card)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "16px",
            border: "1px solid var(--border-card-hover)",
            boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.5), 0 0 25px var(--border-glow)",
            padding: "10px",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            animation: "fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          <div style={{ padding: "6px 8px 8px 8px", borderBottom: "1px solid var(--border-card)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              <PaletteIcon size={14} color="var(--accent-primary)" /> Color Palettes
            </span>
            <span style={{ fontSize: "10px", background: "var(--badge-bg)", color: "var(--accent-primary)", padding: "2px 8px", borderRadius: "20px", fontWeight: 700, border: "1px solid var(--badge-border)" }}>
              5 Curated Themes
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {themes.map((theme) => {
              const isSelected = theme.id === currentTheme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`theme-option-btn ${isSelected ? "selected" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 10px",
                    borderRadius: "10px",
                    background: isSelected ? "var(--bg-surface)" : "transparent",
                    border: isSelected ? "1px solid var(--border-glow)" : "1px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.18s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                      {theme.colors.map((c, i) => (
                        <span
                          key={i}
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: c,
                            boxShadow: isSelected ? `0 0 8px ${c}` : "none"
                          }}
                        />
                      ))}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                          {theme.name}
                        </span>
                        {theme.badge && (
                          <span
                            style={{
                              fontSize: "9px",
                              padding: "1px 6px",
                              borderRadius: "6px",
                              fontWeight: 700,
                              background: isSelected ? "var(--accent-primary-gradient)" : "var(--badge-bg)",
                              color: isSelected ? "#ffffff" : "var(--text-accent)"
                            }}
                          >
                            {theme.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
                        {theme.desc}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{ color: "var(--accent-primary)", display: "flex", alignItems: "center" }}>
                      <CheckIcon size={16} color="var(--accent-primary)" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
