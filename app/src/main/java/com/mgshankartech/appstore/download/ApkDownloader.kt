package com.mgshankartech.appstore.download

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Environment

object ApkDownloader {

    fun downloadApk(
        context: Context,
        apkUrl: String,
        appName: String
    ): Long? {

        return try {

            val uri = Uri.parse(apkUrl)

            // Only secure HTTPS downloads are allowed
            if (uri.scheme != "https" || uri.host.isNullOrBlank()) {
                return null
            }

            val request = DownloadManager.Request(uri)

            request.setTitle("$appName APK")
            request.setDescription(
                "Downloading from MG AppStore"
            )

            request.setMimeType(
                "application/vnd.android.package-archive"
            )

            request.setNotificationVisibility(
                DownloadManager.Request
                    .VISIBILITY_VISIBLE_NOTIFY_COMPLETED
            )

            request.setDestinationInExternalPublicDir(
                Environment.DIRECTORY_DOWNLOADS,
                "${appName.replace(Regex("[^A-Za-z0-9._-]"), "_")}.apk"
            )

            request.setAllowedOverMetered(true)
            request.setAllowedOverRoaming(false)

            val manager = context.getSystemService(
                Context.DOWNLOAD_SERVICE
            ) as DownloadManager

            manager.enqueue(request)

        } catch (e: Exception) {
            null
        }
    }
}
