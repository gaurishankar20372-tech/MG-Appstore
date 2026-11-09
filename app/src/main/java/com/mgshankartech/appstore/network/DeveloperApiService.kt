package com.mgshankartech.appstore.network

import com.mgshankartech.appstore.models.AppUploadRequest
import com.mgshankartech.appstore.models.DeveloperDashboardResponse
import com.mgshankartech.appstore.models.DeveloperApp
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface DeveloperApiService {

    @GET("api/developer/dashboard")
    suspend fun getDashboard(): Response<DeveloperDashboardResponse>

    @POST("api/developer/apps")
    suspend fun uploadApp(
        @Body request: AppUploadRequest
    ): Response<DeveloperApp>

    @GET("api/developer/apps/{appId}")
    suspend fun getAppDetails(
        @Path("appId") appId: Int
    ): Response<DeveloperApp>
}
