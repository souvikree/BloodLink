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
