import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ProfileProvider with ChangeNotifier {
  Map<String, dynamic>? _profileData;
  bool _isLoading = true;
  String? _errorMessage;
  final TextEditingController _addressController=TextEditingController();
  TextEditingController get addressController => _addressController;
  Map<String, dynamic>? get profileData => _profileData;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  bool _isCurrentLocationLoading = false;


  bool get isCurrentLocationLoading => _isCurrentLocationLoading;




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
  Future<void> fetchCurrentAddress(BuildContext context) async {
    _isCurrentLocationLoading=true;
    notifyListeners();

    try {
      // Step 1: Check if Location Service is enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Location services are disabled.')),
        );
        return;
      }

      // Step 2: Check permission
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        permission = await Geolocator.requestPermission();
        if (permission != LocationPermission.always &&
            permission != LocationPermission.whileInUse) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Location permissions are denied.')),
          );
          return;
        }
      }

      // Step 3: Get current position
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      // Step 4: Reverse geocoding
      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );

      if (placemarks.isNotEmpty) {
        final placemark = placemarks.first;

        final address = [
          placemark.street,
          placemark.locality,
          placemark.administrativeArea,
          placemark.country
        ].where((element) => element != null && element.isNotEmpty).join(', ');

        // Set address in provider
        _addressController.text = address;
        _isCurrentLocationLoading=false;

        // Optional: Save lat/lng if needed
        // provider.latitude = position.latitude;
        // provider.longitude = position.longitude;
      } else {
        _isCurrentLocationLoading=false;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Unable to fetch address.')),
        );
      }
    } catch (e) {
      _isCurrentLocationLoading=false;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error fetching address: $e')),
      );
    }
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
