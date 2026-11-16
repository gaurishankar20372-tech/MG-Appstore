package com.mgshankartech.appstore.developer

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.mgshankartech.appstore.models.DeveloperApp
import com.mgshankartech.appstore.network.DeveloperRepository
import kotlinx.coroutines.launch

@Composable
fun DeveloperAppDetailsScreen(
    appId: Int,
    repository: DeveloperRepository,
    onBack: () -> Unit
) {
    var app by remember {
        mutableStateOf<DeveloperApp?>(null)
    }

    var loading by remember {
        mutableStateOf(true)
    }

    var errorMessage by remember {
        mutableStateOf<String?>(null)
    }

    val scope = rememberCoroutineScope()

    fun loadDetails() {
        scope.launch {
            loading = true
            errorMessage = null

            try {
                val response = repository.getAppDetails(appId)

                if (response.isSuccessful) {
                    app = response.body()

                    if (app == null) {
                        errorMessage = "ऐप की जानकारी उपलब्ध नहीं है।"
                    }
                } else {
                    errorMessage =
                        "जानकारी लोड नहीं हुई। Error: ${response.code()}"
                }
            } catch (e: Exception) {
                errorMessage =
                    "नेटवर्क त्रुटि: ${e.localizedMessage ?: "कनेक्शन जाँचें"}"
            }

            loading = false
        }
    }

    LaunchedEffect(appId) {
        loadDetails()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp)
    ) {
        Text(
            text = "App Details",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(20.dp))

        when {
            loading -> {
                CircularProgressIndicator()
            }

            errorMessage != null -> {
                Text(
                    text = errorMessage ?: "",
                    color = MaterialTheme.colorScheme.error
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedButton(onClick = { loadDetails() }) {
                    Text("Retry")
                }
            }

            app != null -> {
                val currentApp = app!!

                Card(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(18.dp)
                    ) {
                        Text(
                            text = currentApp.name,
                            style = MaterialTheme.typography.headlineSmall
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        DetailRow("Description", currentApp.description)
                        DetailRow("Category", currentApp.category)
                        DetailRow("Version", currentApp.version)
                        DetailRow("Package Name", currentApp.packageName)
                        DetailRow("Approval Status", currentApp.status)
                        DetailRow(
                            "Total Downloads",
                            currentApp.downloads.toString()
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = onBack,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Back to Dashboard")
        }
    }
}

@Composable
private fun DetailRow(
    label: String,
    value: String
) {
    Column(
        modifier = Modifier.padding(vertical = 7.dp)
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.primary
        )

        Text(
            text = value,
            style = MaterialTheme.typography.bodyLarge
        )
    }
}
