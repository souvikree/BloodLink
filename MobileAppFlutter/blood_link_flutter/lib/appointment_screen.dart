import 'package:blood_link_flutter/add_order_screen.dart';
import 'package:blood_link_flutter/widgets/default_value.dart';
import 'package:blood_link_flutter/widgets/request_item_widget.dart';
import 'package:flutter/material.dart';

class AppointmentScreen extends StatelessWidget {
  const AppointmentScreen({super.key});

  // Placeholder data for appointments

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100], // Soft grey background for healthcare
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
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 15),
        itemCount: orders.length,
        itemBuilder: (context, index) {
          final appointment = orders[index];
          return RequestItem(
            bloodBankId: appointment['bloodBankId']!,
            bloodGroup: appointment['bloodGroup']!,
            quantity: appointment['quantity']!,
            order: appointment,
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(context,
              MaterialPageRoute(builder: (context) => AddOrderScreen()));
        },
        backgroundColor: const Color(0xFFD32F2F), // Red for blood bank theme
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
