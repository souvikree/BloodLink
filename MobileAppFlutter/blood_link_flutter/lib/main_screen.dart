import 'package:flutter/material.dart';
import 'package:curved_labeled_navigation_bar/curved_navigation_bar.dart';
import 'package:curved_labeled_navigation_bar/curved_navigation_bar_item.dart';

import 'home_screen.dart';
import 'appointment_screen.dart';
import 'profile_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  final PageController _pageController = PageController();

  final List<Widget> _pages = const [
    HomeScreen(),
    AppointmentScreen(),
    ProfileScreen(),
  ];

  void _onTap(int index) {
    setState(() {
      _currentIndex = index;
      _pageController.jumpToPage(index);
    });
  }

  void _onPageChanged(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: PageView(
          controller: _pageController,
          onPageChanged: _onPageChanged,
          children: _pages,
        ),
      ),
      bottomNavigationBar: CurvedNavigationBar(
        index: _currentIndex,
        color: const Color(0xFFDC2626), // Red for blood bank theme
        backgroundColor: Colors.grey[100]!, // Soft grey background
        items: [
          CurvedNavigationBarItem(
            child: const Icon(Icons.home, color: Colors.white), // White icons
            label: 'Home',
            labelStyle: const TextStyle(
              fontSize: 12,
              color: Colors.white, // White labels
              fontWeight: FontWeight.w500,
            ),
          ),
          CurvedNavigationBarItem(
            child: const Icon(Icons.calendar_month, color: Colors.white),
            label: 'Orders',
            labelStyle: const TextStyle(
              fontSize: 12,
              color: Colors.white,
              fontWeight: FontWeight.w500,
            ),
          ),
          CurvedNavigationBarItem(
            child: const Icon(Icons.person, color: Colors.white),
            label: 'Profile',
            labelStyle: const TextStyle(
              fontSize: 12,
              color: Colors.white,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
        onTap: _onTap,
        animationDuration: const Duration(milliseconds: 300),
        animationCurve: Curves.easeInOut,
      ),
    );
  }
}