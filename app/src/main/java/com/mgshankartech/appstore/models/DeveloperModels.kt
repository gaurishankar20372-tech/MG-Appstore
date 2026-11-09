package com.mgshankartech.appstore.models

data class AppUploadRequest(
    val name: String,
    val description: String,
    val category: String,
    val version: String,
    val packageName: String
)

data class DeveloperApp(
    val id: Int,
    val name: String,
    val description: String,
    val category: String,
    val version: String,
    val packageName: String,
    val status: String,
    val downloads: Int
)

data class DeveloperDashboardResponse(
    val success: Boolean,
    val developer_name: String,
    val total_apps: Int,
    val approved_apps: Int,
    val pending_apps: Int,
    val apps: List<DeveloperApp>
)
