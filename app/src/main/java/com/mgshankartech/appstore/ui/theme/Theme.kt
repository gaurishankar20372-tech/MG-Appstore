package com.mgshankartech.appstore.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = AppPrimary,
    onPrimary = AppOnPrimary,
    secondary = AppSecondary,
    onSecondary = AppOnSecondary,
    background = AppBackground,
    onBackground = Color(0xFF1C1B1F),
    surface = AppSurface,
    onSurface = Color(0xFF1C1B1F),
    error = AppError
)

private val DarkColors = darkColorScheme(
    primary = AppPrimary,
    onPrimary = AppOnPrimary,
    secondary = AppSecondary,
    onSecondary = AppOnSecondary,
    background = AppDarkBackground,
    onBackground = Color(0xFFE6E1E9),
    surface = AppDarkSurface,
    onSurface = Color(0xFFE6E1E9),
    error = AppError
)

@Composable
fun MGAppStoreTheme(
    darkTheme: Boolean = false,
    content: @Composable () -> Unit
) {
    val colors = if (darkTheme) {
        DarkColors
    } else {
        LightColors
    }

    MaterialTheme(
        colorScheme = colors,
        typography = Typography,
        content = content
    )
}
