package com.mgshankartech.appstore.network

import com.mgshankartech.appstore.models.DownloadHistoryResponse
import retrofit2.Response
import retrofit2.http.GET

interface DownloadApiService {

    @GET("api/downloads/history")
    suspend fun getDownloadHistory(): Response<DownloadHistoryResponse>
}
