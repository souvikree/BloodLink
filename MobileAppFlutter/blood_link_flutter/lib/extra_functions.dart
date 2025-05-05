import 'package:blood_link_flutter/widgets/custom_animated_dialog.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:flutter/material.dart';
Map<String, int> countBloodGroupType(Map<String, dynamic>? bloodBankSent) {
  final bloodGroupsData = bloodBankSent?['bloodGroups'] as List<dynamic>? ?? [];

  final Map<String, int> bloodGroupUnitMap = {};

  for (var item in bloodGroupsData) {
    final mapItem = item as Map<String, dynamic>;
    final group = mapItem['bloodGroup'] ?? 'N/A';
    final units = (mapItem['units'] ?? 0) as num;

    bloodGroupUnitMap[group] = (bloodGroupUnitMap[group] ?? 0) + units.toInt();
  }

  return bloodGroupUnitMap;
}

int totalBloodBankUnit(Map<String, dynamic> bankData) {
  final availableUnits = bankData['availableUnits'];
  int totalUnits = 0;

  if (availableUnits != null && availableUnits is Map) {
    availableUnits.forEach((key, value) {
      if (value is int) {
        totalUnits += value;
      } else if (value is Map && value.containsKey('units')) {
        // Safely convert units to int
        final units = value['units'];
        if (units is int) {
          totalUnits += units;
        } else if (units is double) {
          totalUnits += units.toInt(); // convert double to int
        }
      }
    });
  }

  return totalUnits;
}

LatLng extractLatLng(Map<String, dynamic> locationData) {
  List coords = locationData['coordinates'];
  double lng = coords[0]; // Longitude
  double lat = coords[1]; // Latitude

  return LatLng(lat, lng);
}




void showCustomDialog({
  required BuildContext context,
  required String title,
  required String message,
  required String buttonText,
  IconData icon=Icons.check_circle, // Optional icon for customization
  VoidCallback? onButtonPressed,
  bool barrierDismissible = true,
}) {
  showGeneralDialog(
    context: context,
    barrierDismissible: true,
    barrierLabel: "Dismiss",
    pageBuilder: (_, __, ___) => const SizedBox.shrink(),
    transitionBuilder: (_, anim, __, child) {
      return Transform.scale(
        scale: anim.value,
        child: AnimatedDialog(
          title: title,
          message: message,
          buttonText: "Okay",
          icon: icon,
        ),
      );
    },
    transitionDuration: const Duration(milliseconds: 300),
  );

}