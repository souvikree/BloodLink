import 'dart:io';
import 'dart:convert';

import 'package:blood_link_flutter/provider/blood_bank_fetch_provider.dart';
import 'package:blood_link_flutter/search_blood_bank.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../order_confirmation_page.dart';

class BloodOrderProvider with ChangeNotifier {
  Map<String, dynamic>? _selectedBloodBank;
  String? _selectedBloodGroup;
  final TextEditingController _quantityController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  File? _prescriptionImage;
  bool _isLoading = false;
  String? _errorMessage;
  final ImagePicker _picker = ImagePicker();
  final List<String> _bloodGroups = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-'
  ];

  BloodOrderProvider(Map<String, dynamic>? initialBloodBank) {
    if (initialBloodBank != null &&
        initialBloodBank['availableUnits'] != null &&
        initialBloodBank['availableUnits']['searched'] != null) {
      _selectedBloodBank = initialBloodBank;
      _selectedBloodGroup = initialBloodBank['availableUnits']['searched']['bloodGroup'] as String?;
    }
  }

  // Getters
  Map<String, dynamic>? get selectedBloodBank => _selectedBloodBank;
  String? get selectedBloodGroup => _selectedBloodGroup;
  TextEditingController get quantityController => _quantityController;
  TextEditingController get addressController => _addressController;
  File? get prescriptionImage => _prescriptionImage;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  List<String> get bloodGroups => _bloodGroups;

  // Setters and actions
  Future<void> pickImage() async {
    final picked = await _picker.pickImage(source: ImageSource.gallery);
    if (picked != null) {
      _prescriptionImage = File(picked.path);
      notifyListeners();
    }
  }

  Future<void> submitOrder(BuildContext context, GlobalKey<FormState> formKey) async {
    if (!formKey.currentState!.validate()) return;

    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('authToken');

      final uri = Uri.parse('https://bloodlink-flsd.onrender.com/api/patients/place-order');

      final request = http.MultipartRequest('POST', uri)
        ..headers['Authorization'] = 'Bearer $token'
        ..fields['bloodBank'] = _selectedBloodBank?['_id'] ?? ''
        ..fields['bloodType'] = _selectedBloodGroup ?? ''
        ..fields['quantity'] = _quantityController.text.trim()
        ..fields['deliveryAddress'] = _addressController.text.trim();

      if (_prescriptionImage != null) {
        request.files.add(
          await http.MultipartFile.fromPath(
            'prescription',
            _prescriptionImage!.path,
          ),
        );
      }

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      print('Response code: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = jsonDecode(response.body);
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => OrderConfirmationScreen(
              orderData: responseData['order'],
            ),
          ),
        );
      } else {
        _errorMessage = 'Failed to place order';
      }
    } catch (e) {
      _errorMessage = 'Error: ${e.toString()}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> selectBloodBank(BuildContext context) async {
    context.read<BloodBankFetchProvider>().onBloodGroupChanged(_selectedBloodGroup ?? '');
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const SearchBloodBank(formAddOrder: true),
      ),
    );
    if (result != null && result is Map<String, dynamic>) {
      _selectedBloodBank = result;
      if (result['availableUnits'] != null && result['availableUnits']['searched'] != null) {
        _selectedBloodGroup = result['availableUnits']['searched']['bloodGroup'] as String?;
      } else {
        _selectedBloodGroup = null;
      }
      notifyListeners();
    }
  }

  void setBloodGroup(String? bloodGroup) {
    _selectedBloodGroup = bloodGroup;
    notifyListeners();
  }

  // Calculate total units
  int calculateTotalUnits() {
    if (_selectedBloodBank == null || _selectedBloodBank!['availableUnits'] == null) return 0;
    int total = 0;
    final availableUnits = _selectedBloodBank!['availableUnits'];
    if (availableUnits['searched'] != null) {
      total += (availableUnits['searched']['units'] as num?)?.toInt() ?? 0;
    }
    if (availableUnits['compatible'] != null && availableUnits['compatible'] is List) {
      for (var group in availableUnits['compatible']) {
        total += (group['units'] as num?)?.toInt() ?? 0;
      }
    }
    return total;
  }

  // Dispose controllers
  @override
  void dispose() {
    super.dispose();
    _quantityController.dispose();
    _addressController.dispose();
  }
}