import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'pages/add_order_screen.dart';
import 'extra_functions.dart';

class BloodBankDetails extends StatelessWidget {
  final Map<String, dynamic> bloodData;

  const BloodBankDetails({super.key, required this.bloodData});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    // Extract unique blood groups
    final bloodGroupUnitMap = countBloodGroupType(bloodData);
    final bloodGroupsText = bloodGroupUnitMap.isNotEmpty
        ? bloodGroupUnitMap.entries.map((e) => '${e.key} (${e.value})').join(', ')
        : 'N/A';

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text(
          'Blood Bank Details',
          style: TextStyle(
            fontSize: screenWidth * 0.06, // responsive
            fontWeight: FontWeight.w800,
            color: const Color(0xFF212121),
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
        padding: EdgeInsets.all(screenWidth * 0.04),
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
                    padding: EdgeInsets.all(screenWidth * 0.05),
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Blood Bank Information',
                            style: TextStyle(
                              fontSize: screenWidth * 0.05,
                              fontWeight: FontWeight.w700,
                              color: const Color(0xFF212121),
                            ),
                          ),
                          Container(
                            margin: EdgeInsets.only(
                                top: screenHeight * 0.008,
                                bottom: screenHeight * 0.02),
                            height: 3,
                            width: screenWidth * 0.15,
                            color: const Color(0xFFD32F2F),
                          ),

                          _buildDetailRow(
                            icon: Icons.local_hospital,
                            label: 'Name',
                            value: bloodData['name'] ?? 'N/A',
                          ),
                          SizedBox(height: screenHeight * 0.02),

                          _buildDetailRow(
                            icon: Icons.phone,
                            label: 'Contact Number',
                            value: bloodData['contactNumber']?.toString() ?? 'N/A',
                          ),
                          SizedBox(height: screenHeight * 0.02),

                          _buildDetailRow(
                            icon: Icons.location_on,
                            label: 'Address',
                            value: bloodData['address'] ?? 'N/A',
                            maxLines: 2,
                          ),
                          SizedBox(height: screenHeight * 0.02),

                          _buildDetailRow(
                            icon: Icons.water_drop,
                            label: 'Available Blood Groups',
                            value: bloodGroupsText,
                          ),
                          SizedBox(height: screenHeight * 0.02),

                          _buildDetailRow(
                            icon: Icons.format_list_numbered,
                            label: 'Available Units (Searched)',
                            value: _formatSearchedUnit(bloodData),
                          ),
                          SizedBox(height: screenHeight * 0.02),

                          _buildDetailRow(
                            icon: Icons.check_circle_outline,
                            label: 'Compatible Units',
                            value: _formatCompatibleUnits(bloodData),
                            maxLines: 3,
                          ),
                          SizedBox(height: screenHeight * 0.02),

                          _buildMapLinksSection(context),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),

            SizedBox(height: screenHeight * 0.02),

            Container(
              margin: EdgeInsets.only(bottom: screenHeight * 0.02),
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
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => AddOrderScreen(
                        bloodBank: bloodData,
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
                  padding: EdgeInsets.symmetric(
                      vertical: screenHeight * 0.02),
                  minimumSize: Size(double.infinity, screenHeight * 0.07),
                ),
                child: Text(
                  'Request Blood',
                  style: TextStyle(
                    fontSize: screenWidth * 0.045,
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
  Widget _buildMapLinksSection(BuildContext context) {
    final directionLinks = bloodData['directionLinks'] ?? {};
    final googleMapsUrl = directionLinks['googleMapsUrl'] ?? '';
    final appleMapsUrl = directionLinks['appleMapsUrl'] ?? '';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildDetailRow(
          icon: Icons.directions, // Icon before "Get Directions"
          label: 'Get Directions',
          value: 'Get the blood bank location by clicking the buttons.', // Empty value since it's a heading
          maxLines: 2,
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 16,
          runSpacing: 12,
          children: [
            _buildMapButton(
              label: 'Google Maps',
              icon: Icons.map,
              url: googleMapsUrl,
              gradientColors: [Color(0xFF4285F4), Color(0xFF34A853)], // Google colors
            ),
            _buildMapButton(
              label: 'Apple Maps',
              icon: Icons.map_outlined,
              url: appleMapsUrl,
              gradientColors: [Color(0xFF000000), Color(0xFF555555)], // Sleek gray
            ),
          ],
        ),
      ],
    );
  }
  String _formatSearchedUnit(Map<String, dynamic> data) {
    final searched = data['availableUnits']?['searched'];
    if (searched != null && searched is Map) {
      final bloodGroup = searched['bloodGroup'] ?? 'Unknown';
      final units = searched['units'] ?? 0;
      return '$bloodGroup ($units)';
    }
    return 'N/A';
  }

  String _formatCompatibleUnits(Map<String, dynamic> data) {
    final compatibleList = data['availableUnits']?['compatible'];
    if (compatibleList != null && compatibleList is List) {
      return compatibleList.map((e) {
        final bloodGroup = e['bloodGroup'] ?? 'Unknown';
        final units = e['units'] ?? 0;
        return '$bloodGroup ($units)';
      }).join(', ');
    }
    return 'N/A';
  }


  Widget _buildMapButton({
    required String label,
    required IconData icon,
    required String url,
    required List<Color> gradientColors,
  }) {
    return GestureDetector(
      onTap: () async {
        if (await canLaunchUrl(Uri.parse(url))) {
          await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
        } else {
          debugPrint('Could not launch $url');
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: gradientColors,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: gradientColors.first.withOpacity(0.4),
              blurRadius: 6,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: Colors.white,
              size: 20,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w700,
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
