package com.mgshankartech.appstore.models

import com.google.gson.annotations.SerializedName

// User Registration
data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val role: String = "user"
)

// User Login
data class LoginRequest(
    val email: String,
    val password: String
)

// User Information
data class UserDto(
    val id: Int,
    val name: String,
    val email: String,
    val role: String
)

// Authentication Response
data class AuthResponse(
    val success: Boolean,
    val message: String,

    @SerializedName("token")
    val accessToken: String?,

    val user: UserDto?
)

// Generic API Message
data class MessageResponse(
    val success: Boolean,
    val message: String
)
