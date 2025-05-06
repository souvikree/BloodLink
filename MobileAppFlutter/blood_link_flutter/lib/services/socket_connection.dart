import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'notification_services.dart';

class NotificationSocketService {
  late IO.Socket socket;

  void initSocket() {
    socket = IO.io('https://bloodlink-flsd.onrender.com', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
    });

    socket.connect();

    socket.onConnect((_) {
      print('Connected to socket');
    });

    // Listen to notification events
    socket.on('new_notification', (data) {
      print('Notification received: $data');

      // Show local notification (foreground + background)
      NotificationService.showNotification(
        data['title'] ?? 'BloodLink',
        data['body'] ?? 'You have a new notification',
      );
    });

    socket.onDisconnect((_) {
      print('Socket disconnected');
    });
  }

  void dispose() {
    socket.dispose();
  }
}
