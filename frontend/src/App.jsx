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
  Smartphone
} from "lucide-react";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

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
    admin: "एडमिन पैनल"
  };

  function changePage(page) {
    setActivePage(page);
    setMenuOpen(false);
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

        <button
          className="login-button"
          onClick={() => changePage("login")}
        >
          <User size={17} />
          Sign In
        </button>
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
                  <span className="hero-label">DISCOVER • DOWNLOAD • EXPLORE</span>

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
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      changePage("apps");
                    }
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

          {activePage === "apps" && (
            <section className="empty-section">
              <Store size={48} />
              <h3>Apps Catalogue</h3>
              <p>
                यहाँ उपलब्ध ऐप्स की सूची दिखाई जाएगी।
              </p>
              <p className="small-note">
                ऐप्स लोड करने के लिए Backend API कनेक्शन अगली प्रक्रिया में जोड़ा जाएगा।
              </p>
            </section>
          )}

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
              <p>यहाँ ऐप्स की समीक्षा और अप्रूवल की सुविधा होगी।</p>
            </section>
          )}

          {activePage === "login" && (
            <section className="empty-section">
              <User size={48} />
              <h3>Sign In / Register</h3>
              <p>लॉगिन और रजिस्ट्रेशन फॉर्म अगली प्रक्रिया में जोड़े जाएँगे।</p>
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
