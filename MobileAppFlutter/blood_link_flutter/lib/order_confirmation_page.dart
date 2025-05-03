import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class OrderConfirmationScreen extends StatelessWidget {
  final Map<String, dynamic> orderData;

  const OrderConfirmationScreen({super.key, required this.orderData});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: Text(
          'Order Confirmed',
          style: GoogleFonts.poppins(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF212121),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        shadowColor: Colors.black.withOpacity(0.2),
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: Color(0xFFE91E63),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1, color: Colors.grey),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Success Checkmark
              Container(
                margin: const EdgeInsets.only(bottom: 20),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [Color(0xFFE91E63), Color(0xFFD81B60)],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFE91E63).withOpacity(0.3),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.check,
                  color: Colors.white,
                  size: 40,
                ),
              ),

              // Order Status Card
              _buildInfoCard(
                context,
                'Order Status',
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.info_outline,
                                color: Color(0xFFE91E63), size: 20),
                            const SizedBox(width: 8),
                            Text(
                              'Order Status',
                              style: GoogleFonts.poppins(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF212121),
                              ),
                            ),
                          ],
                        ),
                        Chip(
                          label: Text(
                            orderData['status']?.toUpperCase() ?? 'PENDING',
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontWeight: FontWeight.w500,
                              fontSize: 12,
                            ),
                          ),
                          backgroundColor: orderData['status'] == 'pending'
                              ? const Color(0xFFE91E63)
                              : const Color(0xFF4CAF50),
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        const Icon(Icons.account_balance_wallet,
                            size: 20, color: Color(0xFFE91E63)),
                        const SizedBox(width: 8),
                        Text(
                          'Pay on Delivery',
                          style: GoogleFonts.poppins(
                            color: const Color(0xFF4CAF50),
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Order ID: ${orderData['_id'] ?? 'N/A'}',
                      style: GoogleFonts.poppins(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                icon: Icons.info_outline,
              ),

              // Blood Bank Details
              _buildInfoCard(
                context,
                'Blood Bank',
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      orderData['bloodBank'] != null &&
                          orderData['bloodBank'] is Map
                          ? orderData['bloodBank']['name'] ?? 'Unknown Bank'
                          : 'Unknown Bank',
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      orderData['bloodBank'] != null &&
                          orderData['bloodBank'] is Map
                          ? orderData['bloodBank']['address'] ?? 'No address'
                          : 'No address',
                      style: GoogleFonts.poppins(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                    Text(
                      orderData['bloodBank'] != null &&
                          orderData['bloodBank'] is Map
                          ? 'License: ${orderData['bloodBank']['licenseId'] ?? 'N/A'}'
                          : 'License: N/A',
                      style: GoogleFonts.poppins(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                icon: Icons.local_hospital,
              ),

              // Order Details
              _buildInfoCard(
                context,
                'Order Details',
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildDetailRow(
                      'Blood Type',
                      orderData['bloodType'] ?? 'N/A',
                      icon: Icons.bloodtype,
                    ),
                    _buildDetailRow(
                      'Quantity',
                      '${orderData['quantity'] ?? 0} units',
                      icon: Icons.format_list_numbered,
                    ),
                    _buildDetailRow(
                      'Delivery Address',
                      orderData['deliveryAddress'] ?? 'N/A',
                      icon: Icons.location_on,
                    ),
                    _buildDetailRow(
                      'Requested At',
                      orderData['requestedAt'] != null
                          ? DateTime.parse(orderData['requestedAt'])
                          .toString()
                          .split(' ')
                          .first
                          : 'N/A',
                      icon: Icons.calendar_today,
                    ),
                  ],
                ),
                icon: Icons.description,
              ),

              // Charges Section
              _buildInfoCard(
                context,
                'Charges',
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildDetailRow(
                      'Handling Charge',
                      '₹${orderData['handlingCharge'] ?? 0}',
                      icon: Icons.monetization_on,
                    ),
                    _buildDetailRow(
                      'Service Charge',
                      '₹${orderData['serviceCharge'] ?? 0}',
                      icon: Icons.receipt,
                    ),
                    const Divider(color: Colors.grey),
                    _buildDetailRow(
                      'Total Price',
                      '₹${orderData['totalPrice'] ?? 0}',
                      isBold: true,
                      icon: Icons.payment,
                    ),
                  ],
                ),
                icon: Icons.attach_money,
              ),

              // Prescription Image
              if (orderData['prescriptionUrl'] != null)
                Container(
                  margin: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: const Color(0xFFE91E63).withOpacity(0.3),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: FadeInImage.assetNetwork(
                      placeholder: 'assets/images/placeholder.png',
                      image: orderData['prescriptionUrl'],
                      fit: BoxFit.cover,
                      height: 220,
                      width: double.infinity,
                      fadeInDuration: const Duration(milliseconds: 500),
                    ),
                  ),
                ),

              // Done Button
              Hero(
                tag: 'done_button',
                child: Container(
                  margin: const EdgeInsets.only(top: 24),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFE91E63), Color(0xFFD81B60)],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFE91E63).withOpacity(0.4),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed: () => Navigator.popUntil(
                      context,
                      ModalRoute.withName(Navigator.defaultRouteName),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.symmetric(
                        vertical: 18,
                        horizontal: 32,
                      ),
                      minimumSize: const Size(double.infinity, 56),
                    ),
                    child: Text(
                      'Done',
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
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

  Widget _buildInfoCard(
      BuildContext context, String title, Widget content, {IconData? icon}) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.8),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFFE91E63).withOpacity(0.2),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              if (icon != null) ...[
                Icon(icon, color: const Color(0xFFE91E63), size: 20),
                const SizedBox(width: 8),
              ],
              Text(
                title,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF212121),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          content,
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value,
      {bool isBold = false, IconData? icon}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              if (icon != null) ...[
                Icon(icon, color: const Color(0xFFE91E63), size: 18),
                const SizedBox(width: 8),
              ],
              Text(
                label,
                style: GoogleFonts.poppins(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
              ),
            ],
          ),
          Text(
            value,
            style: GoogleFonts.poppins(
              fontWeight: isBold ? FontWeight.w600 : FontWeight.normal,
              fontSize: 14,
              color: const Color(0xFF212121),
            ),
          ),
        ],
      ),
    );
  }
}