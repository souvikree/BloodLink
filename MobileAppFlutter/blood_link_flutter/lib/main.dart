import 'package:blood_link_flutter/main_screen.dart';
import 'package:blood_link_flutter/provider/blood_bank_fetch_provider.dart';
import 'package:blood_link_flutter/splash_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'home_screen.dart';
import 'login_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => BloodBankFetchProvider()),
        // Add more providers here as needed, e.g.:
        // ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp(
        title: 'Qnity',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(primarySwatch: Colors.red),
        initialRoute: '/',
        routes: {
          '/': (_) => const SplashScreenPage(),
          '/login': (_) => const AuthScreen(),
          '/home': (_) => const MainScreen(),
        },
      ),
    );
  }
}