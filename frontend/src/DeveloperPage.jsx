import { useEffect, useState } from "react";

import {
  Code2,
  Package,
  CheckCircle,
  Clock,
  Upload,
  RefreshCw,
  Plus,
  Smartphone
} from "lucide-react";

import {
  getDeveloperDashboard,
  submitDeveloperApp,
  uploadAppAPK
} from "./storeApi";

export default function DeveloperPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    version: "1.0.0",
    packageName: ""
  });

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const response = await getDeveloperDashboard();

      setDashboard(response);
    } catch (err) {
      setError(
        err.message || "Developer Dashboard लोड नहीं हुआ।"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    setSubmitting(true);

    try {
      const response = await submitDeveloperApp(form);

      setMessage(
        response.message ||
        "आपका ऐप सफलतापूर्वक Submit हो गया।"
      );

      setForm({
        name: "",
        description: "",
        category: "",
        version: "1.0.0",
        packageName: ""
      });

      await loadDashboard();

    } catch (err) {
      setError(
        err.message || "ऐप Submit नहीं हो पाया।"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAPKUpload(appId, event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".apk")) {
      setError("केवल APK फाइल अपलोड करें।");
      event.target.value = "";
      return;
    }

    if (file.size > 200 * 1024 * 1024) {
      setError("APK का आकार 200 MB से कम होना चाहिए।");
      event.target.value = "";
      return;
    }

    setUploadingId(appId);
    setMessage("");
    setError("");

    try {
      const response = await uploadAppAPK(appId, file);

      setMessage(
        response.message || "APK सफलतापूर्वक अपलोड हो गई।"
      );

      await loadDashboard();

    } catch (err) {
      setError(
        err.message || "APK अपलोड नहीं हो पाई।"
      );
    } finally {
      setUploadingId(null);
      event.target.value = "";
    }
  }

  if (loading) {
    return (
      <section className="empty-section">
        <RefreshCw size={32} />
        <h3>Developer Dashboard लोड हो रहा है...</h3>
      </section>
    );
  }

  if (error && !dashboard) {
    return (
      <section className="empty-section">
        <Code2 size={45} />
        <h3>Dashboard उपलब्ध नहीं है</h3>
        <p>{error}</p>

        <button
          className="primary-button"
          onClick={loadDashboard}
        >
          दोबारा कोशिश करें
        </button>
      </section>
    );
  }

  const apps = dashboard?.apps || [];

  return (
    <section className="developer-page">

      <div className="developer-welcome">
        <Code2 size={35} />

        <div>
          <h3>
            Welcome, {dashboard?.developer || "Developer"}
          </h3>

          <p>
            अपने ऐप्स और उनके Approval Status को मैनेज करें।
          </p>
        </div>
      </div>

      {(message || error) && (
        <div className={error ? "error-message" : "success-message"}>
          {error || message}
        </div>
      )}

      <div className="developer-stats">

        <div className="stat-card">
          <Package size={25} />
          <div>
            <strong>{dashboard?.total_apps ?? 0}</strong>
            <span>Total Apps</span>
          </div>
        </div>

        <div className="stat-card">
          <CheckCircle size={25} />
          <div>
            <strong>{dashboard?.approved_apps ?? 0}</strong>
            <span>Approved Apps</span>
          </div>
        </div>

        <div className="stat-card">
          <Clock size={25} />
          <div>
            <strong>{dashboard?.pending_apps ?? 0}</strong>
            <span>Pending Apps</span>
          </div>
        </div>

      </div>

      <div className="developer-form-section">

        <h3>
          <Plus size={21} />
          नया ऐप Submit करें
        </h3>

        <form
          onSubmit={handleSubmit}
          className="developer-form"
        >

          <input
            name="name"
            placeholder="App Name"
            value={form.name}
            onChange={updateForm}
            required
          />

          <textarea
            name="description"
            placeholder="App Description"
            value={form.description}
            onChange={updateForm}
            rows={4}
            required
          />

          <input
            name="category"
            placeholder="Category जैसे Education, Tools"
            value={form.category}
            onChange={updateForm}
            required
          />

          <input
            name="version"
            placeholder="Version"
            value={form.version}
            onChange={updateForm}
            required
          />

          <input
            name="packageName"
            placeholder="Package Name जैसे com.example.myapp"
            value={form.packageName}
            onChange={updateForm}
            required
          />

          <button
            className="primary-button"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Submit हो रहा है..."
              : "Submit App"}
          </button>

        </form>

      </div>

      <div className="developer-apps-section">

        <div className="section-heading">
          <h3>मेरे ऐप्स</h3>

          <button
            className="refresh-button"
            onClick={loadDashboard}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {apps.length === 0 ? (
          <div className="empty-section">
            <Smartphone size={42} />
            <h3>अभी कोई ऐप नहीं है</h3>
            <p>अपना पहला ऐप Submit करके शुरुआत करें।</p>
          </div>
        ) : (
          <div className="developer-app-list">

            {apps.map((app) => (
              <article
                className="developer-app-card"
                key={app.id}
              >

                <div className="developer-app-info">
                  <h3>{app.name}</h3>

                  <p>{app.description}</p>

                  <span>
                    Version: {app.version}
                  </span>

                  <span>
                    Status: {app.status}
                  </span>
                </div>

                <label className="upload-button">

                  <Upload size={17} />

                  {uploadingId === app.id
                    ? "Uploading..."
                    : "Upload APK"}

                  <input
                    type="file"
                    accept=".apk,application/vnd.android.package-archive"
                    hidden
                    disabled={uploadingId === app.id}
                    onChange={(event) =>
                      handleAPKUpload(app.id, event)
                    }
                  />

                </label>

              </article>
            ))}

          </div>
        )}

      </div>

    </section>
  );
}
