package com.mgshankartech.appstore.network

import com.mgshankartech.appstore.BuildConfig
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object AppDependencies {

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .addConverterFactory(
                GsonConverterFactory.create()
            )
            .build()
    }

    val apiService: ApiService by lazy {
        retrofit.create(ApiService::class.java)
    }

    val authApiService: AuthApiService by lazy {
        retrofit.create(AuthApiService::class.java)
    }

    val developerApiService: DeveloperApiService by lazy {
        retrofit.create(DeveloperApiService::class.java)
    }

    val downloadApiService: DownloadApiService by lazy {
        retrofit.create(DownloadApiService::class.java)
    }

    val storeRepository: StoreRepository by lazy {
        StoreRepository(apiService)
    }

    val authRepository: AuthRepository by lazy {
        AuthRepository(authApiService)
    }

    val developerRepository: DeveloperRepository by lazy {
        DeveloperRepository(developerApiService)
    }

    val downloadRepository: DownloadRepository by lazy {
        DownloadRepository(downloadApiService)
    }
}
