import 'package:blood_link_flutter/pages/add_order_screen.dart';

import 'package:blood_link_flutter/provider/appointment_screen_provider.dart';

import 'package:blood_link_flutter/widgets/request_item_widget.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../order_details_page.dart';

class AppointmentScreen extends StatelessWidget {
  const AppointmentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppointmentProvider>(context, listen: false);

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
      body: Consumer<AppointmentProvider>(
        builder: (context, provider, child) {
          return RefreshIndicator(
            onRefresh: provider.fetchOrders,
            child: provider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : provider.orders.isEmpty
                ? const Center(child: Text('No orders found'))
                : ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 15),
              itemCount: provider.orders.length,
              itemBuilder: (context, index) {
                final appointment = provider.orders[index];
                return RequestItem(
                  bloodBankId: appointment['bloodBank']?['name'] ??
                      'Unknown Blood Bank',
                  bloodGroup:
                  appointment['bloodType'] ?? 'Unknown Group',
                  quantity:
                  appointment['quantity']?.toString() ?? '0',
                  order: appointment,
                  orderDetailsPage: () async {
                    bool result = await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            OrderDetailsPage(order: appointment),
                      ),
                    ) as bool;
                    if (result) {
                      provider.refreshOrders();
                    }
                  },
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddOrderScreen()),
          ).then((_) {
            provider.refreshOrders();
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
