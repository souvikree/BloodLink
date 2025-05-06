import 'dart:async';

import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:google_place/google_place.dart';
import 'package:location/location.dart' as loc;
import 'package:uuid/uuid.dart';

class MapPickerPage extends StatefulWidget {
  final LatLng? bloodBankLocation;
  const MapPickerPage({super.key, this.bloodBankLocation});

  @override
  State<MapPickerPage> createState() => _MapPickerPageState();
}

class _MapPickerPageState extends State<MapPickerPage> {
  GoogleMapController? _mapController;
  LatLng _cameraPosition = const LatLng(22.5726, 88.3639);
  String? _pickedAddress;
  final _searchController = TextEditingController();
  late GooglePlace googlePlace;
  List<AutocompletePrediction> predictions = [];
  bool _locationPermissionGranted = false;
  Timer? _debounce;
  final Set<Marker> _markers = {};

  @override
  void initState() {
    super.initState();
    googlePlace = GooglePlace("AIzaSyA0nCJ162t8mURRz97uZjwY1BO7SxjrNTE");
    _initLocationAndMarkers();
  }

  Future<void> _initLocationAndMarkers() async {
    await _getUserLocation();
    _addBloodBankMarker();
  }

  Future<void> _getUserLocation() async {
    try {
      final location = loc.Location();
      bool serviceEnabled = await location.serviceEnabled();
      if (!serviceEnabled) {
        serviceEnabled = await location.requestService();
        if (!serviceEnabled) return;
      }

      var permission = await location.hasPermission();
      if (permission == loc.PermissionStatus.denied) {
        permission = await location.requestPermission();
        if (permission != loc.PermissionStatus.granted) return;
      }

      final currentLocation = await location.getLocation();
      final latLng = LatLng(currentLocation.latitude!, currentLocation.longitude!);

      setState(() {
        _locationPermissionGranted = true;
        _cameraPosition = latLng;
      });

      await _updatePickedAddress(latLng);
      _mapController?.animateCamera(CameraUpdate.newLatLngZoom(latLng, 16));
    } catch (_) {}
  }

  Future<void> _updatePickedAddress(LatLng position) async {
    try {
      final placemarks = await placemarkFromCoordinates(position.latitude, position.longitude);
      if (placemarks.isNotEmpty) {
        final p = placemarks.first;
        final address = [p.street, p.locality, p.administrativeArea, p.country]
            .where((e) => e != null && e.isNotEmpty)
            .join(', ');

        setState(() => _pickedAddress = address);
      }
    } catch (_) {}
  }

  void _searchPlace(String query) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 300), () async {
      if (query.isEmpty) return setState(() => predictions = []);
      final result = await googlePlace.autocomplete.get(
        query,
        sessionToken: const Uuid().v4(),
        components: [Component("country", "in")],
      );

      setState(() {
        predictions = result?.predictions ?? [];
      });
    });
  }

  Future<void> _selectPlace(String placeId) async {
    try {
      final details = await googlePlace.details.get(placeId);
      final locResult = details?.result?.geometry?.location;
      if (locResult != null) {
        final latLng = LatLng(locResult.lat!, locResult.lng!);

        setState(() {
          _cameraPosition = latLng;
          predictions = [];
          _searchController.clear();
        });

        await _updatePickedAddress(latLng);
        _mapController?.animateCamera(CameraUpdate.newLatLngZoom(latLng, 16));
      }
    } catch (_) {}
  }

  void _addBloodBankMarker() {
    if (widget.bloodBankLocation != null) {
      _markers.add(
        Marker(
          markerId: const MarkerId('blood_bank'),
          position: widget.bloodBankLocation!,
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
          infoWindow: const InfoWindow(title: 'Blood Bank'),
        ),
      );
      setState(() {});
    }
  }

  Future<void> _centerOnCurrentLocation() async {
    if (!_locationPermissionGranted) {
      await _getUserLocation();
      return;
    }
    final location = loc.Location();
    final currentLocation = await location.getLocation();
    final latLng = LatLng(currentLocation.latitude!, currentLocation.longitude!);
    _mapController?.animateCamera(CameraUpdate.newLatLngZoom(latLng, 16));
    await _updatePickedAddress(latLng);
  }

  Future<void> _centerOnBloodBank() async {
    if (widget.bloodBankLocation != null) {
      _mapController?.animateCamera(CameraUpdate.newLatLngZoom(widget.bloodBankLocation!, 16));
      await _updatePickedAddress(widget.bloodBankLocation!);
    }
  }

  @override
  void dispose() {
    _mapController?.dispose();
    _debounce?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(),
      body: Stack(
        children: [
          _buildGoogleMap(),
          _buildCenterPin(),
          _buildSearchBar(),
          if (_pickedAddress != null) _buildPickedAddress(),
          _buildFloatingButtons(),
        ],
      ),
      floatingActionButton: _buildConfirmButton(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }

  AppBar _buildAppBar() {
    return AppBar(
      title: const Text(
        'Select Location',
        style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
      ),
      flexibleSpace: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.red, Colors.redAccent],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
      ),
      elevation: 0,
    );
  }

  Widget _buildGoogleMap() {
    return GoogleMap(
      onMapCreated: (controller) => _mapController = controller,
      initialCameraPosition: CameraPosition(target: _cameraPosition, zoom: 14),
      onCameraMove: (position) => _cameraPosition = position.target,
      onCameraIdle: () => _updatePickedAddress(_cameraPosition),
      myLocationEnabled: _locationPermissionGranted,
      myLocationButtonEnabled: true,
      markers: _markers,
    );
  }

  Widget _buildCenterPin() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.only(bottom: 40),
        child: const Icon(Icons.location_pin, size: 50, color: Colors.blue),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Positioned(
      top: 20,
      left: 20,
      right: 20,
      child: Column(
        children: [
          Material(
            elevation: 8,
            borderRadius: BorderRadius.circular(12),
            child: TextField(
              controller: _searchController,
              onChanged: _searchPlace,
              decoration: InputDecoration(
                hintText: 'Search for a location...',
                hintStyle: TextStyle(color: Colors.grey[400]),
                prefixIcon: const Icon(Icons.search, color: Colors.redAccent),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                  icon: const Icon(Icons.clear, color: Colors.grey),
                  onPressed: () => setState(() {
                    _searchController.clear();
                    predictions = [];
                  }),
                )
                    : null,
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              ),
              style: const TextStyle(fontSize: 16),
            ),
          ),
          if (predictions.isNotEmpty)
            Material(
              elevation: 8,
              borderRadius: BorderRadius.circular(12),
              child: Container(
                constraints: const BoxConstraints(maxHeight: 200),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: predictions.length,
                  itemBuilder: (context, index) {
                    final p = predictions[index];
                    return ListTile(
                      leading: const Icon(Icons.place, color: Colors.redAccent),
                      title: Text(p.description ?? '', style: const TextStyle(fontSize: 14)),
                      onTap: () => _selectPlace(p.placeId!),
                    );
                  },
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildPickedAddress() {
    return Positioned(
      bottom: 100,
      left: 20,
      right: 20,
      child: Material(
        elevation: 8,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              const Icon(Icons.location_on, color: Colors.redAccent),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  _pickedAddress!,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFloatingButtons() {
    return Positioned(
      right: 20,
      top: 100,
      child: Column(
        children: [
          FloatingActionButton(
            onPressed: _centerOnCurrentLocation,
            backgroundColor: Colors.white,
            mini: true,
            elevation: 8,
            child: const Icon(Icons.my_location, color: Colors.blue),
          ),
          const SizedBox(height: 10),
          FloatingActionButton(
            onPressed: _centerOnBloodBank,
            backgroundColor: Colors.white,
            mini: true,
            elevation: 8,
            child: const Icon(Icons.local_hospital, color: Colors.redAccent),
          ),
        ],
      ),
    );
  }

  Widget _buildConfirmButton() {
    return FloatingActionButton.extended(
      onPressed: () => Navigator.pop(context, {'location': _cameraPosition, 'address': _pickedAddress}),
      label: const Text('Confirm Location', style: TextStyle(fontWeight: FontWeight.bold)),
      icon: const Icon(Icons.check_circle),
      backgroundColor: Colors.red,
      foregroundColor: Colors.white,
      elevation: 8,
    );
  }
}