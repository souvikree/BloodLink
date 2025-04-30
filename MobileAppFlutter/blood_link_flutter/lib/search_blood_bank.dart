import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:geolocator/geolocator.dart';
import 'add_order_screen.dart';
import 'blood_bank_details.dart';

class SearchBloodBank extends StatefulWidget {
  final bool formAddOrder;

  const SearchBloodBank({super.key, this.formAddOrder = false});

  @override
  State<SearchBloodBank> createState() => _SearchBloodBankState();
}

class _SearchBloodBankState extends State<SearchBloodBank> {
  List<dynamic> bloodBanks = [];
  List<dynamic> filteredBanks = [];
  bool isLoading = true;
  String? selectedBloodGroup; // Store selected blood group

  // List of all standard blood groups
  final List<String> bloodGroups = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ];

  @override
  void initState() {
    super.initState();
    fetchNearbyBloodBanks();
  }

  void _onBloodGroupChanged(String? newValue) {
    setState(() {
      selectedBloodGroup = newValue;
      if (newValue != null) {
        // Fetch blood banks for the selected blood group
        fetchNearbyBloodBanks();
      } else {
        // If no blood group selected, show all banks or clear filtered list
        filteredBanks = bloodBanks;
      }
    });
  }

  Future<Position> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    // Check if location services are enabled
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return Future.error('Location services are disabled.');
    }

    // Check location permission
    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return Future.error(
          'Location permissions are permanently denied, we cannot request permissions.');
    }

    // If permission granted, get current position
    return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);
  }

  Future<void> fetchNearbyBloodBanks() async {
    setState(() {
      isLoading=true;
    });
    try {
      Position position = await _determinePosition();
      double lat = position.latitude;
      double long = position.longitude;

      debugPrint('User location: $lat, $long');

      // Fetch blood banks with the selected blood group
      await fetchBloodBanks(lat, long);
    } catch (e) {
      debugPrint('Error getting location: $e');
      setState(() => isLoading = false);
    }
  }

  Future<void> fetchBloodBanks(double latitude, double longitude) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final authToken = prefs.getString('authToken');

      // Use selectedBloodGroup, default to empty string if not selected
      final bloodGroup = selectedBloodGroup ?? '';
      final url = Uri.parse(
        'https://bloodlink-flsd.onrender.com/api/patients/search?bloodGroup=$bloodGroup&latitude=$latitude&longitude=$longitude',
      );

      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        debugPrint('Blood data $data');
        setState(() {
          bloodBanks = data;
          filteredBanks = data;
          isLoading = false;
        });
      } else {
        throw Exception("Failed to load blood banks");
      }
    } catch (e) {
      debugPrint('Error: $e');
      setState(() => isLoading = false);
    }
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: fetchNearbyBloodBanks,
      child: Scaffold(
        backgroundColor: Colors.grey[100], // Soft grey for healthcare
        appBar: AppBar(
          title: const Text(
            'Search Blood Banks',
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
              color: Color(0xFFD32F2F), // Red accent
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
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Blood Group Dropdown
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border:
                  Border.all(color: const Color(0xFFD32F2F).withOpacity(0.3)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: DropdownButtonFormField<String>(
                  value: selectedBloodGroup,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(
                      Icons.bloodtype,
                      color: Color(0xFFD32F2F),
                    ),
                    hintText: "Select blood group",
                    hintStyle: TextStyle(color: Colors.grey[500]),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                        vertical: 14, horizontal: 12),
                  ),
                  items: bloodGroups.map((String bloodGroup) {
                    return DropdownMenuItem<String>(
                      value: bloodGroup,
                      child: Text(
                        bloodGroup,
                        style: const TextStyle(
                          fontSize: 16,
                          color: Color(0xFF212121),
                        ),
                      ),
                    );
                  }).toList(),
                  onChanged: _onBloodGroupChanged,
                  style: const TextStyle(
                    fontSize: 16,
                    color: Color(0xFF212121),
                  ),
                  dropdownColor: Colors.white,
                  icon: const Icon(
                    Icons.arrow_drop_down,
                    color: Color(0xFFD32F2F),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              // Blood Banks Grid
              isLoading
                  ? Expanded(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircularProgressIndicator(
                        color: const Color(0xFFD32F2F),
                        strokeWidth: 3,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Loading Blood Banks...',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              )
                  : Expanded(
                child: filteredBanks.isEmpty
                    ? Center(
                  child: Text(
                    'No blood banks found',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[600],
                    ),
                  ),
                )
                    : GridView.builder(
                  gridDelegate:
                  const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 3 / 4,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: filteredBanks.length,
                  itemBuilder: (context, index) {
                    final bankData = filteredBanks[index];
                    final bank = bankData['bloodBankId'];
                    final quantity = bankData['quantity'];

                    return AnimatedOpacity(
                      opacity: 1.0,
                      duration:
                      Duration(milliseconds: 300 + (index * 100)),
                      child: InkWell(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => BloodBankDetails(
                                bloodData: bankData,
                              ),
                            ),
                          );
                        },
                        child: Card(
                          elevation: 5,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: const Color(0xFFD32F2F)
                                    .withOpacity(0.2),
                              ),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Column(
                                crossAxisAlignment:
                                CrossAxisAlignment.start,
                                children: [
                                  // Bank Name
                                  Text(
                                    bank?['name'] ?? 'Unnamed Bank',
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFF212121),
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 8),
                                  // Address
                                  Text(
                                    bank?['address'] ?? 'No address',
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500,
                                      color: Colors.grey[600],
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 8),
                                  // Units
                                  Text(
                                    'Units: ${quantity ?? 'N/A'}',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFFD32F2F),
                                    ),
                                  ),
                                  const Spacer(),
                                  // Request Button
                                  GestureDetector(
                                    onTap: () {
                                      if (widget.formAddOrder) {
                                        Navigator.pop(
                                            context, bankData);
                                      } else {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) =>
                                                AddOrderScreen(
                                                  bloodBank: bankData,
                                                ),
                                          ),
                                        );
                                      }
                                    },
                                    child: Container(
                                      width: double.infinity,
                                      decoration: BoxDecoration(
                                        gradient:
                                        const LinearGradient(
                                          colors: [
                                            Color(0xFFD32F2F),
                                            Color(0xFFB71C1C),
                                          ],
                                          begin: Alignment.topCenter,
                                          end: Alignment.bottomCenter,
                                        ),
                                        borderRadius:
                                        BorderRadius.circular(10),
                                        boxShadow: [
                                          BoxShadow(
                                            color: const Color(
                                                0xFFD32F2F)
                                                .withOpacity(0.3),
                                            blurRadius: 4,
                                            offset:
                                            const Offset(0, 2),
                                          ),
                                        ],
                                      ),
                                      child: ElevatedButton(
                                        onPressed: null,
                                        // Handled by GestureDetector
                                        style:
                                        ElevatedButton.styleFrom(
                                          backgroundColor:
                                          Colors.transparent,
                                          shadowColor:
                                          Colors.transparent,
                                          shape:
                                          RoundedRectangleBorder(
                                            borderRadius:
                                            BorderRadius.circular(
                                                10),
                                          ),
                                          padding: const EdgeInsets
                                              .symmetric(
                                              vertical: 12),
                                        ),
                                        child: const Text(
                                          'Request Blood',
                                          style: TextStyle(
                                            fontSize: 14,
                                            fontWeight:
                                            FontWeight.w600,
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
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}