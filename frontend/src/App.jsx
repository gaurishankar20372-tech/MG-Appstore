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
  LogOut
} from "lucide-react";

import { useAuth } from "./auth.jsx";
import AppsPage from "./AppsPage.jsx";

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
      setMessage("इस पेज को देखने की अनुमति नहीं है।");
      setMenuOpen(false);
      return;
    }

    if (page === "developer" && user?.role !== "developer") {
      setMessage("Developer अकाउंट आवश्यक है।");
      setMenuOpen(false);
      return;
    }

    setActivePage(page);
    setMenuOpen(false);
  }

  async function handleAuth(event) {
    event.preventDefault();
    setMessage("");

    if (authMode === "register" && !name.trim()) {
      setMessage("कृपया अपना नाम भरें।");
      return;
    }

    if (password.length < (authMode === "register" ? 8 : 1)) {
      setMessage("Password कम-से-कम 8 अक्षरों का होना चाहिए।");
      return;
    }

    setSubmitting(true);

    try {
      const result =
        authMode === "login"
          ? await login(email.trim(), password)
          : await register(name.trim(), email.trim(), password);

      if (!result.success) {
        setMessage(result.message || "प्रक्रिया असफल रही।");
        return;
      }

      setPassword("");
      setName("");
      setMessage("सफलतापूर्वक पूरा हुआ!");
      setActivePage("home");

    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await logout();
    setActivePage("home");
    setMessage("आप Logout हो गए हैं।");
  }

  function renderAuthPage() {
    return (
      <section className="empty-section">
        <User size={45} />

        <h3>
          {authMode === "login" ? "Welcome Back!" : "Create Account"}
        </h3>

        <form
          onSubmit={handleAuth}
          style={{
            display: "grid",
            gap: "14px",
            maxWidth: "400px",
            margin: "20px auto"
          }}
        >
          {authMode === "register" && (
            <input
              style={inputStyle}
              placeholder="आपका नाम"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            style={inputStyle}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="primary-button"
            disabled={submitting}
          >
            {submitting
              ? "कृपया प्रतीक्षा करें..."
              : authMode === "login"
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        {message && <p>{message}</p>}

        <button
          style={linkStyle}
          onClick={() => {
            setAuthMode(
              authMode === "login" ? "register" : "login"
            );
            setMessage("");
          }}
        >
          {authMode === "login"
            ? "नया अकाउंट बनाएँ"
            : "पहले से अकाउंट है? Login करें"}
        </button>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="empty-section">
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
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        {isAuthenticated ? (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span>{user?.name}</span>

            <button className="login-button" onClick={handleLogout}>
              <LogOut size={17} />
              Logout
            </button>
          </div>
        ) : (
          <button
            className="login-button"
            onClick={() => {
              setAuthMode("login");
              setActivePage("login");
            }}
          >
            <User size={17} />
            Sign In
          </button>
        )}
      </header>

      <div className="main-layout">

        <aside className={`sidebar ${menuOpen ? "show-sidebar" : ""}`}>
          <div className="sidebar-heading">MENU</div>

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
              <p className="welcome-text">WELCOME TO MG APPSTORE</p>
              <h2>{pageTitles[activePage]}</h2>
            </div>
          </div>

          {message && activePage !== "login" && (
            <p>{message}</p>
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
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") changePage("apps");
                  }}
                />

                <button onClick={() => changePage("apps")}>
                  Search
                </button>
              </section>

              <section className="quick-section">
                <h3>Explore Categories</h3>

                <div className="category-grid">
                  {["AI & Technology", "Education", "Games", "Tools"].map(
                    (category) => (
                      <button
                        className="category-card"
                        key={category}
                        onClick={() => changePage("apps")}
                      >
                        <Grid3X3 size={24} />
                        <span>{category}</span>
                      </button>
                    )
                  )}
                </div>
              </section>
            </>
          )}

          {activePage === "apps" && <AppsPage />}

          {activePage === "downloads" && (
            <section className="empty-section">
              <Download size={48} />
              <h3>My Downloads</h3>
              <p>आपके डाउनलोड किए गए ऐप्स यहाँ दिखाई देंगे।</p>
            </section>
          )}

          {activePage === "developer" && (
            <section className="empty-section">
              <Code2 size={48} />
              <h3>Developer Dashboard</h3>
              <p>यहाँ डेवलपर अपने ऐप्स मैनेज कर सकेंगे।</p>
            </section>
          )}

          {activePage === "admin" && (
            <section className="empty-section">
              <ShieldCheck size={48} />
              <h3>Admin Panel</h3>
              <p>यहाँ ऐप्स की समीक्षा और Approval होगा।</p>
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
  fontSize: "15px"
};
