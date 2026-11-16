package com.mgshankartech.appstore.developer

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.mgshankartech.appstore.models.AppUploadRequest
import com.mgshankartech.appstore.network.DeveloperRepository
import kotlinx.coroutines.launch

@Composable
fun AppUploadScreen(
    repository: DeveloperRepository,
    onBack: () -> Unit,
    onUploadSuccess: () -> Unit
) {
    var appName by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("") }
    var version by remember { mutableStateOf("1.0.0") }
    var packageName by remember { mutableStateOf("") }

    var loading by remember { mutableStateOf(false) }
    var message by remember { mutableStateOf<String?>(null) }

    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.Top
    ) {
        Text(
            text = "Upload New App",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(20.dp))

        OutlinedTextField(
            value = appName,
            onValueChange = { appName = it },
            label = { Text("App Name") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = description,
            onValueChange = { description = it },
            label = { Text("App Description") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 3
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = category,
            onValueChange = { category = it },
            label = { Text("Category") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = version,
            onValueChange = { version = it },
            label = { Text("App Version") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = packageName,
            onValueChange = { packageName = it },
            label = { Text("Package Name") },
            placeholder = { Text("com.example.myapp") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(20.dp))

        message?.let {
            Text(
                text = it,
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(12.dp))
        }

        Button(
            onClick = {
                if (
                    appName.isBlank() ||
                    description.isBlank() ||
                    category.isBlank() ||
                    version.isBlank() ||
                    packageName.isBlank()
                ) {
                    message = "कृपया सभी जानकारी भरें।"
                    return@Button
                }

                scope.launch {
                    loading = true
                    message = null

                    try {
                        val request = AppUploadRequest(
                            name = appName.trim(),
                            description = description.trim(),
                            category = category.trim(),
                            version = version.trim(),
                            packageName = packageName.trim()
                        )

                        val response = repository.uploadApp(request)

                        if (response.isSuccessful) {
                            message = "ऐप की जानकारी सफलतापूर्वक भेज दी गई।"
                            onUploadSuccess()
                        } else {
                            message = "Upload असफल। Error: ${response.code()}"
                        }
                    } catch (e: Exception) {
                        message = "नेटवर्क त्रुटि: ${
                            e.localizedMessage ?: "कनेक्शन जाँचें"
                        }"
                    }

                    loading = false
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = !loading
        ) {
            if (loading) {
                CircularProgressIndicator()
            } else {
                Text("Submit App")
            }
        }

        TextButton(
            onClick = onBack,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Back")
        }
    }
}
