import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:google_place/google_place.dart';
import 'package:location/location.dart' as loc;

class MapPickerPage extends StatefulWidget {
  const MapPickerPage({super.key});

  @override
  State<MapPickerPage> createState() => _MapPickerPageState();
}

class _MapPickerPageState extends State<MapPickerPage> {
  GoogleMapController? _mapController;
  LatLng? _pickedLocation;
  final _searchController = TextEditingController();
  late GooglePlace googlePlace;
  List<AutocompletePrediction> predictions = [];

  @override
  void initState() {
    super.initState();
    googlePlace = GooglePlace("YOUR_GOOGLE_MAPS_API_KEY");
    _getUserLocation();
  }

  Future<void> _getUserLocation() async {
    loc.Location location = loc.Location();
    final currentLocation = await location.getLocation();
    _mapController?.animateCamera(CameraUpdate.newLatLng(
      LatLng(currentLocation.latitude!, currentLocation.longitude!),
    ));
  }

  void _onMapTapped(LatLng position) {
    setState(() {
      _pickedLocation = position;
    });
  }

  void _searchPlace(String query) async {
    var result = await googlePlace.autocomplete.get(query);
    if (result != null && result.predictions != null) {
      setState(() {
        predictions = result.predictions!;
      });
    }
  }

  void _selectPlace(String placeId) async {
    final details = await googlePlace.details.get(placeId);
    final location = details?.result?.geometry?.location;
    if (location != null) {
      final latLng = LatLng(location.lat!, location.lng!);
      _mapController?.animateCamera(CameraUpdate.newLatLng(latLng));
      setState(() {
        _pickedLocation = latLng;
        predictions = [];
        _searchController.clear();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Select Location')),
      body: Stack(
        children: [
          GoogleMap(
            onMapCreated: (controller) {
              _mapController = controller;
              print("GoogleMap controller created");
            },
            initialCameraPosition: const CameraPosition(
              target: LatLng(22.5726, 88.3639), // Default to Kolkata
              zoom: 14,
            ),
            onTap: _onMapTapped,
            markers: _pickedLocation != null
                ? {
              Marker(
                markerId: const MarkerId('picked-location'),
                position: _pickedLocation!,
              )
            }
                : {},
          ),
          Positioned(
            top: 10,
            left: 15,
            right: 15,
            child: Column(
              children: [
                Material(
                  elevation: 5,
                  borderRadius: BorderRadius.circular(8),
                  child: TextField(
                    controller: _searchController,
                    onChanged: _searchPlace,
                    decoration: const InputDecoration(
                      hintText: 'Search address...',
                      prefixIcon: Icon(Icons.search),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                ),
                if (predictions.isNotEmpty)
                  Container(
                    color: Colors.white,
                    child: ListView.builder(
                      shrinkWrap: true,
                      itemCount: predictions.length,
                      itemBuilder: (context, index) {
                        final p = predictions[index];
                        return ListTile(
                          title: Text(p.description ?? ''),
                          onTap: () => _selectPlace(p.placeId!),
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: _pickedLocation != null
          ? FloatingActionButton.extended(
        onPressed: () {
          Navigator.pop(context, _pickedLocation);
        },
        label: const Text('Done'),
        icon: const Icon(Icons.check),
      )
          : null,
    );
  }
}

