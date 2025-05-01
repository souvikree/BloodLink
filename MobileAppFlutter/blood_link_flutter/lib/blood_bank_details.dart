import 'package:flutter/material.dart';

class BloodBankDetails extends StatelessWidget {
  final Map<String, dynamic> bloodData;

  const BloodBankDetails({super.key, required this.bloodData});

  @override
  Widget build(BuildContext context) {
    // Extract blood groups as a string (e.g., "A+, A+, ...")
    final bloodGroups = (bloodData['bloodGroups'] as List<dynamic>?)?.map((group) => group['bloodGroup'] as String).join(', ') ?? 'N/A';

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text(
          'Blood Bank Details',
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
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Expanded(
              child: AnimatedOpacity(
                opacity: 1.0,
                duration: const Duration(milliseconds: 300),
                child: Card(
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
                        // Header
                        const Text(
                          'Blood Bank Information',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF212121),
                          ),
                        ),
                        Container(
                          margin: const EdgeInsets.only(top: 8, bottom: 16),
                          height: 3,
                          width: 60,
                          color: const Color(0xFFD32F2F),
                        ),
                        // Blood Bank Name
                        _buildDetailRow(
                          icon: Icons.local_hospital,
                          label: 'Name',
                          value: bloodData['name'] ?? 'N/A',
                        ),
                        const SizedBox(height: 16),
                        // Contact Number
                        _buildDetailRow(
                          icon: Icons.phone,
                          label: 'Contact Number',
                          value: bloodData['contactNumber']?.toString() ?? 'N/A',
                        ),
                        const SizedBox(height: 16),
                        // Address
                        _buildDetailRow(
                          icon: Icons.location_on,
                          label: 'Address',
                          value: bloodData['address'] ?? 'N/A',
                          maxLines: 2,
                        ),
                        const SizedBox(height: 16),
                        // Blood Groups
                        _buildDetailRow(
                          icon: Icons.water_drop,
                          label: 'Blood Groups',
                          value: bloodGroups,
                        ),
                        const SizedBox(height: 16),
                        // Available Units
                        _buildDetailRow(
                          icon: Icons.format_list_numbered,
                          label: 'Available Quantity',
                          value: '${bloodData['availableUnits'] ?? 'N/A'} Units',
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            // Request Blood Button
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
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Blood request initiated for ${bloodData['name'] ?? 'N/A'}',
                      ),
                    ),
                  );
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
                  'Request Blood',
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
              Text(
                value,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF212121),
                ),
                maxLines: maxLines,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    );
  }
}