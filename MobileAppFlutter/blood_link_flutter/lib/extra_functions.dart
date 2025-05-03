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