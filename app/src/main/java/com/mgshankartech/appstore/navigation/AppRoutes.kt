package com.mgshankartech.appstore.navigation

sealed class AppRoutes(val route: String) {

    data object Home : AppRoutes("home")

    data object Categories : AppRoutes("categories")

    data object Downloads : AppRoutes("downloads")

    data object Profile : AppRoutes("profile")

    data object Login : AppRoutes("login")

    data object Register : AppRoutes("register")

    data object DeveloperDashboard :
        AppRoutes("developer_dashboard")

    data object AppUpload :
        AppRoutes("app_upload")

    data object AppDetails :
        AppRoutes("app_details/{appId}") {

        fun createRoute(appId: Int): String {
            return "app_details/$appId"
        }
    }
}
