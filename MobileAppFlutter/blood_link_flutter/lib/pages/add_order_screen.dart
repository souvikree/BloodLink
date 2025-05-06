import 'package:blood_link_flutter/blood_bank_details.dart';
import 'package:blood_link_flutter/provider/add_blood_order_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../extra_functions.dart';
import '../google_map_picker.dart';

class AddOrderScreen extends StatelessWidget {
  final Map<String, dynamic>? bloodBank;
  static final _formKey = GlobalKey<FormState>();

  const AddOrderScreen({super.key, this.bloodBank});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => BloodOrderProvider(bloodBank),
      child: Consumer<BloodOrderProvider>(
        builder: (context, provider, _) {
          // Build blood group chips
          Widget buildBloodGroupChips() {
            if (provider.selectedBloodBank == null ||
                provider.selectedBloodBank!['availableUnits'] == null) {
              return const SizedBox.shrink();
            }
            final availableUnits =
                provider.selectedBloodBank!['availableUnits'];
            List<Widget> chips = [];

            // Searched blood group
            if (availableUnits['searched'] != null) {
              final searched = availableUnits['searched'];
              final bloodGroup = searched['bloodGroup'] as String?;
              final units = (searched['units'] as num?)?.toInt() ?? 0;
              if (bloodGroup != null) {
                chips.add(
                  GestureDetector(
                    onTap: () => provider.setBloodGroup(bloodGroup),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: provider.selectedBloodGroup == bloodGroup
                            ? const Color(0xFFDC2626).withOpacity(0.3)
                            : const Color(0xFFDC2626).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: provider.selectedBloodGroup == bloodGroup
                              ? const Color(0xFFDC2626)
                              : Colors.transparent,
                        ),
                      ),
                      child: Text(
                        '$bloodGroup ($units)',
                        style: TextStyle(
                          color: provider.selectedBloodGroup == bloodGroup
                              ? const Color(0xFFDC2626)
                              : const Color(0xFFDC2626).withOpacity(0.8),
                          fontWeight: FontWeight.w600,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                );
              }
            }

            // Compatible blood groups
            if (availableUnits['compatible'] != null &&
                availableUnits['compatible'] is List) {
              for (var group in availableUnits['compatible']) {
                final bloodGroup = group['bloodGroup'] as String?;
                final units = (group['units'] as num?)?.toInt() ?? 0;
                if (bloodGroup != null) {
                  chips.add(
                    GestureDetector(
                      onTap: () => provider.setBloodGroup(bloodGroup),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: provider.selectedBloodGroup == bloodGroup
                              ? const Color(0xFFDC2626).withOpacity(0.3)
                              : const Color(0xFFDC2626).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: provider.selectedBloodGroup == bloodGroup
                                ? const Color(0xFFDC2626)
                                : Colors.transparent,
                          ),
                        ),
                        child: Text(
                          '$bloodGroup ($units)',
                          style: TextStyle(
                            color: provider.selectedBloodGroup == bloodGroup
                                ? const Color(0xFFDC2626)
                                : const Color(0xFFDC2626).withOpacity(0.8),
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ),
                  );
                }
              }
            }

            return Wrap(spacing: 8, runSpacing: 8, children: chips);
          }

          final totalUnits = provider.calculateTotalUnits();

          return Scaffold(
            backgroundColor: Colors.grey[100],
            appBar: AppBar(
              title: const Text(
                'Place Blood Order',
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
                icon: const Icon(Icons.arrow_back, color: Color(0xFFD32F2F)),
                onPressed: () => Navigator.pop(context),
              ),
              bottom: PreferredSize(
                preferredSize: const Size.fromHeight(1),
                child: Container(color: Colors.grey[200], height: 1),
              ),
            ),
            body: provider.isLoading
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(
                          color: const Color(0xFFD32F2F),
                          strokeWidth: 3,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Submitting Order...',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  )
                : Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Form(
                      key: _formKey,
                      child: ListView(
                        children: [
                          // Error Message
                          if (provider.errorMessage != null)
                            Container(
                              margin: const EdgeInsets.only(bottom: 16),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: const Color(0xFFD32F2F).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(10),
                                border:
                                    Border.all(color: const Color(0xFFD32F2F)),
                              ),
                              child: Text(
                                provider.errorMessage!,
                                style: const TextStyle(
                                  color: Color(0xFFD32F2F),
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          // Blood Bank Selection
                          AnimatedOpacity(
                            opacity: 1.0,
                            duration: const Duration(milliseconds: 300),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [
                                        Color(0xFFD32F2F),
                                        Color(0xFFB71C1C)
                                      ],
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: const Color(0xFFDC2626)
                                            .withOpacity(0.3),
                                        blurRadius: 6,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: ElevatedButton(
                                    onPressed: () =>
                                        provider.selectBloodBank(context),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.transparent,
                                      shadowColor: Colors.transparent,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 16,
                                        horizontal: 24,
                                      ),
                                      minimumSize:
                                          const Size(double.infinity, 50),
                                    ),
                                    child: Text(
                                      provider.selectedBloodBank == null
                                          ? 'Select Blood Bank'
                                          : 'Change Blood Bank',
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ),
                                if (provider.selectedBloodBank != null)
                                  InkWell(
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) =>
                                              BloodBankDetails(
                                            bloodData:
                                                provider.selectedBloodBank!,
                                          ),
                                        ),
                                      );
                                    },
                                    child: Container(
                                      margin: const EdgeInsets.only(top: 12),
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(
                                          color: const Color(0xFFDC2626)
                                              .withOpacity(0.3),
                                        ),
                                        boxShadow: [
                                          BoxShadow(
                                            color:
                                                Colors.black.withOpacity(0.05),
                                            blurRadius: 6,
                                            offset: const Offset(0, 2),
                                          ),
                                        ],
                                      ),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            provider.selectedBloodBank![
                                                    'name'] ??
                                                'Unnamed Bank',
                                            style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.w700,
                                              color: Color(0xFF212121),
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            provider.selectedBloodBank![
                                                    'address'] ??
                                                'No address',
                                            style: TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.w500,
                                              color: Colors.grey[600],
                                            ),
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            'Total Units: $totalUnits',
                                            style: const TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w600,
                                              color: Color(0xFFDC2626),
                                            ),
                                          ),
                                          const SizedBox(height: 12),
                                          buildBloodGroupChips(),
                                        ],
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                          // Blood Group Dropdown
                          AnimatedOpacity(
                            opacity: 1.0,
                            duration: const Duration(milliseconds: 400),
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color:
                                      const Color(0xFFD32F2F).withOpacity(0.3),
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 6,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: DropdownButtonFormField<String>(
                                value: provider.selectedBloodGroup,
                                items: provider.bloodGroups
                                    .map((group) => DropdownMenuItem(
                                          value: group,
                                          child: Text(
                                            group,
                                            style: const TextStyle(
                                              fontSize: 16,
                                              color: Color(0xFF212121),
                                            ),
                                          ),
                                        ))
                                    .toList(),
                                onChanged: (value) =>
                                    provider.setBloodGroup(value),
                                decoration: InputDecoration(
                                  labelText: 'Blood Type',
                                  labelStyle: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 16,
                                  ),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide.none,
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 14,
                                  ),
                                ),
                                validator: (value) => value == null
                                    ? 'Please select a blood type'
                                    : null,
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          // Quantity Field
                          AnimatedOpacity(
                            opacity: 1.0,
                            duration: const Duration(milliseconds: 500),
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color:
                                      const Color(0xFFD32F2F).withOpacity(0.3),
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 6,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: TextFormField(
                                controller: provider.quantityController,
                                keyboardType: TextInputType.number,
                                decoration: InputDecoration(
                                  labelText: 'Quantity (Units)',
                                  labelStyle: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 16,
                                  ),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide.none,
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 14,
                                  ),
                                ),
                                style: const TextStyle(
                                  fontSize: 16,
                                  color: Color(0xFF212121),
                                ),
                                validator: (value) => value!.isEmpty
                                    ? 'Please enter quantity'
                                    : null,
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          // Delivery Address Field
                          AnimatedOpacity(
                            opacity: 1.0,
                            duration: const Duration(milliseconds: 600),
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color:
                                      const Color(0xFFD32F2F).withOpacity(0.3),
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 6,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Selector<BloodOrderProvider, bool>(
                                selector: (_, provider) =>
                                    provider.isCurrentLocationLoading,
                                builder: (context, isAddressLoading, child) {
                                  return TextFormField(
                                    controller: provider.addressController,
                                    decoration: InputDecoration(
                                      labelText: 'Delivery Address',
                                      labelStyle: TextStyle(
                                        color: Colors.grey[600],
                                        fontSize: 16,
                                      ),
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: BorderSide.none,
                                      ),
                                      contentPadding:
                                          const EdgeInsets.symmetric(
                                        horizontal: 16,
                                        vertical: 14,
                                      ),
                                      prefixIcon: isAddressLoading
                                          ? Padding(
                                              padding:
                                                  const EdgeInsets.all(12.0),
                                              child: SizedBox(
                                                width: 24,
                                                height: 24,
                                                child:
                                                    CircularProgressIndicator(
                                                  strokeWidth: 2.5,
                                                  valueColor:
                                                      AlwaysStoppedAnimation<
                                                              Color>(
                                                          Color(0xFFD32F2F)),
                                                ),
                                              ),
                                            )
                                          : Icon(
                                              Icons.location_on,
                                              color: Color(0xFFD32F2F),
                                            ),
                                      // show loading (you might want to control visibility)
                                      suffixIcon: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          IconButton(
                                            icon: const Icon(
                                              Icons.my_location,
                                              color: Color(0xFFD32F2F),
                                            ),
                                            onPressed: () => provider
                                                .fetchCurrentAddress(context),
                                          ),
                                          IconButton(
                                            icon: const Icon(
                                              Icons.map,
                                              color: Color(0xFFD32F2F),
                                            ),
                                            onPressed: () async {
                                              if (provider.selectedBloodBank !=
                                                  null) {
                                                final result =
                                                    await Navigator.push(
                                                  context,
                                                  MaterialPageRoute(
                                                    builder: (context) =>
                                                        MapPickerPage(
                                                      bloodBankLocation:
                                                          extractLatLng(provider
                                                                  .selectedBloodBank![
                                                              'location']),
                                                    ),
                                                  ),
                                                );
                                                if (result != null &&
                                                    result is Map &&
                                                    result['address'] != null) {
                                                  provider.addressController
                                                          .text =
                                                      result['address']
                                                          as String;
                                                }
                                              } else {
                                                showCustomDialog(
                                                    context: context,
                                                    title:
                                                        'please select blood bank',
                                                    message:
                                                        'Choose a blood bank to easily view its location on the map.',
                                                    buttonText: 'Okay');
                                              }
                                            },
                                          ),
                                        ],
                                      ),
                                    ),
                                    style: const TextStyle(
                                      fontSize: 16,
                                      color: Color(0xFF212121),
                                    ),
                                    validator: (value) => value!.isEmpty
                                        ? 'Please enter delivery address'
                                        : null,
                                  );
                                },
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                          // Prescription Upload
                          AnimatedOpacity(
                            opacity: 1.0,
                            duration: const Duration(milliseconds: 700),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Container(
                                    decoration: BoxDecoration(
                                      gradient: const LinearGradient(
                                        colors: [
                                          Color(0xFFD32F2F),
                                          Color(0xFFB71C1C)
                                        ],
                                        begin: Alignment.topCenter,
                                        end: Alignment.bottomCenter,
                                      ),
                                      borderRadius: BorderRadius.circular(12),
                                      boxShadow: [
                                        BoxShadow(
                                          color: const Color(0xFFD32F2F)
                                              .withOpacity(0.3),
                                          blurRadius: 6,
                                          offset: const Offset(0, 2),
                                        ),
                                      ],
                                    ),
                                    child: ElevatedButton(
                                      onPressed: provider.pickImage,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.transparent,
                                        shadowColor: Colors.transparent,
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(12),
                                        ),
                                        padding: const EdgeInsets.symmetric(
                                          vertical: 16,
                                          horizontal: 24,
                                        ),
                                      ),
                                      child: Text(
                                        provider.prescriptionImage == null
                                            ? 'Upload Prescription'
                                            : 'Change Prescription',
                                        style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                if (provider.prescriptionImage != null)
                                  Padding(
                                    padding: const EdgeInsets.only(left: 12),
                                    child: Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        shape: BoxShape.circle,
                                        boxShadow: [
                                          BoxShadow(
                                            color:
                                                Colors.black.withOpacity(0.1),
                                            blurRadius: 4,
                                            offset: const Offset(0, 2),
                                          ),
                                        ],
                                      ),
                                      child: const Icon(
                                        Icons.check,
                                        color: Color(0xFF4CAF50),
                                        size: 24,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          if (provider.prescriptionImage != null)
                            AnimatedOpacity(
                              opacity: 1.0,
                              duration: const Duration(milliseconds: 800),
                              child: Container(
                                margin: const EdgeInsets.only(top: 12),
                                height: 100,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: const Color(0xFFD32F2F)
                                        .withOpacity(0.3),
                                  ),
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: Image.file(
                                    provider.prescriptionImage!,
                                    fit: BoxFit.cover,
                                    width: double.infinity,
                                  ),
                                ),
                              ),
                            ),
                          const SizedBox(height: 24),
                          // Submit Button
                          AnimatedOpacity(
                            opacity: 1.0,
                            duration: const Duration(milliseconds: 900),
                            child: Container(
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [
                                    Color(0xFFD32F2F),
                                    Color(0xFFB71C1C)
                                  ],
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                ),
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFFD32F2F)
                                        .withOpacity(0.3),
                                    blurRadius: 6,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: ElevatedButton(
                                onPressed: () =>
                                    provider.submitOrder(context, _formKey),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.transparent,
                                  shadowColor: Colors.transparent,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 16,
                                    horizontal: 24,
                                  ),
                                  minimumSize: const Size(double.infinity, 50),
                                ),
                                child: const Text(
                                  'Submit Order',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
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
          );
        },
      ),
    );
  }
}
