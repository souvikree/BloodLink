import 'package:blood_link_flutter/main_screen.dart';
import 'package:blood_link_flutter/provider/appointment_screen_provider.dart';
import 'package:blood_link_flutter/provider/blood_bank_fetch_provider.dart';
import 'package:blood_link_flutter/provider/profile_provider.dart';
import 'package:blood_link_flutter/splash_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'login_screen.dart';
void main() {
  // WidgetsFlutterBinding.ensureInitialized();
  // await initLocalNotifications();
  runApp(const MyApp());
}



// final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
// FlutterLocalNotificationsPlugin();
//
// Future<void> initLocalNotifications() async {
//   const AndroidInitializationSettings initializationSettingsAndroid =
//   AndroidInitializationSettings('@mipmap/ic_launcher');
//
//   const InitializationSettings initializationSettings = InitializationSettings(
//     android: initializationSettingsAndroid,
//     // iOS setup can be added too if needed
//   );
//
//   await flutterLocalNotificationsPlugin.initialize(initializationSettings);
// }


class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => BloodBankFetchProvider()),
        ChangeNotifierProvider(create: (_) => AppointmentProvider()),
        ChangeNotifierProvider(create: (_) => ProfileProvider()),
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