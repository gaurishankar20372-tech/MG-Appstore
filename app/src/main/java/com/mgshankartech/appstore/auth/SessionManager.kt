package com.mgshankartech.appstore.auth

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

class SessionManager(context: Context) {

    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val preferences =
        EncryptedSharedPreferences.create(
            context,
            "mg_appstore_secure_session",
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )

    fun saveToken(token: String) {
        preferences.edit()
            .putString("access_token", token)
            .apply()
    }

    fun getToken(): String? {
        return preferences.getString("access_token", null)
    }

    fun saveUser(
        userId: Int,
        name: String,
        email: String,
        role: String
    ) {
        preferences.edit()
            .putInt("user_id", userId)
            .putString("user_name", name)
            .putString("user_email", email)
            .putString("user_role", role)
            .apply()
    }

    fun getUserName(): String? =
        preferences.getString("user_name", null)

    fun getUserEmail(): String? =
        preferences.getString("user_email", null)

    fun getUserRole(): String? =
        preferences.getString("user_role", null)

    fun isLoggedIn(): Boolean =
        !getToken().isNullOrBlank()

    fun clearSession() {
        preferences.edit()
            .clear()
            .apply()
    }
}
