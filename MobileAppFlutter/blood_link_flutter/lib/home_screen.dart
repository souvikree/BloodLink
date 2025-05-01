import 'dart:convert';
import 'package:blood_link_flutter/provider/blood_bank_fetch_provider.dart';
import 'package:blood_link_flutter/search_blood_bank.dart';
import 'package:blood_link_flutter/widgets/blood_bank_item.dart';
import 'package:blood_link_flutter/widgets/default_value.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            title: const Text(
              'BloodLink',
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.w800,
                color: Color(0xFF212121),
              ),
            ),
            actions: [
              IconButton(
                icon: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.chat_bubble,
                    color: Color(0xFFDC2626), // Updated red color
                    size: 20,
                  ),
                ),
                onPressed: () {},
                tooltip: 'Chat',
              ),
              IconButton(
                icon: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.notifications,
                    color: Color(0xFFDC2626), // Updated red color
                    size: 20,
                  ),
                ),
                onPressed: () {},
                tooltip: 'Notifications',
              ),
              const SizedBox(width: 10),
            ],
            backgroundColor: Colors.white,
            elevation: 0,
            shadowColor: Colors.black.withOpacity(0.2),
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(1),
              child: Container(
                color: Colors.grey[200],
                height: 1,
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Banner Carousel
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                      side: const BorderSide(
                        color: Color(0xFFDC2626), // Updated red color
                        width: 1,
                      ),
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: CarouselSlider(
                      options: CarouselOptions(
                        height: MediaQuery.of(context).size.width * 0.5,
                        autoPlay: true,
                        autoPlayInterval: const Duration(seconds: 3),
                        enlargeCenterPage: false,
                        viewportFraction: 1.0,
                      ),
                      items: carouselImages.map((imageUrl) {
                        return Image.network(
                          imageUrl,
                          fit: BoxFit.cover,
                          width: double.infinity,
                          errorBuilder: (context, error, stackTrace) => Container(
                            color: Colors.grey[200],
                            child: const Icon(
                              Icons.image_not_supported,
                              size: 50,
                              color: Colors.grey,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 25),
                  // Blood Banks Section
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Blood Banks',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF212121),
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const SearchBloodBank(),
                            ),
                          );
                        },
                        child: const Text(
                          'View All',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFFDC2626), // Updated red color
                          ),
                        ),
                      ),
                    ],
                  ),
                  Container(
                    margin: const EdgeInsets.only(top: 8, bottom: 15),
                    height: 3,
                    width: 60,
                    color: const Color(0xFFDC2626), // Updated red color
                  ),
                ],
              ),
            ),
          ),
          // Blood Banks Grid
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 15),
              child: Selector<BloodBankFetchProvider, (bool, String?, List<dynamic>)>(
                selector: (_, provider) => (
                provider.isLoading,
                provider.errorMessage,
                provider.bloodBanks,
                ),
                builder: (_, data, __) {
                  final isLoading = data.$1;
                  final errorMessage = data.$2;
                  final bloodBanks = data.$3;

                  if (isLoading) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CircularProgressIndicator(
                            color: const Color(0xFFDC2626), // Updated red color
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
                    );
                  }

                  if (errorMessage != null) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            errorMessage,
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Colors.red[600],
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: () => context.read<BloodBankFetchProvider>().fetchNearbyBloodBanks(),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFDC2626), // Updated red color
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: const Text(
                              'Retry',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }

                  if (bloodBanks.isEmpty) {
                    return Center(
                      child: Text(
                        'No blood banks found',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[600],
                        ),
                      ),
                    );
                  }

                  return GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 3 / 4,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: bloodBanks.length > 4 ? 4 : bloodBanks.length,
                    itemBuilder: (context, index) {
                      final bankData = bloodBanks[index];
                      return BloodBankCard(
                        bankData: bankData,
                        index: index,
                      );
                    },
                  );
                },
              ),
            ),
          ),
          const SliverToBoxAdapter(
            child: SizedBox(height: 20),
          ),
        ],
      ),
    );
  }
}