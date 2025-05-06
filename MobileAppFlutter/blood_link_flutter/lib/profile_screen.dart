import 'package:animate_do/animate_do.dart';
import 'package:blood_link_flutter/provider/profile_provider.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import 'edit_profile.dart';
import 'extra_functions.dart';

class ProfileScreen extends StatelessWidget {
  ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: _lightTheme,
      child: Scaffold(
        body: CustomScrollView(
          slivers: [
            _buildSliverAppBar(context),
            SliverToBoxAdapter(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.white, Colors.grey.shade50],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: Consumer<ProfileProvider>(
                  builder: (context, provider, _) {
                    if (provider.isLoading) {
                      return const Center(
                        child:
                            CircularProgressIndicator(color: Colors.redAccent),
                      );
                    }
                    if (provider.errorMessage != null) {
                      return _buildErrorState(context, provider);
                    }
                    return _buildProfileView(provider.profileData);
                  },
                ),
              ),
            ),
          ],
        ),
        floatingActionButton: Consumer<ProfileProvider>(
          builder: (context, provider, _) => FadeInUp(
            duration: const Duration(milliseconds: 500),
            child: FloatingActionButton.extended(
              onPressed: provider.profileData != null
                  ? () => _onEditProfile(context, provider.profileData!)
                  : null,
              label: const Text(
                'Edit Profile',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              icon: const Icon(Icons.edit),
              backgroundColor:
                  provider.profileData != null ? Colors.redAccent : Colors.grey,
              elevation: 8,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSliverAppBar(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 240,
      floating: false,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        title: const Text(
          'My Profile',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 24,
            color: Colors.white,
            shadows: [
              Shadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 2))
            ],
          ),
        ),
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.redAccent, Colors.red],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Stack(
            children: [
              Positioned.fill(
                child: Container(
                  color: Colors.white.withOpacity(0.1),
                  child: CustomPaint(painter: _BackgroundPatternPainter()),
                ),
              ),
            ],
          ),
        ),
      ),
      actions: [
        Consumer<ProfileProvider>(
          builder: (context, provider, _) => IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => provider.logout(context),
            tooltip: 'Logout',
            color: Colors.white,
          ),
        ),
      ],
    );
  }

  Widget _buildErrorState(BuildContext context, ProfileProvider provider) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FadeIn(
              duration: const Duration(milliseconds: 600),
              child: Text(
                provider.errorMessage ?? 'An unexpected error occurred.',
                style: const TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => provider.fetchProfile(),
              icon: const Icon(Icons.refresh),
              label: const Text(
                'Retry',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.redAccent,
                foregroundColor: Colors.white,
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 4,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileView(Map<String, dynamic>? profileData) {
    final name = profileData?['name']?.toString() ?? 'User';
    final initials = name.isNotEmpty ? name[0].toUpperCase() : 'U';

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          FadeInUp(
            duration: const Duration(milliseconds: 600),
            child: CircleAvatar(
              radius: 80,
              backgroundColor: Colors.redAccent.withOpacity(0.95),
              child: Text(
                initials,
                style: const TextStyle(
                  fontSize: 60,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          FadeInUp(
            duration: const Duration(milliseconds: 700),
            child: Text(
              name,
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.redAccent,
              ),
            ),
          ),
          const SizedBox(height: 8),
          FadeInUp(
            duration: const Duration(milliseconds: 800),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  profileData?['isVerified'] == true
                      ? Icons.verified
                      : Icons.verified_outlined,
                  color: profileData?['isVerified'] == true
                      ? Colors.green
                      : Colors.grey,
                  size: 24,
                ),
                const SizedBox(width: 8),
                Text(
                  profileData?['isVerified'] == true
                      ? 'Verified Donor'
                      : 'Not Verified',
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.black87,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          _buildDetailCard(profileData),
        ],
      ),
    );
  }

  Widget _buildDetailCard(Map<String, dynamic>? profileData) {
    return FadeInUp(
        duration: const Duration(milliseconds: 900),
        child: Card(
          elevation: 8,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          margin: const EdgeInsets.symmetric(vertical: 8),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                _buildProfileItem(
                  icon: Icons.bloodtype,
                  title: 'Blood Group',
                  subtitle: profileData?['bloodGroup']?.toString() ?? 'N/A',
                ),
                _buildProfileItem(
                  icon: Icons.phone,
                  title: 'Mobile',
                  subtitle: profileData?['mobile']?.toString() ?? 'N/A',
                ),
                FutureBuilder<String>(
                    future: latLngToAddress(
                      profileData?['location']['coordinates'][1], // latitude
                      profileData?['location']['coordinates'][0], // longitude
                    ),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return _buildProfileItem(
                            icon: Icons.location_on,
                            title: 'Location',
                            subtitle: 'Loading....');
                      } else if (snapshot.hasError) {
                        return _buildProfileItem(
                            icon: Icons.location_on,
                            title: 'Location',
                            subtitle: 'NA');
                      }
                      return _buildProfileItem(
                          icon: Icons.location_on,
                          title: 'Location',
                          subtitle: snapshot.data!);
                    }),
                _buildProfileItem(
                  icon: Icons.calendar_today,
                  title: 'Joined On',
                  subtitle: _formatDate(profileData?['createdAt']),
                ),
                _buildProfileItem(
                  icon: Icons.update,
                  title: 'Last Updated',
                  subtitle: _formatDate(profileData?['updatedAt']),
                ),
                _buildProfileItem(
                  icon: Icons.perm_identity,
                  title: 'Profile ID',
                  subtitle: profileData?['_id']?.toString() ?? 'N/A',
                ),
                _buildProfileItem(
                  icon: Icons.info,
                  title: 'Version',
                  subtitle: profileData?['__v']?.toString() ?? 'N/A',
                ),
              ],
            ),
          ),
        ));
  }

  String _formatDate(String? isoDate) {
    if (isoDate == null) return 'N/A';
    try {
      final date = DateTime.parse(isoDate).toLocal();
      return DateFormat('dd MMM yyyy, HH:mm').format(date);
    } catch (e) {
      return 'N/A';
    }
  }

  Widget _buildProfileItem({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.redAccent.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.redAccent, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _onEditProfile(BuildContext context, Map<String, dynamic> profileData) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => EditProfileScreen(profileData: profileData),
      ),
    ).then((_) => context.read<ProfileProvider>().fetchProfile());
  }

  final ThemeData _lightTheme = ThemeData.light().copyWith(
    scaffoldBackgroundColor: Colors.white,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      titleTextStyle: TextStyle(
        color: Colors.white,
        fontWeight: FontWeight.bold,
        fontSize: 24,
      ),
      iconTheme: IconThemeData(color: Colors.white),
    ),
    cardColor: Colors.white,
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: Colors.redAccent,
      foregroundColor: Colors.white,
    ),
    textTheme: const TextTheme(
      bodyMedium: TextStyle(color: Colors.black87),
      titleLarge: TextStyle(
        fontWeight: FontWeight.bold,
        color: Colors.black87,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.redAccent,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),
    progressIndicatorTheme: const ProgressIndicatorThemeData(
      color: Colors.redAccent,
    ),
  );
}

class _BackgroundPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.2)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    for (double i = 0; i < size.width; i += 20) {
      for (double j = 0; j < size.height; j += 20) {
        canvas.drawCircle(Offset(i, j), 2, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
