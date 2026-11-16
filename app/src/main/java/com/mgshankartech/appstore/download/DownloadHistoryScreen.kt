package com.mgshankartech.appstore.download

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.mgshankartech.appstore.network.DownloadRepository
import kotlinx.coroutines.launch

@Composable
fun DownloadHistoryScreen(
    repository: DownloadRepository,
    onBack: () -> Unit
) {
    var loading by remember { mutableStateOf(true) }
    var message by remember { mutableStateOf("लोड हो रहा है...") }
    var isError by remember { mutableStateOf(false) }

    val scope = rememberCoroutineScope()

    fun loadHistory() {
        scope.launch {
            loading = true
            isError = false
            message = "डाउनलोड हिस्ट्री लोड हो रही है..."

            try {
                val response = repository.getDownloadHistory()

                if (response.isSuccessful && response.body() != null) {
                    message = "डाउनलोड हिस्ट्री का डेटा सर्वर से प्राप्त हुआ।"
                } else {
                    message = "हिस्ट्री लोड नहीं हुई। Error: ${response.code()}"
                    isError = true
                }
            } catch (e: Exception) {
                message = "नेटवर्क त्रुटि: ${
                    e.localizedMessage ?: "कनेक्शन जाँचें"
                }"
                isError = true
            }

            loading = false
        }
    }

    LaunchedEffect(Unit) {
        loadHistory()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Download History",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(24.dp))

        if (loading) {
            CircularProgressIndicator()
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = message,
            style = MaterialTheme.typography.bodyLarge,
            color = if (isError) {
                MaterialTheme.colorScheme.error
            } else {
                MaterialTheme.colorScheme.onSurface
            }
        )

        Spacer(modifier = Modifier.height(24.dp))

        if (isError) {
            Button(onClick = { loadHistory() }) {
                Text("Retry")
            }
        }

        Button(onClick = onBack) {
            Text("Back")
        }
    }
}
