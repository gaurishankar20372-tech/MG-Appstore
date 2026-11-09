package com.mgshankartech.appstore.network

import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    // Get all approved applications
    @GET("api/apps")
    suspend fun getApps(
        @Query("search") search: String? = null,
        @Query("category") category: String? = null,
        @Query("page") page: Int = 1
    ): Response<AppsResponse>

    // Get application details
    @GET("api/apps/{appId}")
    suspend fun getAppDetails(
        @Path("appId") appId: Int
    ): Response<AppDetailsResponse>

    // Get available categories
    @GET("api/categories")
    suspend fun getCategories(): Response<CategoriesResponse>
}

// Application list response
data class AppsResponse(
    val success: Boolean,
    val apps: List<StoreAppDto>,
    val page: Int,
    val total: Int
)

// Individual application data
data class StoreAppDto(
    val id: Int,
    val name: String,
    val developer: String,
    val category: String,
    val description: String,
    val icon_url: String?,
    val rating: Double,
    val version: String,
    val downloads: Int
)

// Application details response
data class AppDetailsResponse(
    val success: Boolean,
    val app: StoreAppDto
)

// Categories response
data class CategoriesResponse(
    val success: Boolean,
    val categories: List<String>
)
