package com.mgshankartech.appstore

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.mgshankartech.appstore.navigation.AppNavigation
import com.mgshankartech.appstore.ui.theme.MGAppStoreTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()

        setContent {
            MGAppStoreTheme(
                darkTheme = false
            ) {
                AppNavigation()
            }
        }
    }
}
