import { useEffect, useState } from "react";

import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Package,
  Clock
} from "lucide-react";

import {
  getPendingApps,
  approveApp,
  rejectApp
} from "./storeApi";

export default function AdminPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadPendingApps() {
    setLoading(true);
    setError("");

    try {
      const response = await getPendingApps();

      const pendingApps =
        response.apps ||
        response.pending_apps ||
        response.data?.apps ||
        [];

      setApps(Array.isArray(pendingApps) ? pendingApps : []);

    } catch (err) {
      setError(
        err.message || "Pending Apps लोड नहीं हो पाए।"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPendingApps();
  }, []);

  async function handleApprove(appId) {
    setProcessingId(appId);
    setMessage("");
    setError("");

    try {
      const response = await approveApp(appId);

      setMessage(
        response.message || "App Approved Successfully!"
      );

      await loadPendingApps();

    } catch (err) {
      setError(
        err.message || "App Approve नहीं हो पाया।"
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(appId) {
    const confirmed = window.confirm(
      "क्या आप वाकई इस ऐप को Reject करना चाहते हैं?"
    );

    if (!confirmed) return;

    setProcessingId(appId);
    setMessage("");
    setError("");

    try {
      const response = await rejectApp(appId);

      setMessage(
        response.message || "App Rejected Successfully!"
      );

      await loadPendingApps();

    } catch (err) {
      setError(
        err.message || "App Reject नहीं हो पाया।"
      );
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <section className="admin-page">

      <div className="admin-welcome">
        <ShieldCheck size={38} />

        <div>
          <h2>Admin Control Panel</h2>
          <p>
            MG AppStore में Submit किए गए ऐप्स की समीक्षा करें।
          </p>
        </div>
      </div>

      <div className="admin-stats">

        <div className="stat-card">
          <Clock size={25} />
          <div>
            <strong>{apps.length}</strong>
            <span>Pending Apps</span>
          </div>
        </div>

        <div className="stat-card">
          <Package size={25} />
          <div>
            <strong>{apps.length}</strong>
            <span>Review Required</span>
          </div>
        </div>

      </div>

      {(message || error) && (
        <div className={error ? "error-message" : "success-message"}>
          {error || message}
        </div>
      )}

      <div className="admin-section-heading">

        <h3>App Approval Requests</h3>

        <button
          className="refresh-button"
          onClick={loadPendingApps}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>

      {loading ? (
        <div className="empty-section">
          <RefreshCw size={30} />
          <p>Apps लोड हो रहे हैं...</p>
        </div>
      ) : error && apps.length === 0 ? (
        <div className="empty-section">
          <ShieldCheck size={40} />
          <h3>Requests लोड नहीं हो सकीं</h3>
          <p>{error}</p>

          <button
            className="primary-button"
            onClick={loadPendingApps}
          >
            Retry
          </button>
        </div>
      ) : apps.length === 0 ? (
        <div className="empty-section">
          <CheckCircle size={45} />
          <h3>कोई Pending App नहीं है</h3>
          <p>नए Approval Requests यहाँ दिखाई देंगे।</p>
        </div>
      ) : (
        <div className="admin-app-list">

          {apps.map((app) => (
            <article
              className="admin-app-card"
              key={app.id}
            >

              <div className="admin-app-details">

                <h3>{app.name}</h3>

                <p>{app.description}</p>

                <div className="admin-app-meta">
                  <span>Category: {app.category}</span>
                  <span>Version: {app.version}</span>
                  <span>Developer: {app.developerName || "Unknown"}</span>
                  <span>Status: {app.status}</span>
                </div>

                {app.apkUrl && (
                  <a
                    href={app.apkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="apk-preview-link"
                  >
                    View APK File
                  </a>
                )}

              </div>

              <div className="admin-app-actions">

                <button
                  className="approve-button"
                  disabled={processingId === app.id}
                  onClick={() => handleApprove(app.id)}
                >
                  <CheckCircle size={17} />
                  {processingId === app.id
                    ? "Processing..."
                    : "Approve"}
                </button>

                <button
                  className="reject-button"
                  disabled={processingId === app.id}
                  onClick={() => handleReject(app.id)}
                >
                  <XCircle size={17} />
                  Reject
                </button>

              </div>

            </article>
          ))}

        </div>
      )}

    </section>
  );
}
