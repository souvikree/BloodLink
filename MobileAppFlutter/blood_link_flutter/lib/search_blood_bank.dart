import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

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
  TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchBloodBanks();
    searchController.addListener(_onSearchChanged);
  }

  void _onSearchChanged() {
    final query = searchController.text.toLowerCase();
    setState(() {
      filteredBanks = bloodBanks.where((bank) {
        final bankInfo = bank['bloodBankId'];
        return bankInfo != null &&
            (bankInfo['name']?.toLowerCase().contains(query) ??
                false || bankInfo['address']?.toLowerCase().contains(query) ??
                false);
      }).toList();
    });
  }

  Future<void> fetchBloodBanks() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final authDone = prefs.getString('authToken');
      final response = await http.get(
        Uri.parse(
          'https://bloodlink-flsd.onrender.com/api/patients/search-banks?bloodGroup=O+',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authDone',
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
    searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: fetchBloodBanks,
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
              // Search Bar
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
                child: TextField(
                  controller: searchController,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(
                      Icons.search,
                      color: Color(0xFFD32F2F),
                    ),
                    hintText: "Search blood banks by name or address...",
                    hintStyle: TextStyle(color: Colors.grey[500]),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  style: const TextStyle(fontSize: 16, color: Color(0xFF212121)),
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
                                              builder: (context) =>
                                                  BloodBankDetails(
                                                      bloodData: bankData)));
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
                                                                  bloodBank:
                                                                      bankData,
                                                                )));
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
