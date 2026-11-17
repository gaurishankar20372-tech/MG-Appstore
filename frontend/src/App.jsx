import { useState } from "react";

import {
  Store,
  Search,
  Home,
  Grid3X3,
  Download,
  User,
  Code2,
  ShieldCheck,
  Menu,
  X,
  Smartphone,
  LogOut,
  Loader2
} from "lucide-react";

import { useAuth } from "./auth.jsx";

export default function App() {
  const {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout
  } = useAuth();

  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [authMode, setAuthMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigation = [
    { id: "home", label: "होम", icon: Home },
    { id: "apps", label: "सभी ऐप्स", icon: Grid3X3 },
    { id: "downloads", label: "मेरे डाउनलोड", icon: Download },
    { id: "developer", label: "डेवलपर", icon: Code2 },
    { id: "admin", label: "एडमिन", icon: ShieldCheck }
  ];

  const pageTitles = {
    home: "आपका अपना App Store",
    apps: "सभी ऐप्स",
    downloads: "मेरे डाउनलोड",
    developer: "डेवलपर डैशबोर्ड",
    admin: "एडमिन पैनल",
    login: "लॉगिन / रजिस्ट्रेशन"
  };

  function changePage(page) {
    setMessage("");

    if (
      ["downloads", "developer", "admin"].includes(page) &&
      !isAuthenticated
    ) {
      setActivePage("login");
      setMenuOpen(false);
      return;
    }

    if (page === "admin" && user?.role !== "admin") {
      setActivePage("home");
      setMessage("इस पेज को देखने की अनुमति नहीं है।");
      setMenuOpen(false);
      return;
    }

    if (page === "developer" && user?.role !== "developer") {
      setActivePage("home");
      setMessage(
        "Developer Dashboard के लिए Developer अकाउंट आवश्यक है।"
      );
      setMenuOpen(false);
      return;
    }

    setActivePage(page);
    setMenuOpen(false);
  }

  async function handleAuth(event) {
    event.preventDefault();

    setMessage("");

    if (!email.trim() || !password) {
      setMessage("कृपया Email और Password भरें।");
      return;
    }

    if (authMode === "register") {
      if (!name.trim()) {
        setMessage("कृपया अपना नाम भरें।");
        return;
      }

      if (password.length < 8) {
        setMessage("Password कम-से-कम 8 अक्षरों का होना चाहिए।");
        return;
      }
    }

    setSubmitting(true);

    try {
      let result;

      if (authMode === "login") {
        result = await login(
          email.trim(),
          password
        );
      } else {
        result = await register(
          name.trim(),
          email.trim(),
          password
        );
      }

      if (!result.success) {
        setMessage(result.message || "कुछ गलत हो गया।");
        return;
      }

      setMessage(
        authMode === "login"
          ? "Login सफल रहा!"
          : "आपका अकाउंट बन गया!"
      );

      setPassword("");
      setName("");
      setActivePage("home");

    } catch (error) {
      setMessage(
        error.message || "Server से कनेक्शन नहीं हो पाया।"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await logout();

    setActivePage("home");
    setMessage("आप सफलतापूर्वक Logout हो गए हैं।");
  }

  function openLogin() {
    setAuthMode("login");
    setMessage("");
    setActivePage("login");
  }

  function renderAuthPage() {
    return (
      <section
        className="empty-section"
        style={{
          maxWidth: "460px",
          margin: "30px auto",
          padding: "30px"
        }}
      >
        <User size={48} />

        <h3>
          {authMode === "login"
            ? "Welcome Back!"
            : "Create Your Account"}
        </h3>

        <p>
          {authMode === "login"
            ? "अपने MG AppStore अकाउंट में लॉगिन करें।"
            : "MG AppStore पर नया अकाउंट बनाएँ।"}
        </p>

        <form
          onSubmit={handleAuth}
          style={{
            display: "grid",
            gap: "15px",
            marginTop: "25px"
          }}
        >
          {authMode === "register" && (
            <input
              type="text"
              placeholder="आपका पूरा नाम"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              style={inputStyle}
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
            style={inputStyle}
          />

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2
                  size={17}
                  className="spin"
                />
                कृपया प्रतीक्षा करें...
              </>
            ) : authMode === "login" ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px" }}>
            {message}
          </p>
        )}

        <div style={{ marginTop: "20px" }}>
          {authMode === "login" ? (
            <p>
              नया अकाउंट बनाना है?{" "}
              <button
                onClick={() => {
                  setAuthMode("register");
                  setMessage("");
                }}
                style={linkStyle}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              पहले से अकाउंट है?{" "}
              <button
                onClick={() => {
                  setAuthMode("login");
                  setMessage("");
                }}
                style={linkStyle}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center"
        }}
      >
        <Loader2 size={35} className="spin" />
        <p>MG AppStore लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="app-container">

      <header className="topbar">

        <div className="brand">
          <div className="brand-icon">
            <Store size={25} />
          </div>

          <div>
            <h1>MG AppStore</h1>
            <span>by MG Shankar Tech</span>
          </div>
        </div>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        {isAuthenticated ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <span>
              {user?.name}
            </span>

            <button
              className="login-button"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        ) : (
          <button
            className="login-button"
            onClick={openLogin}
          >
            <User size={17} />
            Sign In
          </button>
        )}

      </header>

      <div className="main-layout">

        <aside
          className={`sidebar ${
            menuOpen ? "show-sidebar" : ""
          }`}
        >

          <div className="sidebar-heading">
            MENU
          </div>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-item ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => changePage(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="sidebar-footer">
            <Smartphone size={18} />
            <span>MG AppStore v1.0</span>
          </div>

        </aside>

        <main className="content">

          <div className="page-heading">
            <div>
              <p className="welcome-text">
                WELCOME TO MG APPSTORE
              </p>

              <h2>
                {pageTitles[activePage] || "MG AppStore"}
              </h2>
            </div>
          </div>

          {message && activePage !== "login" && (
            <p
              style={{
                padding: "12px",
                margin: "10px 0",
                borderRadius: "8px"
              }}
            >
              {message}
            </p>
          )}

          {activePage === "home" && (
            <>

              <section className="hero-section">

                <div className="hero-content">

                  <span className="hero-label">
                    DISCOVER • DOWNLOAD • EXPLORE
                  </span>

                  <h2>
                    आपकी पसंद के ऐप्स,
                    <br />
                    एक ही जगह!
                  </h2>

                  <p>
                    MG AppStore पर नए और उपयोगी Android ऐप्स खोजें।
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => changePage("apps")}
                  >
                    Explore Apps
                  </button>

                </div>

                <div className="hero-graphic">
                  <Store size={100} strokeWidth={1.2} />
                </div>

              </section>

              <section className="search-section">

                <Search size={20} />

                <input
                  type="search"
                  placeholder="ऐप का नाम खोजें..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      changePage("apps");
                    }
                  }}
                />

                <button
                  onClick={() => changePage("apps")}
                >
                  Search
                </button>

              </section>

              <section className="quick-section">

                <h3>Explore Categories</h3>

                <div className="category-grid">

                  {[
                    "AI & Technology",
                    "Education",
                    "Games",
                    "Tools"
                  ].map((category) => (
                    <button
                      className="category-card"
                      key={category}
                      onClick={() => changePage("apps")}
                    >
                      <Grid3X3 size={24} />
                      <span>{category}</span>
                    </button>
                  ))}

                </div>

              </section>

            </>
          )}

          {activePage === "apps" && (
            <section className="empty-section">

              <Store size={48} />

              <h3>Apps Catalogue</h3>

              <p>
                यहाँ उपलब्ध और Approved ऐप्स की सूची दिखाई जाएगी।
              </p>

              <p className="small-note">
                वास्तविक ऐप लिस्ट और डाउनलोड API अगली प्रक्रिया में जोड़ी जाएगी।
              </p>

            </section>
          )}

          {activePage === "downloads" && (
            <section className="empty-section">

              <Download size={48} />

              <h3>My Downloads</h3>

              <p>
                आपके डाउनलोड किए गए ऐप्स यहाँ दिखाई देंगे।
              </p>

            </section>
          )}

          {activePage === "developer" && (
            <section className="empty-section">

              <Code2 size={48} />

              <h3>Developer Dashboard</h3>

              <p>
                यहाँ डेवलपर अपने ऐप्स मैनेज कर सकेंगे।
              </p>

            </section>
          )}

          {activePage === "admin" && (
            <section className="empty-section">

              <ShieldCheck size={48} />

              <h3>Admin Panel</h3>

              <p>
                यहाँ Admin ऐप्स की समीक्षा और Approval कर सकेंगे।
              </p>

            </section>
          )}

          {activePage === "login" && renderAuthPage()}

          <footer className="footer">

            <p>© 2026 MG AppStore</p>

            <p>Developed by MG Shankar Tech</p>

          </footer>

        </main>

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: "8px",
  border: "1px solid #39465c",
  background: "#111c30",
  color: "#ffffff",
  fontSize: "15px",
  boxSizing: "border-box"
};

const linkStyle = {
  border: "none",
  background: "transparent",
  color: "#60a5fa",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px"
};
