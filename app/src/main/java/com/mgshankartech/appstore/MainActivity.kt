package com.mgshankartech.appstore

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Apps
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            MaterialTheme {
                MGAppStoreApp()
            }
        }
    }
}

data class StoreApp(
    val name: String,
    val developer: String,
    val category: String,
    val rating: String,
    val description: String,
    val icon: String
)

private val sampleApps = listOf(
    StoreApp(
        "Avani AI",
        "MG Shankar Tech",
        "Artificial Intelligence",
        "4.9",
        "Your intelligent AI assistant.",
        "🤖"
    ),
    StoreApp(
        "Photo Frame",
        "MG Shankar Tech",
        "Photography",
        "4.8",
        "Extract beautiful photos from videos.",
        "📸"
    ),
    StoreApp(
        "Music Studio",
        "MG Shankar Tech",
        "Music",
        "4.7",
        "Create and explore music.",
        "🎵"
    ),
    StoreApp(
        "Smart Calculator",
        "MG Shankar Tech",
        "Tools",
        "4.6",
        "A simple and smart calculator.",
        "🧮"
    ),
    StoreApp(
        "Car Racing",
        "MG Shankar Tech",
        "Games",
        "4.5",
        "Enjoy an exciting racing experience.",
        "🏎️"
    )
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MGAppStoreApp() {

    val context = LocalContext.current

    var searchText by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }
    var selectedTab by remember { mutableIntStateOf(0) }

    val categories = listOf(
        "All",
        "AI",
        "Games",
        "Photography",
        "Music",
        "Tools"
    )

    val filteredApps = sampleApps.filter { app ->

        val matchesSearch =
            app.name.contains(searchText, ignoreCase = true) ||
            app.developer.contains(searchText, ignoreCase = true) ||
            app.category.contains(searchText, ignoreCase = true)

        val matchesCategory =
            selectedCategory == "All" ||
            app.category.contains(selectedCategory, ignoreCase = true)

        matchesSearch && matchesCategory
    }

    Scaffold(
        containerColor = Color(0xFFF5F6FA),

        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "MG AppStore",
                            fontSize = 23.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF172554)
                        )

                        Text(
                            text = "Discover amazing applications",
                            fontSize = 11.sp,
                            color = Color.Gray
                        )
                    }
                },
                actions = {
                    Text(
                        text = "MG",
                        modifier = Modifier
                            .padding(end = 16.dp)
                            .background(
                                Color(0xFF2563EB),
                                CircleShape
                            )
                            .padding(12.dp),
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White
                )
            )
        },

        bottomBar = {
            NavigationBar(
                containerColor = Color.White
            ) {

                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = {
                        Icon(Icons.Default.Home, contentDescription = "Home")
                    },
                    label = { Text("Home") }
                )

                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = {
                        Icon(Icons.Default.Apps, contentDescription = "Apps")
                    },
                    label = { Text("Apps") }
                )

                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = {
                        Toast.makeText(
                            context,
                            "Downloads section coming soon",
                            Toast.LENGTH_SHORT
                        ).show()
                        selectedTab = 2
                    },
                    icon = {
                        Icon(
                            Icons.Default.Download,
                            contentDescription = "Downloads"
                        )
                    },
                    label = { Text("Downloads") }
                )

                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = {
                        Toast.makeText(
                            context,
                            "Login feature coming soon",
                            Toast.LENGTH_SHORT
                        ).show()
                        selectedTab = 3
                    },
                    icon = {
                        Icon(
                            Icons.Default.Person,
                            contentDescription = "Profile"
                        )
                    },
                    label = { Text("Profile") }
                )
            }
        }

    ) { padding ->

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(
                start = 16.dp,
                end = 16.dp,
                top = 16.dp,
                bottom = 24.dp
            ),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {

            item {
                SearchBar(
                    searchText = searchText,
                    onSearchChange = { searchText = it }
                )
            }

            item {
                FeaturedBanner()
            }

            item {
                Text(
                    text = "Explore Categories",
                    fontSize = 19.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF172554)
                )
            }

            item {
                Column(
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    categories.chunked(3).forEach { rowCategories ->

                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            rowCategories.forEach { category ->

                                FilterChip(
                                    selected = selectedCategory == category,
                                    onClick = {
                                        selectedCategory = category
                                    },
                                    label = {
                                        Text(category)
                                    }
                                )
                            }
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Popular Applications",
                        fontSize = 19.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF172554)
                    )

                    Text(
                        text = "${filteredApps.size} Apps",
                        color = Color(0xFF2563EB),
                        fontSize = 13.sp
                    )
                }
            }

            if (filteredApps.isEmpty()) {

                item {
                    Text(
                        text = "No applications found.",
                        modifier = Modifier.padding(20.dp),
                        color = Color.Gray
                    )
                }

            } else {

                items(filteredApps) { app ->

                    AppCard(
                        app = app,
                        onDownload = {
                            Toast.makeText(
                                context,
                                "Download system will be connected to backend.",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    )
                }
            }

            item {
                Text(
                    text = "Powered by MG Shankar Tech",
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 12.dp),
                    color = Color.Gray,
                    fontSize = 12.sp
                )
            }
        }
    }
}

@Composable
fun SearchBar(
    searchText: String,
    onSearchChange: (String) -> Unit
) {

    OutlinedTextField(
        value = searchText,
        onValueChange = onSearchChange,
        modifier = Modifier.fillMaxWidth(),
        placeholder = {
            Text("Search apps and games...")
        },
        leadingIcon = {
            Icon(
                Icons.Default.Search,
                contentDescription = "Search"
            )
        },
        singleLine = true,
        shape = RoundedCornerShape(16.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = Color(0xFF2563EB),
            unfocusedBorderColor = Color.LightGray
        )
    )
}

@Composable
fun FeaturedBanner() {

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                Color(0xFF1D4ED8),
                RoundedCornerShape(22.dp)
            )
            .padding(22.dp)
    ) {

        Text(
            text = "WELCOME TO MG APPSTORE",
            color = Color.White,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = "Discover.\nDownload. Enjoy.",
            color = Color.White,
            fontSize = 27.sp,
            fontWeight = FontWeight.Bold,
            lineHeight = 34.sp
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Your destination for amazing Android apps.",
            color = Color(0xFFDBEAFE),
            fontSize = 13.sp
        )
    }
}

@Composable
fun AppCard(
    app: StoreApp,
    onDownload: () -> Unit
) {

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color.White
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 2.dp
        )
    ) {

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {

            Text(
                text = app.icon,
                fontSize = 35.sp,
                modifier = Modifier
                    .background(
                        Color(0xFFEFF6FF),
                        RoundedCornerShape(14.dp)
                    )
                    .padding(13.dp)
            )

            Spacer(modifier = Modifier.width(12.dp))

            Column(
                modifier = Modifier.weight(1f)
            ) {

                Text(
                    text = app.name,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF172554)
                )

                Text(
                    text = app.developer,
                    fontSize = 11.sp,
                    color = Color.Gray
                )

                Text(
                    text = app.category,
                    fontSize = 11.sp,
                    color = Color(0xFF2563EB)
                )

                Text(
                    text = "★ ${app.rating}",
                    fontSize = 12.sp,
                    color = Color(0xFFCA8A04)
                )

                Text(
                    text = app.description,
                    fontSize = 11.sp,
                    color = Color.DarkGray
                )
            }

            Spacer(modifier = Modifier.width(6.dp))

            Button(
                onClick = onDownload,
                shape = RoundedCornerShape(12.dp),
                contentPadding = PaddingValues(
                    horizontal = 12.dp,
                    vertical = 8.dp
                ),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF2563EB)
                )
            ) {
                Text(
                    text = "Get",
                    fontSize = 12.sp
                )
            }
        }
    }
}
