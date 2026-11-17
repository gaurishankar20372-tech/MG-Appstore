import { useEffect, useState } from "react";

import {
  Download,
  Smartphone,
  RefreshCw,
  PackageOpen
} from "lucide-react";

import {
  getDownloadHistory
} from "./storeApi";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
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
          response.records ||
          [];

      setDownloads(records);

    } catch (err) {
      setError(
        err.message || "Download History लोड नहीं हो पाई।"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDownloads();
  }, []);

  function downloadAgain(item) {
    if (!item.appId) {
      alert("इस ऐप की जानकारी उपलब्ध नहीं है।");
      return;
    }

    alert(
      "दोबारा डाउनलोड करने के लिए Apps Catalogue खोलें और ऐप खोजें।"
    );
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

      <div className="downloads-heading">
        <div>
          <h3>My Download History</h3>
          <p>
            आपके डाउनलोड किए गए ऐप्स की जानकारी।
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
          <p>{error}</p>

          <button onClick={loadDownloads}>
            दोबारा कोशिश करें
          </button>
        </div>
      )}

      {!error && downloads.length === 0 && (
        <div className="empty-section">
          <PackageOpen size={48} />

          <h3>अभी कोई Download नहीं है</h3>

          <p>
            Apps Catalogue से अपना पसंदीदा ऐप डाउनलोड करें।
          </p>
        </div>
      )}

      <div className="downloads-list">

        {downloads.map((item) => (
          <article
            className="download-card"
            key={item.id}
          >

            <div className="download-icon">
              <Smartphone size={28} />
            </div>

            <div className="download-info">
              <h3>
                {item.appName || "Unknown App"}
              </h3>

              <p>
                Downloaded:{" "}
                {item.downloadedAt
                  ? new Date(
                      item.downloadedAt
                    ).toLocaleString()
                  : "Date unavailable"}
              </p>

              <small>
                App ID: {item.appId}
              </small>
            </div>

            <button
              className="download-again-button"
              onClick={() => downloadAgain(item)}
            >
              <Download size={17} />
              Details
            </button>

          </article>
        ))}

      </div>

    </section>
  );
}
