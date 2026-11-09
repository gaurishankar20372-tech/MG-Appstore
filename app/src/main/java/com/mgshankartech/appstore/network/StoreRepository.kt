package com.mgshankartech.appstore.network

sealed class ApiResult<out T> {
    data class Success<T>(val data: T) : ApiResult<T>()
    data class Error(val message: String) : ApiResult<Nothing>()
}

class StoreRepository {

    private val apiService: ApiService =
        ApiConfig.retrofit.create(ApiService::class.java)

    // Get applications
    suspend fun getApps(
        search: String? = null,
        category: String? = null,
        page: Int = 1
    ): ApiResult<AppsResponse> {

        return try {
            val response = apiService.getApps(
                search = search,
                category = category,
                page = page
            )

            if (response.isSuccessful) {
                val body = response.body()

                if (body != null) {
                    ApiResult.Success(body)
                } else {
                    ApiResult.Error("Empty server response")
                }
            } else {
                ApiResult.Error(
                    "Server error: ${response.code()}"
                )
            }

        } catch (e: Exception) {
            ApiResult.Error(
                e.message ?: "Unable to connect to server"
            )
        }
    }

    // Get application details
    suspend fun getAppDetails(
        appId: Int
    ): ApiResult<AppDetailsResponse> {

        return try {
            val response = apiService.getAppDetails(appId)

            if (response.isSuccessful) {
                val body = response.body()

                if (body != null) {
                    ApiResult.Success(body)
                } else {
                    ApiResult.Error("Application details not found")
                }
            } else {
                ApiResult.Error(
                    "Server error: ${response.code()}"
                )
            }

        } catch (e: Exception) {
            ApiResult.Error(
                e.message ?: "Unable to connect to server"
            )
        }
    }

    // Get categories
    suspend fun getCategories(): ApiResult<CategoriesResponse> {

        return try {
            val response = apiService.getCategories()

            if (response.isSuccessful) {
                val body = response.body()

                if (body != null) {
                    ApiResult.Success(body)
                } else {
                    ApiResult.Error("Categories not found")
                }
            } else {
                ApiResult.Error(
                    "Server error: ${response.code()}"
                )
            }

        } catch (e: Exception) {
            ApiResult.Error(
                e.message ?: "Unable to connect to server"
            )
        }
    }
}
