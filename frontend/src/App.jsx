import React, { useState, useEffect } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import CameraScreen from "./camera_screen";
import SpeechScreen from "./speech_screen";
import VideoScreen from "./video_screen";
import DictionaryScreen from "./dictionary_screen";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import {
  CameraIcon,
  TranslateIcon,
  GlobeIcon,
  LogoIcon,
  ShieldCheckIcon,
  FileVideoIcon,
  BookOpenIcon,
  UsersIcon,
  SparklesIcon
} from "./components/Icons";
import helpingHandEmblem from "./assets/helping-hand-emblem.png";

function AppContent() {
  const [currentMode, setCurrentMode] = useState("welcome"); // "welcome" | "camera" | "speech" | "video" | "dictionary"
  const [currentLang, setCurrentLang] = useState("en"); // "en" | "hi" | "mr"
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState("prompt"); // "prompt" | "granted" | "denied"
  const { currentTheme } = useTheme();

  // Trigger browser camera access request safely
  const requestCameraPermission = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraPermissionStatus("granted");
        stream.getTracks().forEach((track) => track.stop());
      } else {
        setCameraPermissionStatus("denied");
      }
    } catch (err) {
      console.warn("Camera permission notice:", err);
      setCameraPermissionStatus("denied");
    }
  };

  // Passively check permission state on mount without popping up intrusive dialog
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "camera" })
        .then((permissionStatus) => {
          setCameraPermissionStatus(permissionStatus.state);
          permissionStatus.onchange = () => {
            setCameraPermissionStatus(permissionStatus.state);
          };
        })
        .catch(() => {
          // Fallback if permissions.query for camera is not supported
        });
    }
  }, []);

  const LABELS = {
    en: {
      btnHome: "Home",
      btnCam: "Camera",
      btnSpeech: "3D Avatar",
      btnVideo: "Video Studio",
      btnDict: "Learn Sign Language",
      btnAbout: "About Us"
    },
    hi: {
      btnHome: "होम",
      btnCam: "कैमरा",
      btnSpeech: "3D अवतार",
      btnVideo: "वीडियो स्टूडियो",
      btnDict: "सांकेतिक भाषा सीखें",
      btnAbout: "हमारे बारे में"
    },
    mr: {
      btnHome: "होम",
      btnCam: "कॅमेरा",
      btnSpeech: "3D अवतार",
      btnVideo: "व्हिडिओ स्टुडिओ",
      btnDict: "सांकेतिक भाषा शिका",
      btnAbout: "आमच्याबद्दल"
    }
  };

  const navText = LABELS[currentLang] || LABELS.en;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-root)" }}>

      {/* Modern Minimalist Header Navigation */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--bg-header)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "12px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        {/* Brand Logo & Name Container in One Border */}
        <div
          onClick={() => setCurrentMode("welcome")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            padding: "6px 14px",
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
            transition: "all 0.2s ease"
          }}
          className="brand-logo-pill"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-purple)";
            e.currentTarget.style.boxShadow = "0 0 18px rgba(139, 92, 246, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            e.currentTarget.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.4)";
          }}
        >
          <img
            src={helpingHandEmblem}
            alt="Helping Hand Logo"
            style={{
              width: "34px",
              height: "34px",
              objectFit: "contain",
              filter: "drop-shadow(0 2px 10px rgba(139, 92, 246, 0.55))"
            }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "17px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              Helping <span style={{ color: "#A855F7" }}>Hand</span>
            </span>
          </div>
        </div>

        {/* Right Actions: Segmented Language Switcher & Navigation Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>

          {/* Segmented Language Switcher */}
          <div className="lang-segmented-pill" role="group" aria-label="Select Language">
            <div className="lang-icon-badge" title="Interface Language">
              <GlobeIcon size={14} strokeWidth={1.75} color="var(--accent-purple)" />
            </div>
            <button
              className={`lang-pill-btn ${currentLang === "en" ? "active" : ""}`}
              onClick={() => setCurrentLang("en")}
            >
              EN
            </button>
            <button
              className={`lang-pill-btn ${currentLang === "hi" ? "active" : ""}`}
              onClick={() => setCurrentLang("hi")}
            >
              हिन्दी
            </button>
            <button
              className={`lang-pill-btn ${currentLang === "mr" ? "active" : ""}`}
              onClick={() => setCurrentLang("mr")}
            >
              मराठी
            </button>
          </div>

          {/* Mode Switcher Pill Tabs (Inspired by the Reference Image's Tab System) */}
          <div
            style={{
              background: "#121218",
              padding: "4px",
              borderRadius: "9999px",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              gap: "3px",
              flexWrap: "wrap"
            }}
          >
            <button
              onClick={() => setCurrentMode("welcome")}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "600",
                color: currentMode === "welcome" ? "#FFFFFF" : "var(--text-secondary)",
                background: currentMode === "welcome" ? "var(--accent-gradient)" : "transparent",
                border: currentMode === "welcome" ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid transparent",
                boxShadow: currentMode === "welcome" ? "0 2px 12px rgba(139, 92, 246, 0.40)" : "none",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {navText.btnHome}
            </button>

            <button
              onClick={() => setCurrentMode("camera")}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "600",
                color: currentMode === "camera" ? "#FFFFFF" : "var(--text-secondary)",
                background: currentMode === "camera" ? "var(--accent-gradient)" : "transparent",
                border: currentMode === "camera" ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid transparent",
                boxShadow: currentMode === "camera" ? "0 2px 12px rgba(139, 92, 246, 0.40)" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <CameraIcon size={13} strokeWidth={2} color={currentMode === "camera" ? "#FFFFFF" : "var(--text-secondary)"} />
              {navText.btnCam}
            </button>

            <button
              onClick={() => setCurrentMode("speech")}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "600",
                color: currentMode === "speech" ? "#FFFFFF" : "var(--text-secondary)",
                background: currentMode === "speech" ? "var(--accent-gradient)" : "transparent",
                border: currentMode === "speech" ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid transparent",
                boxShadow: currentMode === "speech" ? "0 2px 12px rgba(139, 92, 246, 0.40)" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <TranslateIcon size={13} strokeWidth={2} color={currentMode === "speech" ? "#FFFFFF" : "var(--text-secondary)"} />
              {navText.btnSpeech}
            </button>

            <button
              onClick={() => setCurrentMode("video")}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "600",
                color: currentMode === "video" ? "#FFFFFF" : "var(--text-secondary)",
                background: currentMode === "video" ? "var(--accent-gradient)" : "transparent",
                border: currentMode === "video" ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid transparent",
                boxShadow: currentMode === "video" ? "0 2px 12px rgba(139, 92, 246, 0.40)" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <FileVideoIcon size={13} strokeWidth={2} color={currentMode === "video" ? "#FFFFFF" : "var(--text-secondary)"} />
              {navText.btnVideo}
            </button>

            <button
              onClick={() => setCurrentMode("dictionary")}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "600",
                color: currentMode === "dictionary" ? "#FFFFFF" : "var(--text-secondary)",
                background: currentMode === "dictionary" ? "var(--accent-gradient)" : "transparent",
                border: currentMode === "dictionary" ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid transparent",
                boxShadow: currentMode === "dictionary" ? "0 2px 12px rgba(139, 92, 246, 0.40)" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <BookOpenIcon size={13} strokeWidth={2} color={currentMode === "dictionary" ? "#FFFFFF" : "var(--text-secondary)"} />
              {navText.btnDict}
            </button>

            <button
              onClick={() => {
                setCurrentMode("welcome");
                setTimeout(() => {
                  const el = document.getElementById("about-us-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--text-secondary)",
                background: "transparent",
                border: "1px solid transparent",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.15)";
                e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <UsersIcon size={13} strokeWidth={2} />
              {navText.btnAbout}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: currentMode === "welcome" ? "0" : "24px 28px" }}>
        {currentMode === "welcome" && (
          <WelcomeScreen
            onSelectMode={(mode) => setCurrentMode(mode)}
            currentLang={currentLang}
            onChangeLang={(lang) => setCurrentLang(lang)}
            onRequestCameraPermission={requestCameraPermission}
            cameraPermissionStatus={cameraPermissionStatus}
          />
        )}

        {currentMode === "camera" && (
          <CameraScreen currentLang={currentLang} onLanguageChange={setCurrentLang} />
        )}

        {currentMode === "speech" && (
          <SpeechScreen currentLang={currentLang} />
        )}

        {currentMode === "video" && (
          <VideoScreen currentLang={currentLang} />
        )}

        {currentMode === "dictionary" && (
          <DictionaryScreen currentLang={currentLang} onSelectMode={(mode) => setCurrentMode(mode)} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
