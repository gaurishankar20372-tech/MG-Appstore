package com.mgshankartech.appstore.navigation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.mgshankartech.appstore.categories.CategoriesScreen
import com.mgshankartech.appstore.developer.AppUploadScreen
import com.mgshankartech.appstore.developer.DeveloperAppDetailsScreen
import com.mgshankartech.appstore.developer.DeveloperDashboardScreen
import com.mgshankartech.appstore.download.DownloadHistoryScreen
import com.mgshankartech.appstore.network.AppDependencies
import com.mgshankartech.appstore.profile.ProfileScreen
import com.mgshankartech.appstore.ui.components.StoreBottomBar

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    Scaffold(
        bottomBar = {
            StoreBottomBar(
                selectedRoute = navController
                    .currentBackStackEntry
                    ?.destination
                    ?.route ?: "home",
                onItemSelected = { route ->
                    navController.navigate(route) {
                        launchSingleTop = true
                        restoreState = true
                        popUpTo("home") {
                            saveState = true
                        }
                    }
                }
            )
        }
    ) { padding ->

        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(padding)
        ) {

            composable("home") {
                HomeScreen(
                    onDeveloperClick = {
                        navController.navigate("developer_dashboard")
                    }
                )
            }

            composable("categories") {
                CategoriesScreen(
                    onCategoryClick = { category ->
                        navController.navigate("home")
                    }
                )
            }

            composable("downloads") {
                DownloadHistoryScreen(
                    repository = AppDependencies.downloadRepository,
                    onBack = {
                        navController.navigate("home")
                    }
                )
            }

            composable("profile") {
                ProfileScreen(
                    userName = "MG AppStore User",
                    email = "user@example.com",
                    onDownloadHistory = {
                        navController.navigate("downloads")
                    },
                    onLogout = {
                        navController.navigate("home")
                    }
                )
            }

            composable("developer_dashboard") {
                DeveloperDashboardScreen(
                    repository = AppDependencies.developerRepository,
                    onUploadApp = {
                        navController.navigate("app_upload")
                    },
                    onAppClick = { appId ->
                        navController.navigate(
                            "app_details/$appId"
                        )
                    }
                )
            }

            composable("app_upload") {
                AppUploadScreen(
                    repository = AppDependencies.developerRepository,
                    onBack = {
                        navController.popBackStack()
                    },
                    onUploadSuccess = {
                        navController.navigate("developer_dashboard") {
                            popUpTo("developer_dashboard") {
                                inclusive = true
                            }
                        }
                    }
                )
            }

            composable(
                route = "app_details/{appId}",
                arguments = listOf(
                    navArgument("appId") {
                        type = NavType.IntType
                    }
                )
            ) { entry ->

                val appId = entry.arguments?.getInt("appId") ?: 0

                DeveloperAppDetailsScreen(
                    appId = appId,
                    repository = AppDependencies.developerRepository,
                    onBack = {
                        navController.popBackStack()
                    }
                )
            }
        }
    }
}

@Composable
private fun HomeScreen(
    onDeveloperClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "MG AppStore",
            style = MaterialTheme.typography.headlineLarge
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text("Welcome to MG Shankar Tech AppStore")

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = onDeveloperClick
        ) {
            Text("Developer Dashboard")
        }
    }
}
