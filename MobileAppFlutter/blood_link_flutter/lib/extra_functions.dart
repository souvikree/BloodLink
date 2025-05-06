import 'package:blood_link_flutter/widgets/custom_animated_dialog.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart';
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
  IconData icon = Icons.check_circle,
  VoidCallback? onButtonPressed,
  bool barrierDismissible = true,
}) {
  showGeneralDialog(
    context: context,
    barrierDismissible: barrierDismissible,
    barrierLabel: "Dismiss",
    pageBuilder: (_, __, ___) => const SizedBox.shrink(),
    transitionBuilder: (_, anim, __, child) {
      final curvedValue = Curves.easeOutBack.transform(anim.value);
      return Opacity(
        opacity: anim.value,
        child: Transform.scale(
          scale: curvedValue,
          child: AnimatedDialog(
            title: title,
            message: message,
            buttonText: buttonText,
            icon: icon,
          ),
        ),
      );
    },
    transitionDuration: const Duration(milliseconds: 400), // slightly longer for smoother feel
  );
}



Future<String> latLngToAddress(double latitude, double longitude) async {
  try {
    List<Placemark> placemarks = await placemarkFromCoordinates(latitude, longitude);
    if (placemarks.isNotEmpty) {
      final placemark = placemarks.first;
      return "${placemark.name}, ${placemark.locality}, ${placemark.administrativeArea}, ${placemark.country}";
    } else {
      return "No address found";
    }
  } catch (e) {
    return "Error: ${e.toString()}";
  }
}
