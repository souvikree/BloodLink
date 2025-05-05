import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/cupertino.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfileProvider with ChangeNotifier {
  Map<String, dynamic>? _profileData;
  bool _isLoading = true;
  String? _errorMessage;

  Map<String, dynamic>? get profileData => _profileData;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;


  ProfileProvider() {
    fetchProfile();
  }

  Future<void> fetchProfile() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final authToken = prefs.getString('authToken');

      if (authToken == null) {
        _errorMessage = 'No authentication token found. Please log in.';
        _isLoading = false;
        notifyListeners();
        return;
      }

      final response = await http.get(
        Uri.parse('https://bloodlink-flsd.onrender.com/api/patients/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      if (response.statusCode == 200) {
        _profileData = json.decode(response.body);
        _isLoading = false;
      } else {
        _errorMessage = 'Failed to load profile: ${response.statusCode}';
        _isLoading = false;
      }
    } catch (e) {
      _errorMessage = 'Error: ${e.toString()}';
      _isLoading = false;
    }
    notifyListeners();
  }

  Future<void> logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('authToken');
    await prefs.remove('authDone');
    if (context.mounted) {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
