import 'package:blood_link_flutter/order_details_page.dart';
import 'package:flutter/material.dart';

class RequestItem extends StatelessWidget {
  final Map<String, dynamic> order;
  final Function() orderDetailsPage;

  final String bloodGroup;
  final String quantity;
  final String bloodBankId;

  const RequestItem({
    super.key,
    required this.bloodGroup,
    required this.quantity,
    required this.bloodBankId, required this.order,
    required this.orderDetailsPage,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedOpacity(
      opacity: 1.0,
      duration: const Duration(milliseconds: 300),
      child: Card(
        margin: const EdgeInsets.symmetric(horizontal: 15, vertical: 8),
        elevation: 5,
        shadowColor: Colors.black.withOpacity(0.1),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15),
        ),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white, // Clean white base for healthcare
            border: Border.all(color: const Color(0xFFD32F2F), width: 1), // Subtle red border
            borderRadius: BorderRadius.circular(15),
          ),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Blood Drop Icon
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                    border: Border.all(color: const Color(0xFFD32F2F), width: 2), // Red border
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.water_drop,
                    color: const Color(0xFFD32F2F), // Red blood drop
                    size: MediaQuery.of(context).size.width * 0.14, // Adjusted size
                  ),
                ),
                const SizedBox(width: 15),
                // Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Blood Type: $bloodGroup',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF212121), // Dark grey for primary text
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Quantity: $quantity Units',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey[600], // Lighter grey for secondary text
                        ),
                      ),
                      Text(
                        'Blood Bank: $bloodBankId',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                // View Button
                Container(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFD32F2F), Color(0xFFB71C1C)], // Red gradient
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: BorderRadius.circular(13),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFD32F2F).withOpacity(0.3),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed: orderDetailsPage
                    ,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      foregroundColor: Colors.white,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(13),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 12,
                      ),
                    ),
                    child: const Text(
                      'View',
                      style: TextStyle(
                        fontSize: 14,
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
      ),
    );
  }
}