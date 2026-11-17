import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Download,
  Smartphone,
  RefreshCw,
  PackageOpen
} from "lucide-react";

import {
  getApps,
  getCategories,
  getStoreStats,
  recordDownload
} from "./storeApi";

export default function AppsPage() {
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    totalApps: 0,
    totalDownloads: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  async function loadData(category = "") {
    setLoading(true);
    setError("");

    try {
      const [appsResponse, categoriesResponse, statsResponse] =
        await Promise.all([
          getApps(category),
          getCategories(),
          getStoreStats()
        ]);

      const appList = Array.isArray(appsResponse)
        ? appsResponse
        : appsResponse.apps || [];

      const categoryList = Array.isArray(categoriesResponse)
        ? categoriesResponse
        : categoriesResponse.categories || [];

      setApps(appList);
      setCategories(categoryList);

      setStats({
        totalApps:
          statsResponse.totalApps ??
          statsResponse.total_apps ??
          0,

        totalDownloads:
          statsResponse.totalDownloads ??
          statsResponse.total_downloads ??
          0
      });

    } catch (err) {
      setError(
        err.message || "Apps लोड नहीं हो पाए।"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(selectedCategory);
  }, [selectedCategory]);

  const filteredApps = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return apps;

    return apps.filter((app) =>
      [
        app.name,
        app.description,
        app.category,
        app.developerName
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(query)
        )
    );
  }, [apps, search]);

  async function handleDownload(app) {
    if (!app.apkUrl) {
      alert("इस ऐप की APK अभी उपलब्ध नहीं है।");
      return;
    }

    setDownloadingId(app.id);

    try {
      await recordDownload(app.id);

      window.location.href = app.apkUrl;

    } catch (err) {
      alert(
        err.message || "Download शुरू नहीं हो पाया।"
      );
    } finally {
      setDownloadingId(null);
    }
  }

  if (loading) {
    return (
      <section className="empty-section">
        <RefreshCw size={32} className="spin" />
        <h3>Apps लोड हो रहे हैं...</h3>
      </section>
    );
  }

  return (
    <section className="apps-page">

      <div className="apps-stats">

        <div className="stat-card">
          <Smartphone size={25} />
          <div>
            <strong>{stats.totalApps}</strong>
            <span>Available Apps</span>
          </div>
        </div>

        <div className="stat-card">
          <Download size={25} />
          <div>
            <strong>{stats.totalDownloads}</strong>
            <span>Total Downloads</span>
          </div>
        </div>

      </div>

      <div className="apps-toolbar">

        <div className="apps-search">
          <Search size={19} />

          <input
            type="search"
            placeholder="ऐप का नाम खोजें..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(event.target.value)
          }
          aria-label="Select category"
        >
          <option value="">सभी Categories</option>

          {categories.map((category) => {
            const value =
              typeof category === "string"
                ? category
                : category.name;

            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>

        <button
          className="refresh-button"
          onClick={() => loadData(selectedCategory)}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>

          <button
            onClick={() => loadData(selectedCategory)}
          >
            दोबारा कोशिश करें
          </button>
        </div>
      )}

      {!error && filteredApps.length === 0 && (
        <div className="empty-section">
          <PackageOpen size={45} />

          <h3>कोई ऐप नहीं मिला</h3>

          <p>
            दूसरा नाम या Category चुनकर देखें।
          </p>
        </div>
      )}

      <div className="apps-grid">

        {filteredApps.map((app) => (
          <article
            className="app-card"
            key={app.id}
          >

            <div className="app-card-header">

              {app.iconUrl ? (
                <img
                  src={app.iconUrl}
                  alt={`${app.name} icon`}
                  className="app-icon"
                />
              ) : (
                <div className="app-icon-placeholder">
                  <Smartphone size={30} />
                </div>
              )}

              <div className="app-heading">
                <h3>{app.name}</h3>
                <span>{app.category}</span>
              </div>

            </div>

            <p className="app-description">
              {app.description}
            </p>

            <div className="app-meta">
              <span>Version: {app.version}</span>
              <span>
                {app.downloads || 0} Downloads
              </span>
            </div>

            <div className="app-developer">
              Developer: {app.developerName || "Unknown"}
            </div>

            <button
              className="primary-button"
              onClick={() => handleDownload(app)}
              disabled={
                downloadingId === app.id || !app.apkUrl
              }
            >
              {downloadingId === app.id ? (
                "कृपया प्रतीक्षा करें..."
              ) : (
                <>
                  <Download size={17} />
                  {app.apkUrl ? "Download APK" : "APK उपलब्ध नहीं"}
                </>
              )}
            </button>

          </article>
        ))}

      </div>

    </section>
  );
}
