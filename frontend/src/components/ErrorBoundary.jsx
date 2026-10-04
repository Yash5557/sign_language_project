import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            padding: "32px 36px",
            background: "rgba(18, 14, 24, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            border: "1.5px solid rgba(239, 68, 68, 0.45)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(239, 68, 68, 0.2)",
            textAlign: "center",
            color: "#FFFFFF"
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              margin: "0 auto 18px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1.5px solid rgba(239, 68, 68, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px"
            }}
          >
            ⚠️
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>
            Something went wrong in this view
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "20px" }}>
            {this.state.error?.message || "An unexpected rendering error occurred while loading neural models."}
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              type="button"
              onClick={this.handleReset}
              className="btn-get-started"
              style={{ padding: "10px 22px", fontSize: "13.5px" }}
            >
              🔄 Reload View
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-hero-ghost"
              style={{ padding: "10px 22px", fontSize: "13.5px" }}
            >
              Refresh Entire App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
