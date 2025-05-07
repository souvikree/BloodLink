import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'notification_services.dart';

class NotificationSocketService {
  late IO.Socket socket;

  void initSocket() {
    socket = IO.io(
      'https://bloodlink-flsd.onrender.com',
      IO.OptionBuilder()
          .setTransports(['websocket']) // Force WebSocket only
          .disableAutoConnect()         // Disable autoConnect (we call connect manually)
          .enableReconnection()         // Enable reconnection
          .setReconnectionAttempts(5)   // Retry 5 times before giving up
          .setReconnectionDelay(2000)   // 2 seconds delay between attempts
          .build(),
    );

    // Connect manually
    socket.connect();

    // Events
    socket.onConnect((_) {
      print('✅ Connected to socket');
    });

    socket.onConnectError((data) {
      print('❌ Connection error: $data');
    });

    socket.onError((data) {
      print('❌ Socket error: $data');
    });

    socket.onDisconnect((_) {
      print('⚠️ Socket disconnected');
    });

    // Listen for notification events
    socket.on('new_notification', (data) {
      print('🔔 Notification received: $data');

      // Show local notification
      NotificationService.showNotification(
        data['title'] ?? 'BloodLink',
        data['body'] ?? 'You have a new notification',
      );
    });
  }

  void dispose() {
    socket.dispose();
  }
}
