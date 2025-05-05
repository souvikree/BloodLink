import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AppointmentProvider extends ChangeNotifier {
  List<Map<String, dynamic>> _orders = [];
  bool _isLoading = false;

  List<Map<String, dynamic>> get orders => _orders;
  bool get isLoading => _isLoading;

  AppointmentProvider() {
    fetchOrders();
  }

  Future<void> fetchOrders() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('authToken');

      if (token == null) {
        _isLoading = false;
        notifyListeners();
        return;
      }

      final response = await http.get(
        Uri.parse('https://bloodlink-flsd.onrender.com/api/patients/orders/history'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        debugPrint('Fetched orders: $data');
        _orders = data.map((e) => e as Map<String, dynamic>).toList();
      } else {
        debugPrint('Error: No blood banks found.');
      }
    } catch (e) {
      debugPrint('Exception during fetch: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  void refreshOrders() {
    fetchOrders();
  }
}
