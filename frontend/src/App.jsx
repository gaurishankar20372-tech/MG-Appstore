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
import DownloadsPage from "./DownloadsPage.jsx";
import DeveloperPage from "./DeveloperPage.jsx";
import AdminPage from "./AdminPage.jsx";

export default function App() {
  const {
    user,
    isAuthenticated,
    loading,
    logout,
    login,
    register
  } = useAuth();

  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

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
    login: "Sign In / Register"
  };

  function changePage(page) {
    const protectedPages = ["downloads", "developer", "admin"];

    if (protectedPages.includes(page) && !isAuthenticated) {
      setActivePage("login");
    } else if (page === "admin" && user?.role !== "admin") {
      alert("यह पेज केवल Admin के लिए है।");
    } else if (
      page === "developer" &&
      user?.role !== "developer" &&
      user?.role !== "admin"
    ) {
      alert("Developer अकाउंट जरूरी है।");
    } else {
      setActivePage(page);
    }

    setMenuOpen(false);
  }

  async function handleAuth(event) {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const result = isRegister
        ? await register(name, email, password)
        : await login(email, password);

      if (!result.success) {
        setAuthError(result.message || "लॉगिन असफल रहा।");
        return;
      }

      setEmail("");
      setPassword("");
      setName("");

      if (result.user?.role === "admin") {
        setActivePage("admin");
      } else if (result.user?.role === "developer") {
        setActivePage("developer");
      } else {
        setActivePage("home");
      }
    } catch (err) {
      setAuthError(err.message || "कनेक्शन में समस्या हुई।");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    setActivePage("home");
  }

  function handleSearch(event) {
    event.preventDefault();
    setActivePage("apps");
    setMenuOpen(false);
  }

  if (loading) {
    return (
      <div className="empty-section">
        <Store size={40} />
        <h3>MG AppStore लोड हो रहा है...</h3>
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
          <button className="login-button" onClick={handleLogout}>
            <LogOut size={17} />
            Logout
          </button>
        ) : (
          <button
            className="login-button"
            onClick={() => changePage("login")}
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
              <h2>{pageTitles[activePage] || "MG AppStore"}</h2>
            </div>
          </div>

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

              <form
                className="search-section"
                onSubmit={handleSearch}
              >
                <Search size={20} />

                <input
                  type="search"
                  placeholder="ऐप का नाम खोजें..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />

                <button type="submit">
                  Search
                </button>
              </form>

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

          {activePage === "apps" && (
            <AppsPage initialSearch={search} />
          )}

          {activePage === "downloads" && <DownloadsPage />}

          {activePage === "developer" && <DeveloperPage />}

          {activePage === "admin" && <AdminPage />}

          {activePage === "login" && (
            <section className="auth-section">

              <div className="auth-card">
                <User size={42} />

                <h2>
                  {isRegister ? "Create Account" : "Welcome Back"}
                </h2>

                <p>
                  MG AppStore में {isRegister ? "नया अकाउंट बनाएँ" : "लॉगिन करें"}
                </p>

                {authError && (
                  <div className="error-message">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuth}>

                  {isRegister && (
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  )}

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    required
                  />

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={authLoading}
                  >
                    {authLoading
                      ? "Please Wait..."
                      : isRegister
                        ? "Create Account"
                        : "Login"}
                  </button>

                </form>

                <button
                  className="text-button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setAuthError("");
                  }}
                >
                  {isRegister
                    ? "Already have an account? Login"
                    : "Create New Account"}
                </button>
              </div>

            </section>
          )}

          <footer className="footer">
            <p>© 2026 MG AppStore</p>
            <p>Developed by MG Shankar Tech</p>
          </footer>

        </main>
      </div>
    </div>
  );
}
