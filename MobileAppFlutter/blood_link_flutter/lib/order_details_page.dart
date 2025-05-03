import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_phone_direct_caller/flutter_phone_direct_caller.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class OrderDetailsPage extends StatelessWidget {
  final Map<String, dynamic> order;

  const OrderDetailsPage({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text(
          'Order Details',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: Color(0xFF212121),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        shadowColor: Colors.black.withOpacity(0.2),
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: Color(0xFFD32F2F),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(
            color: Colors.grey[200],
            height: 1,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Card(
                elevation: 5,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(
                      color: const Color(0xFFD32F2F).withOpacity(0.3),
                    ),
                    borderRadius: BorderRadius.circular(15),
                  ),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    // Inside the Column of the Card
                    children: [
                      const Text('Order Information', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: Color(0xFF212121))),
                      Container(margin: const EdgeInsets.only(top: 8, bottom: 16), height: 3, width: 60, color: const Color(0xFFD32F2F)),
                      _buildDetailRow(icon: Icons.assignment, label: 'Order ID', value: order['_id'] ?? 'N/A'),
                      const SizedBox(height: 16),
                      _buildDetailRow(icon: Icons.person, label: 'Patient ID', value: order['patient'] ?? 'N/A'),
                      const SizedBox(height: 16),
                      _buildDetailRow(icon: Icons.bloodtype, label: 'Blood Type', value: order['bloodType'] ?? 'N/A'),
                      const SizedBox(height: 16),
                      _buildDetailRow(icon: Icons.format_list_numbered, label: 'Quantity', value: order['quantity'] != null ? '${order['quantity']} units' : 'N/A'),
                      const SizedBox(height: 16),
                      _buildDetailRow(icon: Icons.location_on, label: 'Delivery Address', value: order['deliveryAddress'] ?? 'N/A', maxLines: 2),
                      const SizedBox(height: 16),
                      _buildDetailRow(icon: Icons.local_hospital, label: 'Blood Bank Name', value: order['bloodBank']?['name'] ?? 'N/A'),
                      const SizedBox(height: 16),
                      _buildDetailRow(icon: Icons.location_on, label: 'Blood Bank Address', value: order['bloodBank']?['address'] ?? 'N/A', maxLines: 2),
                      const SizedBox(height: 16),
                      InkWell(
                        onTap: () async {
                          final String? contactNumber = order['bloodBank']?['contactNumber']?.toString();
                          if (contactNumber != null && contactNumber.isNotEmpty) {
                            await FlutterPhoneDirectCaller.callNumber(contactNumber);
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Contact number is not available.')));
                          }
                        },
                        child: _buildDetailRow(icon: Icons.phone, label: 'Contact Number', value: order['bloodBank']?['contactNumber']?.toString() ?? 'N/A'),
                      ),
                      const SizedBox(height: 16),
                      _buildPrescriptionRow(context: context, icon: Icons.description, label: 'Prescription Document', prescription: order['prescriptionUrl']),
                      const SizedBox(height: 16),
                      _buildDetailRow(icon: Icons.payment, label: 'Payment Status', value: order['paymentStatus']?.toUpperCase() ?? 'N/A'),
                      const SizedBox(height: 16),
                      _buildDetailRow(icon: Icons.account_balance_wallet, label: 'Total Price', value: order['totalPrice'] != null ? '₹${order['totalPrice'].toStringAsFixed(2)}' : 'N/A'),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              if(order['status']!='cancelled')
              Container(
                margin: const EdgeInsets.only(top: 16, bottom: 16),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFD32F2F), Color(0xFFB71C1C)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFD32F2F).withOpacity(0.3),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: ElevatedButton(
                  onPressed: () async {
                    final orderId = order['_id'];
                    if (orderId != null) {
                      await cancelOrder(orderId,context);
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Order ID is not available.'),
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    minimumSize: const Size(double.infinity, 50),
                  ),
                  child: const Text(
                    'Cancel Order',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String label,
    required String value,
    int maxLines = 1,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFFD32F2F).withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            color: const Color(0xFFD32F2F),
            size: 24,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 4),
              Tooltip(
                message: value,
                child: Text(
                  value,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF212121),
                  ),
                  maxLines: maxLines,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPrescriptionRow({
    required BuildContext context,
    required IconData icon,
    required String label,
    required String? prescription,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFD32F2F).withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: const Color(0xFFD32F2F),
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    prescription?.isNotEmpty == true
                        ? 'View Document'
                        : 'No document provided',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF212121),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        if (prescription?.isNotEmpty == true) ...[
          const SizedBox(height: 12),
          GestureDetector(
            onTap: () {
              showDialog(
                context: context,
                builder: (context) => FullScreenImageDialog(
                  imagePath: prescription,
                ),
              );
            },
            child: Container(
              height: 150,
              decoration: BoxDecoration(
                border: Border.all(
                  color: const Color(0xFFD32F2F).withOpacity(0.3),
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: _buildPrescriptionImage(prescription!),
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildPrescriptionImage(String prescription) {
      return Image.network(
        prescription,
        fit: BoxFit.cover,
        width: double.infinity,
        errorBuilder: (context, error, stackTrace) => Container(
          color: Colors.grey[200],
          child: const Icon(
            Icons.broken_image,
            size: 50,
            color: Colors.grey,
          ),
        ),
      );

  }
}

Future<void> cancelOrder(String orderId, BuildContext context) async {
  try {
    // Show loading dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const AlertDialog(
        content: Row(
          children: [
            CircularProgressIndicator(),
            SizedBox(width: 16),
            Text('Cancelling Order...'),
          ],
        ),
      ),
    );

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('authToken');

    if (token == null) {
      debugPrint('No token found');
      Navigator.pop(context); // Close loading dialog
      return;
    }

    final response = await http.put(
      Uri.parse('https://bloodlink-flsd.onrender.com/api/patients/orders/${orderId}/cancel'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    print('Cancel statue code : ${response}');

    Navigator.pop(context); // Close loading dialog first

    if (response.statusCode == 200) {
      Navigator.pop(context, true); // Go back and pass true
    } else {
      debugPrint('Failed to cancel order: ${response.body}');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to cancel order. Please try again.')),
      );
    }
  } catch (e) {
    Navigator.pop(context); // Close loading dialog on error
    debugPrint('Exception during cancel order: $e');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Something went wrong. Please try again.')),
    );
  }
}


class FullScreenImageDialog extends StatelessWidget {
  final String imagePath;

  const FullScreenImageDialog({super.key, required this.imagePath});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.black.withOpacity(0.8),
      insetPadding: const EdgeInsets.all(0),
      child: Stack(
        children: [
          Center(
            child: InteractiveViewer(
              minScale: 0.5,
              maxScale: 4.0,
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: const Color(0xFFD32F2F).withOpacity(0.3),
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: _buildFullScreenImage(imagePath),
                ),
              ),
            ),
          ),
          Positioned(
            top: 40,
            right: 16,
            child: IconButton(
              icon: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.close,
                  color: Color(0xFFD32F2F),
                  size: 24,
                ),
              ),
              onPressed: () => Navigator.pop(context),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFullScreenImage(String imagePath) {
    if (imagePath.startsWith('http')) {
      return Image.network(
        imagePath,
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) => Container(
          color: Colors.grey[200],
          child: const Icon(
            Icons.broken_image,
            size: 100,
            color: Colors.grey,
          ),
        ),
      );
    } else {
      return Image.file(
        File(imagePath),
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) => Container(
          color: Colors.grey[200],
          child: const Icon(
            Icons.broken_image,
            size: 100,
            color: Colors.grey,
          ),
        ),
      );
    }
  }
}