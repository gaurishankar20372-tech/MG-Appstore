package com.mgshankartech.appstore.network

import com.mgshankartech.appstore.models.DownloadHistoryResponse
import retrofit2.Response

class DownloadRepository(
    private val apiService: DownloadApiService
) {

    suspend fun getDownloadHistory():
        Response<DownloadHistoryResponse> {
        return apiService.getDownloadHistory()
    }
}
