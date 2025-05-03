import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:geolocator/geolocator.dart';

class BloodBankFetchProvider extends ChangeNotifier {
  List<dynamic> bloodBanks = [];
  bool isLoading = true;
  String? selectedBloodGroup;
  String? errorMessage;

  final List<String> bloodGroups = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ];

  BloodBankFetchProvider() {
    _loadLastSearchedBloodGroup();
  }

  void updateBloodGroup(String group){
    selectedBloodGroup=group;
    notifyListeners();
  }

  Future<void> _loadLastSearchedBloodGroup() async {
    final prefs = await SharedPreferences.getInstance();
    final lastSearched = prefs.getString('selectedBloodGroup');
    if (lastSearched != null && bloodGroups.contains(lastSearched)) {
      selectedBloodGroup = lastSearched;
      notifyListeners();
    }
    await fetchNearbyBloodBanks();
  }

  Future<void> onBloodGroupChanged(String? newValue) async {
    final prefs = await SharedPreferences.getInstance();
    selectedBloodGroup = newValue;
    isLoading = true;
    errorMessage = null;
    notifyListeners();

    if (newValue != null) {
      await prefs.setString('selectedBloodGroup', newValue);
    } else {
      await prefs.remove('selectedBloodGroup');
    }
    await fetchNearbyBloodBanks();
  }

  Future<Position> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception(
          'Location permissions are permanently denied, we cannot request permissions.');
    }

    return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);
  }

  Future<void> fetchNearbyBloodBanks() async {
    isLoading = true;
    errorMessage = null;
    notifyListeners();

    try {
      Position position = await _determinePosition();
      double lat = position.latitude;
      double long = position.longitude;

      debugPrint('User location: $lat, $long');

      await fetchBloodBanks(lat, long);
    } catch (e) {
      debugPrint('Error getting location: $e');
      isLoading = false;
      errorMessage = e.toString();
      notifyListeners();
    }
  }

  Future<void> fetchBloodBanks(double latitude, double longitude) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final authToken = prefs.getString('authToken');
      if (authToken == null) {
        throw Exception('User not authenticated');
      }

      final bloodGroup = selectedBloodGroup ?? '';
      final url = Uri.parse(
        'https://bloodlink-flsd.onrender.com/api/patients/search?bloodGroup=${Uri.encodeQueryComponent(bloodGroup)}&latitude=$latitude&longitude=$longitude',
      );

      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = jsonDecode(response.body);
        debugPrint('Blood data: $responseData');
        final List<dynamic> data = responseData['data'] ?? [];
        debugPrint('Fetched banks: $data');
        bloodBanks = data;
        isLoading = false;
        errorMessage = null;
      } else {
        throw Exception('Failed to load blood banks: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error: $e');
      isLoading = false;
      errorMessage = 'No blood banks found. Sorry for the inconvenience.';
    }
    notifyListeners();
  }
}