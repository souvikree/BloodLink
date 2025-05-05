import 'dart:io';
import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:flutter_phone_direct_caller/flutter_phone_direct_caller.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:math' as math;


class OrderDetailsPage extends StatelessWidget {
  final Map<String, dynamic> order;

  const OrderDetailsPage({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    final isOrderCancel= order['status'] == 'cancelled';
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
      body: Stack(
        children: [
          SingleChildScrollView(
            physics: (isOrderCancel) ? const NeverScrollableScrollPhysics() : const BouncingScrollPhysics(),
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
                        children: [
                          Row(
                            children: [
                              const Text('Order Information', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: Color(0xFF212121))),

                              SizedBox(width: 8),
                              if(isOrderCancel) Text(
                                '[Order cancelled]',
                                style: TextStyle(
                                  color: Colors.red,
                                  fontWeight: FontWeight.bold, // Optional for emphasis
                                ),
                              )

                            ],
                            
                          ),
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
                  if(order['status'] != 'cancelled')
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
                            await cancelOrder(orderId, context);
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Order ID is not available.')));
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          shadowColor: Colors.transparent,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          minimumSize: const Size(double.infinity, 50),
                        ),
                        child: const Text('Cancel Order', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
                      ),
                    ),
                ],
              ),
            ),
          ),
          if(isOrderCancel) const CancelledStamp()
        ],
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
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.grey[600]),
              ),
              const SizedBox(height: 4),
              Tooltip(
                message: value,
                child: Text(
                  value,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF212121)),
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
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    prescription?.isNotEmpty == true
                        ? 'View Document'
                        : 'No document provided',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF212121)),
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
                builder: (context) => FullScreenImageDialog(imagePath: prescription),
              );
            },
            child: Container(
              height: 150,
              decoration: BoxDecoration(
                border: Border.all(color: const Color(0xFFD32F2F).withOpacity(0.3)),
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

class CancelledStamp extends StatelessWidget {
  const CancelledStamp({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: FadeIn(
        duration: const Duration(milliseconds: 800),
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Uneven circle base
            CustomPaint(
              painter: _UnevenCirclePainter(),
              size: const Size(260, 260),
            ),
            // Inner content
            SizedBox(
              width: 260,
              height: 260,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Inner embossed circle for depth
                  Container(
                    width: 240,
                    height: 240,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [
                          const Color(0xFF3E0000).withOpacity(0.9),
                          Colors.red[900]!.withOpacity(0.85),
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.5),
                          blurRadius: 12,
                          offset: const Offset(4, 4),
                          spreadRadius: -2,
                        ),
                        BoxShadow(
                          color: Colors.white.withOpacity(0.15),
                          blurRadius: 12,
                          offset: const Offset(-4, -4),
                          spreadRadius: -2,
                        ),
                      ],
                    ),
                  ),
                  // Background texture
                  CustomPaint(
                    painter: _StampTexturePainter(),
                    size: const Size(240, 240),
                  ),
                  // Outer circular text with enhanced 3D effect
                  _buildCircularText(
                    text: 'CANCELLED • BLOOD LINK AUTHORITY •',
                    radius: 100,
                    textStyle: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white.withOpacity(0.9),
                      letterSpacing: 1.5,
                      shadows: [
                        Shadow(
                          color: Colors.black.withOpacity(0.7),
                          blurRadius: 6,
                          offset: const Offset(2, 2),
                        ),
                      ],
                    ),
                  ),
                  // Inner circular text with enhanced 3D effect
                  _buildCircularText(
                    text: 'CANCELLED • CHOICE NOT BLOOD LINK •',
                    radius: 80,
                    textStyle: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.white.withOpacity(0.7),
                      letterSpacing: 1,
                      shadows: [
                        Shadow(
                          color: Colors.black.withOpacity(0.6),
                          blurRadius: 5,
                          offset: const Offset(2, 2),
                        ),
                      ],
                    ),
                  ),
                  // Central emblem (Ashoka Chakra-inspired) with enhanced 3D effect
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: RadialGradient(
                        colors: [
                          Colors.white.withOpacity(0.2),
                          Colors.white.withOpacity(0.05),
                        ],
                        center: Alignment.center,
                        radius: 0.8,
                      ),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.6),
                        width: 4,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.5),
                          blurRadius: 8,
                          offset: const Offset(3, 3),
                        ),
                        BoxShadow(
                          color: Colors.white.withOpacity(0.1),
                          blurRadius: 8,
                          offset: const Offset(-3, -3),
                        ),
                      ],
                    ),
                    child: CustomPaint(
                      painter: _AshokaChakraPainter(),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCircularText({
    required String text,
    required double radius,
    required TextStyle textStyle,
  }) {
    return CustomPaint(
      painter: _CircularTextPainter(
        text: text,
        radius: radius,
        textStyle: textStyle,
      ),
      size: Size(radius * 2, radius * 2),
    );
  }
}

class _UnevenCirclePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    const baseRadius = 130.0;
    final path = Path();
    final paint = Paint()
      ..shader = RadialGradient(
        colors: [
          Colors.red[900]!.withOpacity(0.95),
          const Color(0xFF3E0000).withOpacity(0.9),
        ],
        center: Alignment.center,
        radius: 0.7,
      ).createShader(Rect.fromCircle(center: center, radius: baseRadius))
      ..style = PaintingStyle.fill;

    // Create uneven edge by varying the radius with a sine wave
    const segments = 100;
    const amplitude = 5.0; // How much the edge varies
    const frequency = 10; // How many waves around the circle
    for (int i = 0; i <= segments; i++) {
      final angle = (i / segments) * 2 * math.pi;
      final radiusVariation = amplitude * math.sin(frequency * angle);
      final radius = baseRadius + radiusVariation;
      final x = center.dx + radius * math.cos(angle);
      final y = center.dy + radius * math.sin(angle);
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    path.close();

    // Draw the uneven circle with shadow for 3D effect
    canvas.drawShadow(path, Colors.black.withOpacity(0.6), 16, false);
    canvas.drawPath(path, paint);

    // Draw the border
    final borderPaint = Paint()
      ..color = const Color(0xFF3E0000)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 10;
    canvas.drawPath(path, borderPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _StampTexturePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;

    for (double i = 0; i < size.width; i += 8) {
      for (double j = 0; j < size.height; j += 8) {
        canvas.drawCircle(Offset(i, j), 1.5, paint);
      }
    }

    // Add subtle radial lines for texture
    final center = Offset(size.width / 2, size.height / 2);
    final linePaint = Paint()
      ..color = Colors.white.withOpacity(0.08)
      ..strokeWidth = 0.8;
    for (int i = 0; i < 36; i++) {
      final angle = (i * 10) * (math.pi / 180);
      final end = center + Offset(math.cos(angle) * (size.width / 2), math.sin(angle) * (size.width / 2));
      canvas.drawLine(center, end, linePaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _AshokaChakraPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    const spokes = 24;
    const radius = 25.0;

    // Draw outer blue circle
    final outerCirclePaint = Paint()
      ..color = Colors.blue[900]!
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius, outerCirclePaint);

    // Draw spokes with slight shadow for 3D effect
    final spokePaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    for (int i = 0; i < spokes; i++) {
      final angle = (i * 360 / spokes) * (math.pi / 180);
      final start = center;
      final end = center + Offset(math.cos(angle) * radius, math.sin(angle) * radius);
      canvas.drawLine(start, end, spokePaint);
    }

    // Draw central blue circle with enhanced 3D effect
    final circlePaint = Paint()
      ..color = Colors.blue[900]!
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, 12, circlePaint);

    final shadowPaint = Paint()
      ..color = Colors.black.withOpacity(0.4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;
    canvas.drawCircle(center, 12, shadowPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _CircularTextPainter extends CustomPainter {
  final String text;
  final double radius;
  final TextStyle textStyle;

  _CircularTextPainter({
    required this.text,
    required this.radius,
    required this.textStyle,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final textSpan = TextSpan(text: text, style: textStyle);
    final textPainter = TextPainter(
      text: textSpan,
      textDirection: TextDirection.ltr,
    )..layout();

    final charAngle = (360 * (math.pi / 180)) / text.length;

    for (int i = 0; i < text.length; i++) {
      final char = text[i];
      final angle = i * charAngle - (math.pi / 2); // Start from top
      final x = center.dx + radius * math.cos(angle);
      final y = center.dy + radius * math.sin(angle);

      canvas.save();
      canvas.translate(x, y);
      canvas.rotate(angle + math.pi / 2);

      final charSpan = TextSpan(text: char, style: textStyle);
      final charPainter = TextPainter(
        text: charSpan,
        textDirection: TextDirection.ltr,
      )..layout();

      charPainter.paint(canvas, Offset(-charPainter.width / 2, -charPainter.height / 2));
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}