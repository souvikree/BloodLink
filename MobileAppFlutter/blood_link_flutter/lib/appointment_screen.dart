import 'dart:convert';

import 'package:blood_link_flutter/add_order_screen.dart';
import 'package:blood_link_flutter/widgets/request_item_widget.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import 'order_details_page.dart';

class AppointmentScreen extends StatefulWidget {
  const AppointmentScreen({super.key});

  @override
  State<AppointmentScreen> createState() => _AppointmentScreenState();
}

class _AppointmentScreenState extends State<AppointmentScreen> {
  List<Map<String, dynamic>> orders = [];
  bool isLoading = true;

  @override
  void initState() {
    fetchOrders();
    super.initState();
  }

  Future<void> fetchOrders() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token =
          prefs.getString('authToken'); // Ensure token is stored on login

      if (token == null) {
        // Handle missing token
        setState(() => isLoading = false);
        return;
      }
      print('in fetch order');
      final response = await http.get(
        Uri.parse(
            'https://bloodlink-flsd.onrender.com/api/patients/orders/history'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      print('order details ${response.statusCode}');
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('order details ${data}');
        setState(() {
          orders = data.map((e) => e as Map<String, dynamic>).toList();
          isLoading = false;
        });
      } else {
        // Handle error
        setState(() => isLoading = false);
        debugPrint('Error fetching orders: ${response.body}');
      }
    } catch (e) {
      setState(() => isLoading = false);
      debugPrint('Exception during fetch: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text(
          'Orders',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: Color(0xFF212121),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        shadowColor: Colors.black.withOpacity(0.2),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(
            color: Colors.grey[200],
            height: 1,
          ),
        ),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : orders.isEmpty
              ? const Center(child: Text('No orders found'))
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  itemCount: orders.length,
                  itemBuilder: (context, index) {
                    final appointment = orders[index];
                    return RequestItem(
                      bloodBankId: appointment['bloodBank']?['name'] ??
                          'Unknown Blood Bank',
                      bloodGroup: appointment['bloodType'] ?? 'Unknown Group',
                      quantity: appointment['quantity']?.toString() ?? '0',
                      order: appointment,
                      orderDetailsPage: () async {
                       bool result = await Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>
                                    OrderDetailsPage(order: appointment))) as bool;
                       if(result){
                         fetchOrders();
                       }
                      },
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddOrderScreen()),
          ).then((_) {
            // Refresh list when returning
            fetchOrders();
          });
        },
        backgroundColor: const Color(0xFFD32F2F),
        elevation: 6,
        child: const Icon(
          Icons.add,
          color: Colors.white,
          size: 28,
        ),
      ),
    );
  }
}
