import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class OtpVerificationScreen extends StatefulWidget {
  final String phone;
  final String name;
  final bool isRegister;

  const OtpVerificationScreen({
    super.key,
    required this.phone,
    required this.name,
    required this.isRegister,
  });

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final TextEditingController otpController = TextEditingController();
  bool isVerifying = false;
  bool canResend = false;
  int countdown = 60;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    startResendCountdown();
  }

  @override
  void dispose() {
    _timer?.cancel();
    otpController.dispose();
    super.dispose();
  }

  void startResendCountdown() {
    setState(() {
      canResend = false;
      countdown = 60;
    });

    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (countdown == 0) {
        timer.cancel();
        setState(() => canResend = true);
      } else {
        setState(() => countdown--);
      }
    });
  }

  Future<void> verifyOtp() async {
    setState(() => isVerifying = true);
    final response = await http.post(
      Uri.parse('https://bloodlink-flsd.onrender.com/api/patients/verify-registration'),
      body: jsonEncode({
        "mobile": widget.phone,
        "otp": otpController.text,
      }),
      headers: {'Content-Type': 'application/json'},
    );

    final data = jsonDecode(response.body);
    setState(() => isVerifying = false);

    if (response.statusCode == 200 && data["token"] != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('authToken', data["token"]);
      await prefs.setBool('authDone', true);
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(data['message'] ?? 'Verification failed')),
      );
    }
  }

  Future<void> verifyOtpLogin() async {
    setState(() => isVerifying = true);
    final response = await http.post(
      Uri.parse('https://bloodlink-flsd.onrender.com/api/patients/login/verify-otp'),
      body: jsonEncode({
        "mobile": widget.phone,
        "otp": otpController.text,
      }),
      headers: {'Content-Type': 'application/json'},
    );

    final data = jsonDecode(response.body);
    setState(() => isVerifying = false);

    if (response.statusCode == 200 && data["token"] != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('authToken', data["token"]);
      await prefs.setBool('authDone', true);
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(data['message'] ?? 'Verification failed')),
      );
    }
  }

  Future<void> resendOtp() async {
    setState(() => canResend = false);
    startResendCountdown();

    final response = await http.post(
      Uri.parse('https://bloodlink-flsd.onrender.com/api/patients/signup'),
      body: jsonEncode({
        "name": widget.name,
        "mobile": widget.phone,
      }),
      headers: {'Content-Type': 'application/json'},
    );

    final data = jsonDecode(response.body);
    if (response.statusCode != 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(data['message'] ?? 'Failed to resend OTP')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final textColor = theme.colorScheme.onBackground;
    final primaryColor = theme.colorScheme.primary;
    final surfaceColor = theme.colorScheme.surface;

    return Scaffold(
      backgroundColor: theme.colorScheme.background,
      appBar: AppBar(
        title: const Text("OTP Verification"),
        centerTitle: true,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 36),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Icon(Icons.lock_outline, size: 72, color: primaryColor),
              const SizedBox(height: 20),
              Text(
                "Enter the 6-digit OTP sent to",
                style: theme.textTheme.titleMedium?.copyWith(color: textColor),
              ),
              const SizedBox(height: 4),
              Text(
                widget.phone,
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: primaryColor,
                ),
              ),
              const SizedBox(height: 32),
              TextField(
                controller: otpController,
                keyboardType: TextInputType.number,
                maxLength: 6,
                textAlign: TextAlign.center,
                style: const TextStyle(letterSpacing: 4, fontSize: 24),
                decoration: InputDecoration(
                  hintText: "------",
                  filled: true,
                  fillColor: surfaceColor.withOpacity(isDark ? 0.1 : 0.05),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: primaryColor),
                  ),
                  counterText: '',
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  icon: isVerifying
                      ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                      : const Icon(Icons.check_circle_outline),
                  label: const Text("Verify OTP"),
                  onPressed: isVerifying
                      ? null
                      : (widget.isRegister ? verifyOtp : verifyOtpLogin),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 30),
              if (widget.isRegister)
                Column(
                  children: [
                    AnimatedOpacity(
                      duration: const Duration(milliseconds: 300),
                      opacity: canResend ? 1 : 0.6,
                      child: Text(
                        canResend
                            ? "Didn't receive the code?"
                            : "Resend available in $countdown seconds",
                        style: theme.textTheme.bodyMedium?.copyWith(color: textColor),
                      ),
                    ),
                    const SizedBox(height: 4),
                    TextButton(
                      onPressed: canResend ? resendOtp : null,
                      child: const Text(
                        "Resend OTP",
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}
