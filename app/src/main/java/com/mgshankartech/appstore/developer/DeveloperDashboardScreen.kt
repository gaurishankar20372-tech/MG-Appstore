package com.mgshankartech.appstore.developer

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.mgshankartech.appstore.models.DeveloperApp
import com.mgshankartech.appstore.network.DeveloperRepository
import kotlinx.coroutines.launch

@Composable
fun DeveloperDashboardScreen(
    repository: DeveloperRepository,
    onUploadApp: () -> Unit,
    onAppClick: (Int) -> Unit
) {
    var apps by remember {
        mutableStateOf<List<DeveloperApp>>(emptyList())
    }

    var developerName by remember {
        mutableStateOf("Developer")
    }

    var totalApps by remember {
        mutableStateOf(0)
    }

    var approvedApps by remember {
        mutableStateOf(0)
    }

    var pendingApps by remember {
        mutableStateOf(0)
    }

    var loading by remember {
        mutableStateOf(true)
    }

    var errorMessage by remember {
        mutableStateOf<String?>(null)
    }

    val scope = rememberCoroutineScope()

    fun loadDashboard() {
        scope.launch {
            loading = true
            errorMessage = null

            try {
                val response = repository.getDashboard()

                if (response.isSuccessful) {
                    val data = response.body()

                    if (data != null) {
                        developerName = data.developer_name
                        totalApps = data.total_apps
                        approvedApps = data.approved_apps
                        pendingApps = data.pending_apps
                        apps = data.apps
                    } else {
                        errorMessage = "सर्वर से खाली डेटा मिला।"
                    }
                } else {
                    errorMessage = "Dashboard लोड नहीं हुआ। Error: ${response.code()}"
                }
            } catch (e: Exception) {
                errorMessage = "नेटवर्क त्रुटि: ${e.localizedMessage ?: "कनेक्शन जाँचें"}"
            }

            loading = false
        }
    }

    LaunchedEffect(Unit) {
        loadDashboard()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Developer Dashboard",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = "Welcome, $developerName",
            style = MaterialTheme.typography.titleMedium
        )

        Spacer(modifier = Modifier.height(18.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            DashboardStatCard(
                title = "Total Apps",
                value = totalApps.toString(),
                modifier = Modifier.weight(1f)
            )

            DashboardStatCard(
                title = "Approved",
                value = approvedApps.toString(),
                modifier = Modifier.weight(1f)
            )

            DashboardStatCard(
                title = "Pending",
                value = pendingApps.toString(),
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(18.dp))

        Button(
            onClick = onUploadApp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("＋ Upload New App")
        }

        Spacer(modifier = Modifier.height(18.dp))

        Text(
            text = "Your Applications",
            style = MaterialTheme.typography.titleLarge
        )

        Spacer(modifier = Modifier.height(10.dp))

        when {
            loading -> {
                CircularProgressIndicator()
            }

            errorMessage != null -> {
                Text(
                    text = errorMessage ?: "",
                    color = MaterialTheme.colorScheme.error
                )

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedButton(onClick = { loadDashboard() }) {
                    Text("Retry")
                }
            }

            apps.isEmpty() -> {
                Text("अभी कोई ऐप अपलोड नहीं किया गया है।")
            }

            else -> {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(apps) { app ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            onClick = { onAppClick(app.id) }
                        ) {
                            Column(
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Text(
                                    text = app.name,
                                    style = MaterialTheme.typography.titleMedium
                                )

                                Text("Category: ${app.category}")
                                Text("Version: ${app.version}")
                                Text("Status: ${app.status}")
                                Text("Downloads: ${app.downloads}")
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DashboardStatCard(
    title: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(12.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.labelMedium
            )

            Text(
                text = value,
                style = MaterialTheme.typography.headlineSmall
            )
        }
    }
}
