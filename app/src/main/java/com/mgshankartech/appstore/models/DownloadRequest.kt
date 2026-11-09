package com.mgshankartech.appstore.models

data class DownloadRequest(
    val appId: Int,
    val appName: String,
    val apkUrl: String
)

data class DownloadInfo(
    val appId: Int,
    val appName: String,
    val fileName: String,
    val downloadId: Long,
    val downloadStatus: String = "Pending"
)

data class DownloadHistoryResponse(
    val success: Boolean,
    val downloads: List<DownloadInfo>
)
