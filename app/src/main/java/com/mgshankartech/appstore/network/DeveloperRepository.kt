package com.mgshankartech.appstore.network

import com.mgshankartech.appstore.models.AppUploadRequest
import com.mgshankartech.appstore.models.DeveloperApp
import com.mgshankartech.appstore.models.DeveloperDashboardResponse
import retrofit2.Response

class DeveloperRepository(
    private val apiService: DeveloperApiService
) {

    suspend fun getDashboard():
        Response<DeveloperDashboardResponse> {
        return apiService.getDashboard()
    }

    suspend fun uploadApp(
        request: AppUploadRequest
    ): Response<DeveloperApp> {
        return apiService.uploadApp(request)
    }

    suspend fun getAppDetails(
        appId: Int
    ): Response<DeveloperApp> {
        return apiService.getAppDetails(appId)
    }
}
