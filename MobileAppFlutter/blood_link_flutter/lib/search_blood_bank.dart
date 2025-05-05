import 'package:blood_link_flutter/provider/blood_bank_fetch_provider.dart';
import 'package:blood_link_flutter/widgets/blood_bank_item.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SearchBloodBank extends StatelessWidget {
  final bool formAddOrder;

  const SearchBloodBank({super.key, this.formAddOrder = false});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
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
            color: Color(0xFFD32F2F),
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
      body: RefreshIndicator(
        onRefresh: () => context.read<BloodBankFetchProvider>().fetchNearbyBloodBanks(),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Dropdown for blood group selection
              _buildBloodGroupDropdown(context),
              const SizedBox(height: 20),
              // Blood banks list or loading/error state
              Expanded(child: _buildBloodBanksList(context)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBloodGroupDropdown(BuildContext context) {
    return Selector<BloodBankFetchProvider, (String?, List<String>)>(
      selector: (_, provider) => (provider.selectedBloodGroup, provider.bloodGroups),
      builder: (_, data, __) {
        final selectedBloodGroup = data.$1;
        final bloodGroups = data.$2;

        return Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFD32F2F).withOpacity(0.3)),
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
              contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
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
            onChanged: (value) => context.read<BloodBankFetchProvider>().onBloodGroupChanged(value),
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
        );
      },
    );
  }

  Widget _buildBloodBanksList(BuildContext context) {
    return Selector<BloodBankFetchProvider, (bool, String?, List<dynamic>)>(
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
                    backgroundColor: const Color(0xFFD32F2F),
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
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 3 / 4,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemCount: bloodBanks.length,
          itemBuilder: (context, index) {
            final bankData = bloodBanks[index];
            return BloodBankCard(
              bankData: bankData,
              index: index,
              formAddOrder: formAddOrder,
            );
          },
        );
      },
    );
  }
}