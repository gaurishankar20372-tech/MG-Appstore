package com.mgshankartech.appstore.network

import com.mgshankartech.appstore.models.AuthResponse
import com.mgshankartech.appstore.models.LoginRequest
import com.mgshankartech.appstore.models.MessageResponse
import com.mgshankartech.appstore.models.RegisterRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {

    // User Registration
    @POST("api/auth/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): Response<AuthResponse>

    // User Login
    @POST("api/auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): Response<AuthResponse>

    // Logout
    @POST("api/auth/logout")
    suspend fun logout(): Response<MessageResponse>
}
