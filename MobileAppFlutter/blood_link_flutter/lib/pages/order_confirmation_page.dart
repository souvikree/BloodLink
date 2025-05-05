import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class OrderConfirmationScreen extends StatelessWidget {
  final Map<String, dynamic> orderData;

  const OrderConfirmationScreen({super.key, required this.orderData});

  @override
  Widget build(BuildContext context) {
    // Get device width for responsiveness
    final width = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: Text(
          'Order Confirmed',
          style: GoogleFonts.poppins(
            fontSize: width * 0.06, // Responsive font size
            fontWeight: FontWeight.w700,
            color: const Color(0xFF212121),
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        shadowColor: Colors.black.withOpacity(0.2),
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back,
            color: const Color(0xFFE91E63),
            size: width * 0.07, // Responsive icon size
          ),
          onPressed: () => Navigator.pop(context),
        ),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1, color: Colors.grey),
        ),
      ),
      body: Padding(
        padding: EdgeInsets.all(width * 0.05), // Responsive padding
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Success Checkmark
              Container(
                margin: EdgeInsets.only(bottom: width * 0.05),
                padding: EdgeInsets.all(width * 0.04),
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
                child: Icon(
                  Icons.check,
                  color: Colors.white,
                  size: width * 0.1, // Responsive icon
                ),
              ),

              // Order Status Card
              _buildInfoCard(
                context,
                width,
                'Order Status',
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.info_outline,
                                color: const Color(0xFFE91E63),
                                size: width * 0.05),
                            SizedBox(width: width * 0.02),
                            Text(
                              'Order Status',
                              style: GoogleFonts.poppins(
                                fontSize: width * 0.04,
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
                              fontSize: width * 0.03,
                            ),
                          ),
                          backgroundColor: orderData['status'] == 'pending'
                              ? const Color(0xFFE91E63)
                              : const Color(0xFF4CAF50),
                          padding: EdgeInsets.symmetric(
                              horizontal: width * 0.02),
                        ),
                      ],
                    ),
                    SizedBox(height: width * 0.03),
                    Row(
                      children: [
                        Icon(Icons.account_balance_wallet,
                            size: width * 0.05, color: const Color(0xFFE91E63)),
                        SizedBox(width: width * 0.02),
                        Text(
                          'Pay on Delivery',
                          style: GoogleFonts.poppins(
                            color: const Color(0xFF4CAF50),
                            fontSize: width * 0.035,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: width * 0.02),
                    Text(
                      'Order ID: ${orderData['_id'] ?? 'N/A'}',
                      style: GoogleFonts.poppins(
                        color: Colors.grey[600],
                        fontSize: width * 0.035,
                      ),
                    ),
                  ],
                ),
                icon: Icons.info_outline,
              ),

              // Blood Bank Details
              _buildInfoCard(
                context,
                width,
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
                        fontSize: width * 0.04,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    SizedBox(height: width * 0.02),
                    Text(
                      orderData['bloodBank'] != null &&
                          orderData['bloodBank'] is Map
                          ? orderData['bloodBank']['address'] ?? 'No address'
                          : 'No address',
                      style: GoogleFonts.poppins(
                        color: Colors.grey[600],
                        fontSize: width * 0.035,
                      ),
                    ),
                    Text(
                      orderData['bloodBank'] != null &&
                          orderData['bloodBank'] is Map
                          ? 'License: ${orderData['bloodBank']['licenseId'] ?? 'N/A'}'
                          : 'License: N/A',
                      style: GoogleFonts.poppins(
                        color: Colors.grey[600],
                        fontSize: width * 0.035,
                      ),
                    ),
                  ],
                ),
                icon: Icons.local_hospital,
              ),

              // Order Details
              _buildInfoCard(
                context,
                width,
                'Order Details',
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildDetailRow(
                        width, 'Blood Type', orderData['bloodType'] ?? 'N/A',
                        icon: Icons.bloodtype),
                    _buildDetailRow(width, 'Quantity',
                        '${orderData['quantity'] ?? 0} units',
                        icon: Icons.format_list_numbered),
                    _buildDetailRow(width, 'Delivery Address',
                        orderData['deliveryAddress'] ?? 'N/A',
                        icon: Icons.location_on),
                    _buildDetailRow(
                      width,
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
                width,
                'Charges',
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildDetailRow(width, 'Handling Charge',
                        '₹${orderData['handlingCharge'] ?? 0}',
                        icon: Icons.monetization_on),
                    _buildDetailRow(width, 'Service Charge',
                        '₹${orderData['serviceCharge'] ?? 0}',
                        icon: Icons.receipt),
                    const Divider(color: Colors.grey),
                    _buildDetailRow(width, 'Total Price',
                        '₹${orderData['totalPrice'] ?? 0}',
                        isBold: true, icon: Icons.payment),
                  ],
                ),
                icon: Icons.attach_money,
              ),

              // Prescription Image
              if (orderData['prescriptionUrl'] != null)
                Container(
                  margin: EdgeInsets.symmetric(vertical: width * 0.04),
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
                      height: width * 0.6, // responsive height
                      width: double.infinity,
                      fadeInDuration: const Duration(milliseconds: 500),
                    ),
                  ),
                ),

              // Done Button
              Hero(
                tag: 'done_button',
                child: Container(
                  margin: EdgeInsets.only(top: width * 0.06),
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
                    onPressed: () => Navigator.pop(context, true),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: EdgeInsets.symmetric(
                        vertical: width * 0.045,
                        horizontal: width * 0.08,
                      ),
                      minimumSize: Size(double.infinity, width * 0.14),
                    ),
                    child: Text(
                      'Done',
                      style: GoogleFonts.poppins(
                        fontSize: width * 0.045,
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
      BuildContext context, double width, String title, Widget content,
      {IconData? icon}) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      margin: EdgeInsets.only(bottom: width * 0.04),
      padding: EdgeInsets.all(width * 0.045),
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
                Icon(icon, color: const Color(0xFFE91E63), size: width * 0.05),
                SizedBox(width: width * 0.02),
              ],
              Text(
                title,
                style: GoogleFonts.poppins(
                  fontSize: width * 0.045,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF212121),
                ),
              ),
            ],
          ),
          SizedBox(height: width * 0.03),
          content,
        ],
      ),
    );
  }

  Widget _buildDetailRow(
      double width, String label, String value,
      {bool isBold = false, IconData? icon}) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: width * 0.015),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start, // Align top if text wraps
        children: [
          Row(
            children: [
              if (icon != null) ...[
                Icon(icon, color: const Color(0xFFE91E63), size: width * 0.045),
                SizedBox(width: width * 0.02),
              ],
              Text(
                label,
                style: GoogleFonts.poppins(
                  fontSize: width * 0.035,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF212121),
                ),
              ),
            ],
          ),
          // Wrap value text inside Flexible for overflow
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end, // align right
              overflow: TextOverflow.ellipsis, // show ...
              maxLines: 1, // only 1 line
              style: GoogleFonts.poppins(
                fontSize: width * 0.035,
                fontWeight: isBold ? FontWeight.w700 : FontWeight.w500,
                color: isBold ? const Color(0xFF212121) : Colors.grey[700],
              ),
            ),
          ),
        ],
      ),
    );
  }


}
