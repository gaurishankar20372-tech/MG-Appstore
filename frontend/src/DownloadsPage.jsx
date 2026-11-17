import { useEffect, useState } from "react";

import {
  Download,
  RefreshCw,
  Smartphone,
  PackageOpen,
  Calendar,
  History
} from "lucide-react";

import {
  getDownloadHistory,
  getAppDetails
} from "./storeApi";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState("");

  async function loadDownloads() {
    setLoading(true);
    setError("");

    try {
      const response = await getDownloadHistory();

      const records = Array.isArray(response)
        ? response
        : response.downloads ||
          response.history ||
          response.data?.downloads ||
          [];

      setDownloads(records);

    } catch (err) {
      setError(
        err.message || "Download History लोड नहीं हो सकी।"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDownloads();
  }, []);

  async function downloadAgain(appId) {
    setDownloadingId(appId);
    setError("");

    try {
      const response = await getAppDetails(appId);

      const app =
        response.app ||
        response.data?.app ||
        response;

      if (!app?.apkUrl) {
        throw new Error("इस ऐप की APK अभी उपलब्ध नहीं है।");
      }

      window.location.href = app.apkUrl;

    } catch (err) {
      setError(
        err.message || "Download शुरू नहीं हो पाया।"
      );
    } finally {
      setDownloadingId(null);
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) return "तारीख उपलब्ध नहीं";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "तारीख उपलब्ध नहीं";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (loading) {
    return (
      <section className="empty-section">
        <RefreshCw size={32} />
        <h3>Download History लोड हो रही है...</h3>
      </section>
    );
  }

  return (
    <section className="downloads-page">

      <div className="downloads-header">
        <div>
          <h3>
            <History size={22} />
            My Downloads
          </h3>

          <p>
            आपके डाउनलोड किए गए ऐप्स की पूरी हिस्ट्री।
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={loadDownloads}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="downloads-count">
        <Download size={22} />

        <div>
          <strong>{downloads.length}</strong>
          <span>Total Download Records</span>
        </div>
      </div>

      {downloads.length === 0 ? (
        <div className="empty-section">
          <PackageOpen size={48} />

          <h3>अभी कोई Download नहीं है</h3>

          <p>
            आपके डाउनलोड किए गए ऐप्स यहाँ दिखाई देंगे।
          </p>
        </div>
      ) : (
        <div className="downloads-list">

          {downloads.map((item, index) => {
            const appId = item.appId ?? item.app_id;

            return (
              <article
                className="download-card"
                key={item.id || `${appId}-${index}`}
              >

                <div className="download-app-icon">
                  <Smartphone size={29} />
                </div>

                <div className="download-app-info">

                  <h3>
                    {item.appName ||
                     item.app_name ||
                     "Unknown App"}
                  </h3>

                  <p>
                    <Calendar size={14} />
                    {formatDate(
                      item.downloadedAt ||
                      item.downloaded_at
                    )}
                  </p>

                  <span>
                    App ID: {appId ?? "N/A"}
                  </span>

                </div>

                <button
                  className="download-again-button"
                  disabled={
                    !appId || downloadingId === appId
                  }
                  onClick={() => downloadAgain(appId)}
                >
                  <Download size={17} />

                  {downloadingId === appId
                    ? "Loading..."
                    : "Download Again"}
                </button>

              </article>
            );
          })}

        </div>
      )}

    </section>
  );
}
