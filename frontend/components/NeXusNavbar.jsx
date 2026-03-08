import { useState } from "react";

const BRAND_GREEN = "#9fef00";
const BRAND_DARK = "#1c1d1f";

const CartIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const HeartIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BellIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6d6d6d"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// neXus custom logo — bold wordmark with green accent on "X"
const NeXusLogo = () => (
  <svg
    viewBox="0 0 110 32"
    width="110"
    height="32"
    aria-label="neXus"
    role="img"
  >
    {/* "ne" */}
    <text
      x="0"
      y="24"
      fontFamily="'Georgia', serif"
      fontWeight="700"
      fontSize="24"
      fill={BRAND_DARK}
    >
      Ne
    </text>
    {/* "X" in green */}
    <text
      x="34"
      y="24"
      fontFamily="'Georgia', serif"
      fontWeight="700"
      fontSize="24"
      fill={BRAND_GREEN}
    >
      X
    </text>
    {/* "us" */}
    <text
      x="51"
      y="24"
      fontFamily="'Georgia', serif"
      fontWeight="700"
      fontSize="24"
      fill={BRAND_DARK}
    >
      us
    </text>
    {/* small dot accent under X */}
    <circle cx="44" cy="29" r="2.5" fill={BRAND_GREEN} />
  </svg>
);

const categories = [
  "Development",
  "Business",
  "Finance & Accounting",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Health & Fitness",
  "Music",
];

export default function NeXusNavbar({
  onSignupClick,
  onLoginClick,
  onHomeClick,
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      {/* Main Navbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          height: "60px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #d1d7dc",
          gap: "8px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onHomeClick && onHomeClick();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "8px",
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <NeXusLogo />
        </a>

        {/* Explore */}
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "700",
            color: BRAND_DARK,
            padding: "4px 8px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Explore
        </button>

        {/* Search Bar */}
        <div
          style={{
            flex: 1,
            maxWidth: "680px",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              border: searchFocused
                ? `2px solid ${BRAND_GREEN}`
                : `1.5px solid ${BRAND_DARK}`,
              borderRadius: "100px",
              backgroundColor: "#f7f9fa",
              padding: "0 16px",
              height: "44px",
              gap: "8px",
              transition: "all 0.15s ease",
              boxSizing: "border-box",
              boxShadow: searchFocused ? `0 0 0 3px ${BRAND_GREEN}33` : "none",
            }}
          >
            <SearchIcon />
            <input
              type="text"
              placeholder="Search for anything"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "14px",
                color: BRAND_DARK,
                width: "100%",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {/* Right side links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginLeft: "auto",
            flexShrink: 0,
          }}
        >
          <a
            href="#"
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: BRAND_DARK,
              textDecoration: "none",
              padding: "8px 12px",
              whiteSpace: "nowrap",
            }}
          >
            neXus Business
          </a>
          <a
            href="#"
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: BRAND_DARK,
              textDecoration: "none",
              padding: "8px 12px",
              whiteSpace: "nowrap",
            }}
          >
            Teach on neXus
          </a>

          {isLoggedIn ? (
            <>
              <a
                href="#"
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: BRAND_DARK,
                  textDecoration: "none",
                  padding: "8px 12px",
                  whiteSpace: "nowrap",
                }}
              >
                My learning
              </a>

              {/* Wishlist */}
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  color: BRAND_DARK,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <HeartIcon />
              </button>

              {/* Cart with badge */}
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  color: BRAND_DARK,
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <CartIcon />
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    backgroundColor: BRAND_GREEN,
                    color: BRAND_DARK,
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    fontSize: "10px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  1
                </span>
              </button>

              {/* Bell */}
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  color: BRAND_DARK,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BellIcon />
              </button>

              {/* Avatar */}
              <button
                style={{
                  background: "none",
                  border: `2px solid ${BRAND_GREEN}`,
                  cursor: "pointer",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  padding: 0,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: BRAND_GREEN,
                  color: BRAND_DARK,
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                N
              </button>
            </>
          ) : (
            <>
              {/* Cart */}
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  color: BRAND_DARK,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CartIcon />
              </button>

              {/* Log in */}
              {/* Log in */}
              <button
                onClick={onLoginClick}
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: BRAND_DARK,
                  background: "transparent",
                  padding: "10px 16px",
                  border: `1.5px solid ${BRAND_DARK}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND_GREEN;
                  e.currentTarget.style.borderColor = BRAND_GREEN;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = BRAND_DARK;
                  e.currentTarget.style.color = BRAND_DARK;
                }}
              >
                Log in
              </button>

              {/* Sign up */}
              <button
                onClick={onSignupClick}
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: BRAND_DARK,
                  padding: "10px 16px",
                  backgroundColor: BRAND_GREEN,
                  borderRadius: "4px",
                  border: `1.5px solid ${BRAND_GREEN}`,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#8cd900")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = BRAND_GREEN)
                }
              >
                Sign up
              </button>

              {/* Globe */}
              <button
                style={{
                  background: "none",
                  border: `1.5px solid ${BRAND_DARK}`,
                  cursor: "pointer",
                  borderRadius: "4px",
                  padding: "8px",
                  color: BRAND_DARK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = BRAND_GREEN;
                  e.currentTarget.style.color = BRAND_GREEN;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = BRAND_DARK;
                  e.currentTarget.style.color = BRAND_DARK;
                }}
              >
                <GlobeIcon />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Category Nav (shown when logged in) */}
      {isLoggedIn && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            height: "48px",
            backgroundColor: "#fff",
            borderBottom: "1px solid #d1d7dc",
            overflowX: "auto",
            scrollbarWidth: "none",
            position: "sticky",
            top: "60px",
            zIndex: 99,
          }}
        >
          {categories.map((cat) => (
            <a
              key={cat}
              href="#"
              style={{
                fontSize: "14px",
                fontWeight: "400",
                color: BRAND_DARK,
                textDecoration: "none",
                padding: "12px 16px",
                whiteSpace: "nowrap",
                borderBottom: "2px solid transparent",
                transition: "all 0.15s",
                display: "block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = BRAND_GREEN;
                e.currentTarget.style.fontWeight = "700";
                e.currentTarget.style.color = BRAND_DARK;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderBottomColor = "transparent";
                e.currentTarget.style.fontWeight = "400";
              }}
            >
              {cat}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
