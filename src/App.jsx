import { useState } from "react";
import NeXusNavbar from "./components/NeXusNavbar";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";

export default function App() {
  const [page, setPage] = useState("home"); // "home" | "signup" | "login"

  return (
    <div
      style={{
        fontFamily: "'Noto Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <NeXusNavbar
        onSignupClick={() => setPage("signup")}
        onLoginClick={() => setPage("login")}
        onHomeClick={() => setPage("home")}
      />

      {page === "signup" && (
        <SignUpPage onLoginClick={() => setPage("login")} />
      )}

      {page === "login" && (
        <LoginPage onSignupClick={() => setPage("signup")} />
      )}

      {page === "home" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 60px)",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "32px",
              margin: 0,
              color: "#1c1d1f",
            }}
          >
            Welcome to <span style={{ color: "#9fef00" }}>NeXus</span>
          </h2>
          <p style={{ color: "#6d6d6d", margin: 0, fontSize: "16px" }}>
            Click <strong>Sign up</strong> or <strong>Log in</strong> in the
            navbar to get started.
          </p>
        </div>
      )}
    </div>
  );
}
