import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/chat_screen.dart';
import 'screens/login_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/settings_screen.dart';
import 'services/api_service.dart';
import 'services/auth_provider.dart';

void main() {
  final api = ApiService();
  runApp(MultiProvider(
    providers: [
      Provider<ApiService>.value(value: api),
      ChangeNotifierProvider(create: (_) => AuthProvider(api)),
    ],
    child: const MahinApp(),
  ));
}

class MahinApp extends StatelessWidget {
  const MahinApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mahin AI',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.indigo),
      initialRoute: '/',
      routes: {
        '/': (_) => const LoginScreen(),
        '/chat': (_) => const ChatScreen(),
        '/profile': (_) => const ProfileScreen(),
        '/settings': (_) => const SettingsScreen(),
      },
    );
  }
}
