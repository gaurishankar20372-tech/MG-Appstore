import api from "./api";

// सभी Approved Apps प्राप्त करें
export async function getApps(category = "") {
  const response = await api.get("/api/apps", {
    params: category ? { category } : {}
  });

  return response.data;
}

// किसी एक App की जानकारी प्राप्त करें
export async function getAppDetails(appId) {
  const response = await api.get(`/api/apps/${appId}`);
  return response.data;
}

// सभी उपलब्ध Categories प्राप्त करें
export async function getCategories() {
  const response = await api.get("/api/categories");
  return response.data;
}

// Store Statistics प्राप्त करें
export async function getStoreStats() {
  const response = await api.get("/api/store/stats");
  return response.data;
}

// Download History प्राप्त करें
export async function getDownloadHistory() {
  const response = await api.get("/api/downloads/history");
  return response.data;
}

// किसी App का Download Record बनाएँ
export async function recordDownload(appId) {
  const response = await api.post(
    `/api/downloads/record/${appId}`
  );

  return response.data;
}

// Developer Dashboard प्राप्त करें
export async function getDeveloperDashboard() {
  const response = await api.get(
    "/api/developer/dashboard"
  );

  return response.data;
}

// Developer द्वारा नया App Submit करें
export async function submitDeveloperApp(appData) {
  const response = await api.post(
    "/api/developer/apps",
    appData
  );

  return response.data;
}

// Developer App में APK Upload करें
export async function uploadAppAPK(appId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/api/upload/app/${appId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      timeout: 120000
    }
  );

  return response.data;
}

// Admin के Pending Apps प्राप्त करें
export async function getPendingApps() {
  const response = await api.get(
    "/api/admin/pending-apps"
  );

  return response.data;
}

// Admin द्वारा App Approve करें
export async function approveApp(appId) {
  const response = await api.post(
    `/api/admin/apps/${appId}/approve`
  );

  return response.data;
}

// Admin द्वारा App Reject करें
export async function rejectApp(appId) {
  const response = await api.post(
    `/api/admin/apps/${appId}/reject`
  );

  return response.data;
}

// Admin द्वारा User को Developer बनाना
export async function makeUserDeveloper(userId) {
  const response = await api.post(
    `/api/admin/users/${userId}/make-developer`
  );

  return response.data;
}
