package com.mgshankartech.appstore.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import android.widget.Toast
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.input.VisualTransformation
import com.mgshankartech.appstore.network.AuthRepository
import com.mgshankartech.appstore.network.ApiResult
import kotlinx.coroutines.launch

@Composable
fun AuthScreen(
    onLoginSuccess: () -> Unit
) {
    val context = LocalContext.current
    val repository = remember { AuthRepository() }
    val sessionManager = remember { SessionManager(context) }
    val scope = rememberCoroutineScope()

    var isLogin by remember { mutableStateOf(true) }
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F6FA))
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {

        Text(
            text = "MG",
            fontSize = 38.sp,
            fontWeight = FontWeight.ExtraBold,
            color = Color.White,
            modifier = Modifier
                .background(
                    Color(0xFF2563EB),
                    RoundedCornerShape(20.dp)
                )
                .padding(horizontal = 25.dp, vertical = 15.dp)
        )

        Spacer(modifier = Modifier.height(18.dp))

        Text(
            text = "MG AppStore",
            fontSize = 27.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF172554)
        )

        Text(
            text = "Your destination for Android apps",
            color = Color.Gray,
            fontSize = 13.sp
        )

        Spacer(modifier = Modifier.height(30.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(22.dp),
            colors = CardDefaults.cardColors(
                containerColor = Color.White
            )
        ) {

            Column(
                modifier = Modifier.padding(22.dp)
            ) {

                Text(
                    text = if (isLogin) "Welcome Back!" else "Create Account",
                    fontSize = 23.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF172554)
                )

                Spacer(modifier = Modifier.height(20.dp))

                if (!isLogin) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Full Name") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(12.dp))
                }

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email Address") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Email
                    )
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    visualTransformation =
                        PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Password
                    )
                )

                Spacer(modifier = Modifier.height(22.dp))

                Button(
                    onClick = {

                        if (email.isBlank() ||
                            password.isBlank() ||
                            (!isLogin && name.isBlank())
                        ) {
                            Toast.makeText(
                                context,
                                "Please fill all required fields",
                                Toast.LENGTH_SHORT
                            ).show()
                            return@Button
                        }

                        if (!android.util.Patterns.EMAIL_ADDRESS
                                .matcher(email.trim()).matches()
                        ) {
                            Toast.makeText(
                                context,
                                "Enter a valid email address",
                                Toast.LENGTH_SHORT
                            ).show()
                            return@Button
                        }

                        if (password.length < 8) {
                            Toast.makeText(
                                context,
                                "Password must be at least 8 characters",
                                Toast.LENGTH_SHORT
                            ).show()
                            return@Button
                        }

                        scope.launch {

                            loading = true

                            val result = if (isLogin) {
                                repository.login(
                                    email.trim(),
                                    password
                                )
                            } else {
                                repository.register(
                                    name.trim(),
                                    email.trim(),
                                    password
                                )
                            }

                            loading = false

                            when (result) {

                                is ApiResult.Success -> {

                                    val data = result.data
                                    val token = data.access_token
                                    val user = data.user

                                    if (!token.isNullOrBlank() &&
                                        user != null
                                    ) {
                                        sessionManager.saveToken(token)

                                        sessionManager.saveUser(
                                            userId = user.id,
                                            name = user.name,
                                            email = user.email,
                                            role = user.role
                                        )

                                        Toast.makeText(
                                            context,
                                            "Welcome ${user.name}!",
                                            Toast.LENGTH_SHORT
                                        ).show()

                                        onLoginSuccess()

                                    } else {
                                        Toast.makeText(
                                            context,
                                            data.message,
                                            Toast.LENGTH_LONG
                                        ).show()
                                    }
                                }

                                is ApiResult.Error -> {
                                    Toast.makeText(
                                        context,
                                        result.message,
                                        Toast.LENGTH_LONG
                                    ).show()
                                }
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    enabled = !loading,
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF2563EB)
                    )
                ) {

                    if (loading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(23.dp),
                            color = Color.White,
                            strokeWidth = 2.dp
                        )
                    } else {
                        Text(
                            text = if (isLogin) "LOGIN" else "CREATE ACCOUNT",
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                TextButton(
                    onClick = {
                        isLogin = !isLogin
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = if (isLogin)
                            "New user? Create an account"
                        else
                            "Already have an account? Login",
                        color = Color(0xFF2563EB),
                        textAlign = TextAlign.Center
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(25.dp))

        Text(
            text = "Developed by MG Shankar Tech",
            color = Color.Gray,
            fontSize = 12.sp
        )
    }
}
