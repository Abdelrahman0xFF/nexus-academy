import { useState } from "react";

const GREEN = "#9fef00";
const DARK  = "#1c1d1f";

// ─── Icons ───────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.16C6.51 42.62 14.62 48 24 48z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.16C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.75l7.97-6.16z"/>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.16C12.43 13.72 17.74 9.5 24 9.5z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={DARK}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
);

// ─── Illustration (same as SignUp page) ──────────────────────
const LoginIllustration = () => (
  <svg viewBox="0 0 420 480" width="100%" style={{ maxWidth: 420 }} aria-hidden="true">
    <circle cx="230" cy="240" r="185" fill="#e8e8e8" opacity="0.5"/>
    <circle cx="230" cy="240" r="185" fill="none" stroke="#c8c8c8" strokeWidth="1.5"/>
    <circle cx="260" cy="130" r="28" fill="none" stroke={DARK} strokeWidth="2"/>
    <ellipse cx="260" cy="130" rx="14" ry="28" fill="none" stroke={DARK} strokeWidth="1.5"/>
    <line x1="232" y1="130" x2="288" y2="130" stroke={DARK} strokeWidth="1.5"/>
    <text x="254" y="134" fontSize="10" fill={DARK}>✱</text>
    <rect x="172" y="330" width="90" height="38" rx="4" fill="none" stroke={DARK} strokeWidth="2"/>
    <polygon points="195,355 185,370 205,370" fill="none" stroke={DARK} strokeWidth="1.5"/>
    <rect x="207" y="354" width="14" height="14" rx="1" fill="none" stroke={DARK} strokeWidth="1.5"/>
    <circle cx="243" cy="361" r="6" fill="none" stroke={DARK} strokeWidth="1.5"/>
    <rect x="148" y="248" width="52" height="38" rx="4" fill="none" stroke={DARK} strokeWidth="2"/>
    <text x="162" y="274" fontSize="18" fill={DARK} fontWeight="bold">@</text>
    <rect x="302" y="115" width="60" height="36" rx="2" fill="none" stroke={DARK} strokeWidth="2"/>
    {[310,318,326,334,342,350,358].map((x,i) => (
      <rect key={i} x={x} y="115" width="7" height="36" rx="1" fill={i%2===0?"#fff":DARK} stroke={DARK} strokeWidth="0.8"/>
    ))}
    <rect x="160" y="165" width="36" height="36" rx="3" fill={DARK}/>
    <circle cx="178" cy="183" r="8" fill="none" stroke="#fff" strokeWidth="2"/>
    <circle cx="178" cy="183" r="3" fill="#fff"/>
    <path d="M310 290 L340 280 L370 290 L370 315 Q355 330 340 335 Q325 330 310 315 Z" fill="none" stroke={DARK} strokeWidth="2"/>
    <polygon points="268,228 268,258 276,250 282,265 287,263 281,248 292,248" fill={DARK}/>
    {/* Person 1 */}
    <circle cx="108" cy="192" r="28" fill="#f4c89a"/>
    <ellipse cx="108" cy="170" rx="28" ry="14" fill="#e07830"/>
    {[0,8,16,24,32,40,48].map((y,i) => (
      <rect key={i} x="76" y={230+y} width="64" height="8" fill={i%2===0?"#e8e8e8":"#fff"} opacity="0.95"/>
    ))}
    <rect x="76" y="230" width="64" height="56" rx="4" fill="none" stroke="#bbb" strokeWidth="1"/>
    <line x1="76" y1="248" x2="148" y2="262" stroke="#f4c89a" strokeWidth="14" strokeLinecap="round"/>
    <line x1="140" y1="260" x2="160" y2="255" stroke="#f4c89a" strokeWidth="10" strokeLinecap="round"/>
    <line x1="140" y1="248" x2="148" y2="300" stroke="#f4c89a" strokeWidth="14" strokeLinecap="round"/>
    <rect x="82" y="284" width="26" height="90" rx="8" fill={DARK}/>
    <rect x="112" y="284" width="26" height="90" rx="8" fill={DARK}/>
    <ellipse cx="95"  cy="374" rx="22" ry="10" fill="#e8e8e8"/>
    <ellipse cx="125" cy="374" rx="22" ry="10" fill="#e8e8e8"/>
    <ellipse cx="95"  cy="373" rx="18" ry="7"  fill="#fff"/>
    <ellipse cx="125" cy="373" rx="18" ry="7"  fill="#fff"/>
    {/* Person 2 */}
    <ellipse cx="295" cy="265" rx="38" ry="50" fill="#2d2d2d"/>
    {[...Array(24)].map((_,i) => (
      <circle key={i} cx={270+(i%6)*10} cy={240+Math.floor(i/6)*14} r="1.5" fill="#555"/>
    ))}
    <circle cx="295" cy="195" r="26" fill="#3d2b1f"/>
    <path d="M295 175 Q310 200 300 230 Q295 245 290 260" stroke="#1a0f0a" strokeWidth="14" fill="none" strokeLinecap="round"/>
    {[...Array(16)].map((_,i) => {
      const col = i%4; const row = Math.floor(i/4);
      return <rect key={i} x={268+col*14} y={308+row*14} width="14" height="14"
        fill={(col+row)%2===0?"#1a1a1a":"#f0f0f0"} opacity="0.9"/>
    })}
    <line x1="275" y1="355" x2="255" y2="400" stroke="#1a1a1a" strokeWidth="16" strokeLinecap="round"/>
    <line x1="315" y1="355" x2="335" y2="395" stroke="#f0f0f0" strokeWidth="16" strokeLinecap="round"/>
    <ellipse cx="248" cy="405" rx="20" ry="10" fill="#111"/>
    <ellipse cx="338" cy="400" rx="20" ry="10" fill="#f0f0f0"/>
    {/* Green accents */}
    <circle cx="190" cy="160" r="5" fill={GREEN} opacity="0.7"/>
    <circle cx="355" cy="340" r="4" fill={GREEN} opacity="0.6"/>
    <circle cx="150" cy="310" r="3" fill={GREEN} opacity="0.5"/>
    <circle cx="340" cy="200" r="3" fill={GREEN} opacity="0.5"/>
  </svg>
);

// ─── Divider ─────────────────────────────────────────────────
const Divider = () => (
  <div style={{ height:"1px", backgroundColor:"#e0e0e0", width:"100%", margin:"2px 0" }}/>
);

// ─── LoginPage Component ──────────────────────────────────────
export default function LoginPage({ onSignupClick }) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused]   = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  const inputStyle = (field) => ({
    width:"100%", padding:"14px 16px", fontSize:"15px",
    border: focused[field] ? `2px solid ${GREEN}` : "1.5px solid #c8c8c8",
    borderRadius:"4px", outline:"none", fontFamily:"inherit",
    boxSizing:"border-box", color:DARK, backgroundColor:"#fff",
    boxShadow: focused[field] ? `0 0 0 3px ${GREEN}22` : "none",
    transition:"all 0.15s",
  });

  const rowBtn = (onClick, children) => (
    <button
      onClick={onClick}
      style={{
        width:"100%", padding:"16px", backgroundColor:"#f7f9fa",
        border:"none", borderRadius:"0", cursor:"pointer",
        fontSize:"14px", fontWeight:"700", color:GREEN,
        fontFamily:"inherit", textAlign:"center", transition:"background 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor="#eef5e0"}
      onMouseLeave={e => e.currentTarget.style.backgroundColor="#f7f9fa"}
    >{children}</button>
  );

  if (loggedIn) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:"16px" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", backgroundColor:GREEN, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"32px" }}>✓</div>
      <h2 style={{ color:DARK, margin:0, fontSize:"24px", fontFamily:"Georgia, serif" }}>Welcome back to neXus!</h2>
      <p style={{ color:"#6d6d6d", margin:0 }}>You are now logged in.</p>
    </div>
  );

  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"center",
      minHeight:"calc(100vh - 60px)", backgroundColor:"#f5f5f5",
      padding:"40px 20px", boxSizing:"border-box",
    }}>
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"center",
        gap:"60px", maxWidth:"1000px", width:"100%",
      }}>

        {/* Left — Illustration */}
        <div style={{ flex:"0 0 auto", display:"flex", alignItems:"center", justifyContent:"center", maxWidth:"420px", width:"100%" }}>
          <LoginIllustration />
        </div>

        {/* Right — Form */}
        <div style={{ flex:"0 0 400px", maxWidth:"420px", width:"100%" }}>
          <h1 style={{
            fontSize:"30px", fontWeight:"700", color:DARK,
            marginBottom:"32px", fontFamily:"Georgia, serif",
            textAlign:"center", lineHeight:"1.3",
          }}>
            Log in to continue your<br/>learning journey
          </h1>

          {!showEmailForm ? (
            /* ── Quick login options ── */
            <div style={{ border:"1px solid #e0e0e0", borderRadius:"4px", overflow:"hidden" }}>

              {/* Continue with Google */}
              <button
                onClick={() => setLoggedIn(true)}
                style={{
                  width:"100%", padding:"16px 20px", backgroundColor:"#fff",
                  border:"none", cursor:"pointer", display:"flex", alignItems:"center",
                  gap:"12px", fontSize:"15px", fontWeight:"700", color:DARK,
                  fontFamily:"inherit", transition:"background 0.15s",
                  outline: `1.5px solid ${GREEN}`,
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor="#f0ffe0"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor="#fff"}
              >
                <GoogleIcon/>
                Continue with Google
              </button>

              <Divider/>

              {/* Log in to a different account */}
              {rowBtn(() => setShowEmailForm(true), "Log in to a different account")}

              <Divider/>

              {/* Don't have an account */}
              <div style={{
                width:"100%", padding:"16px", backgroundColor:"#f7f9fa",
                fontSize:"14px", color:"#4a4a4a", textAlign:"center",
                boxSizing:"border-box",
              }}>
                Don't have an account?{" "}
                <button onClick={onSignupClick} style={{
                  background:"none", border:"none", color:GREEN, fontWeight:"700",
                  cursor:"pointer", fontSize:"14px", fontFamily:"inherit",
                  padding:0, textDecoration:"underline",
                }}>Sign up</button>
              </div>

              <Divider/>

              {/* Log in with your organization */}
              {rowBtn(() => {}, "Log in with your organization")}

            </div>

          ) : (
            /* ── Email / password form ── */
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

              <input
                type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused(p=>({...p,email:true}))}
                onBlur={()  => setFocused(p=>({...p,email:false}))}
                style={inputStyle("email")}
              />

              <input
                type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused(p=>({...p,pass:true}))}
                onBlur={()  => setFocused(p=>({...p,pass:false}))}
                style={inputStyle("pass")}
              />

              <div style={{ textAlign:"right" }}>
                <a href="#" style={{ fontSize:"13px", color:GREEN, fontWeight:"600", textDecoration:"none" }}>
                  Forgot password?
                </a>
              </div>

              {/* Log in button */}
              <button
                onClick={() => { if(email && password) setLoggedIn(true); }}
                style={{
                  width:"100%", padding:"14px", fontSize:"15px", fontWeight:"700",
                  backgroundColor:GREEN, color:DARK, border:"none", borderRadius:"4px",
                  cursor:"pointer", transition:"all 0.15s", fontFamily:"inherit",
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor="#8cd900"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor=GREEN}
              >
                Log in
              </button>

              {/* Divider */}
              <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"4px 0" }}>
                <div style={{ flex:1, height:"1px", backgroundColor:"#d1d7dc" }}/>
                <span style={{ fontSize:"13px", color:"#6d6d6d", whiteSpace:"nowrap" }}>Or continue with</span>
                <div style={{ flex:1, height:"1px", backgroundColor:"#d1d7dc" }}/>
              </div>

              {/* Social buttons */}
              <div style={{ display:"flex", justifyContent:"center", gap:"12px" }}>
                {[
                  { icon:<GoogleIcon/>,   label:"Google"   },
                  { icon:<FacebookIcon/>, label:"Facebook" },
                  { icon:<AppleIcon/>,    label:"Apple"    },
                ].map(({ icon, label }) => (
                  <button key={label} title={`Continue with ${label}`} style={{
                    width:"52px", height:"52px", borderRadius:"4px",
                    border:`1.5px solid ${DARK}`, backgroundColor:"#fff",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    cursor:"pointer", transition:"all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=GREEN; e.currentTarget.style.boxShadow=`0 0 0 2px ${GREEN}44`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor=DARK;  e.currentTarget.style.boxShadow="none"; }}
                  >{icon}</button>
                ))}
              </div>

              {/* Back link */}
              <button onClick={() => setShowEmailForm(false)} style={{
                background:"none", border:"none", color:"#6d6d6d", cursor:"pointer",
                fontSize:"13px", fontFamily:"inherit", textAlign:"center", marginTop:"4px",
              }}>
                ← Back to login options
              </button>

              {/* Sign up link */}
              <div style={{ backgroundColor:"#f7f9fa", borderRadius:"4px", padding:"14px", textAlign:"center", fontSize:"14px", color:DARK }}>
                Don't have an account?{" "}
                <button onClick={onSignupClick} style={{
                  background:"none", border:"none", color:GREEN, fontWeight:"700",
                  cursor:"pointer", fontSize:"14px", fontFamily:"inherit", padding:0,
                }}>Sign up</button>
              </div>

            </div>
          )}

          {/* Organization login row (always visible outside form) */}
          {!showEmailForm && (
            <div style={{ marginTop:"16px", display:"flex", justifyContent:"center", alignItems:"center", gap:"8px" }}>
              <BuildingIcon/>
              <button onClick={() => {}} style={{
                background:"none", border:"none", color:GREEN, fontWeight:"700",
                cursor:"pointer", fontSize:"13px", fontFamily:"inherit", padding:0,
              }}>
                Log in with your organization
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
