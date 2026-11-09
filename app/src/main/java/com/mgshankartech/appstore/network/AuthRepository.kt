package com.mgshankartech.appstore.network

import com.mgshankartech.appstore.models.AuthResponse
import com.mgshankartech.appstore.models.LoginRequest
import com.mgshankartech.appstore.models.RegisterRequest

class AuthRepository {

    private val apiService: AuthApiService =
        ApiConfig.retrofit.create(AuthApiService::class.java)

    // Register new user
    suspend fun register(
        name: String,
        email: String,
        password: String
    ): ApiResult<AuthResponse> {

        return try {
            val response = apiService.register(
                RegisterRequest(
                    name = name,
                    email = email,
                    password = password
                )
            )

            if (response.isSuccessful) {
                val body = response.body()

                if (body != null && body.success) {
                    ApiResult.Success(body)
                } else {
                    ApiResult.Error(
                        body?.message ?: "Registration failed"
                    )
                }
            } else {
                ApiResult.Error(
                    "Registration error: ${response.code()}"
                )
            }

        } catch (e: Exception) {
            ApiResult.Error(
                e.message ?: "Unable to connect to server"
            )
        }
    }

    // Login existing user
    suspend fun login(
        email: String,
        password: String
    ): ApiResult<AuthResponse> {

        return try {
            val response = apiService.login(
                LoginRequest(
                    email = email,
                    password = password
                )
            )

            if (response.isSuccessful) {
                val body = response.body()

                if (body != null && body.success) {
                    ApiResult.Success(body)
                } else {
                    ApiResult.Error(
                        body?.message ?: "Login failed"
                    )
                }
            } else {
                ApiResult.Error(
                    "Login error: ${response.code()}"
                )
            }

        } catch (e: Exception) {
            ApiResult.Error(
                e.message ?: "Unable to connect to server"
            )
        }
    }
