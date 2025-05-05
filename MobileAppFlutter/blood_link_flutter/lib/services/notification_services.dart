// import 'package:socket_io_client/socket_io_client.dart' as IO;
// import 'package:flutter_local_notifications/flutter_local_notifications.dart';
//
// import '../main.dart';
//
// class NotificationService {
//   IO.Socket? socket;
//
//   void initSocket(String userId) {
//     socket = IO.io(
//       'https://bloodlink-flsd.onrender.com/api/notifications/notifications', // Replace with your real backend
//       IO.OptionBuilder()
//           .setTransports(['websocket'])
//           .enableAutoConnect()
//           .enableForceNew()
//           .setQuery({'userId': userId})
//           .build(),
//     );
//
//     socket!.onConnect((_) {
//       print('✅ Connected to socket');
//       socket!.emit('join', userId);
//     });
//
//     socket!.on('new_notification', (data) {
//       print("🔔 Received notification: $data");
//       if (data != null && data['message'] != null) {
//         _showLocalNotification(data['message']);
//       }
//     });
//
//     socket!.onDisconnect((_) => print('❌ Disconnected from socket'));
//   }
//
//   Future<void> _showLocalNotification(String message) async {
//     const AndroidNotificationDetails androidPlatformChannelSpecifics =
//     AndroidNotificationDetails(
//       'your_channel_id', // ID
//       'Your Channel Name', // Name
//       channelDescription: 'Your channel description',
//       importance: Importance.max,
//       priority: Priority.high,
//       showWhen: true,
//     );
//
//     const NotificationDetails platformChannelSpecifics = NotificationDetails(
//       android: androidPlatformChannelSpecifics,
//     );
//
//     await flutterLocalNotificationsPlugin.show(
//       DateTime.now().millisecondsSinceEpoch ~/ 1000, // Unique ID
//       'BloodLink Alert', // Title
//       message, // Body
//       platformChannelSpecifics,
//       payload: 'notification_payload',
//     );
//   }
//
//   void dispose() {
//     socket?.disconnect();
//     socket?.destroy();
//     socket = null;
//   }
// }
