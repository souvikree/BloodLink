import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../entity/message_class.dart';

class ChatProvider with ChangeNotifier {
  final List<ChatMessage> _messages = [];

  List<ChatMessage> get messages => List.unmodifiable(_messages);

  ChatProvider() {
    _loadMessages(); // load saved messages when provider initializes
  }

  Future<void> sendMessage(String userMessage) async {
    _addMessage(ChatMessage(message: userMessage, isUser: true));

    try {
      final response = await http.post(
        Uri.parse('https://bloodlink-flsd.onrender.com/api/v1/chatbot/message'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'message': userMessage}),
      );

      final decoded = jsonDecode(response.body);
      final botReply = decoded['reply'] ?? 'No reply from bot.';

      _addMessage(ChatMessage(message: botReply, isUser: false));
    } catch (e) {
      _addMessage(ChatMessage(message: 'Error: ${e.toString()}', isUser: false));
    }
  }

  void _addMessage(ChatMessage message) {
    _messages.add(message);
    notifyListeners();
    _saveMessages(); // save after every update
  }

  Future<void> _saveMessages() async {
    final prefs = await SharedPreferences.getInstance();

    // Convert messages to JSON list
    List<String> jsonList = _messages.map((msg) => jsonEncode(msg.toJson())).toList();

    await prefs.setStringList('chat_messages', jsonList);
  }

  Future<void> _loadMessages() async {
    final prefs = await SharedPreferences.getInstance();
    final savedList = prefs.getStringList('chat_messages');

    if (savedList != null) {
      _messages.clear();
      _messages.addAll(
        savedList.map((jsonStr) => ChatMessage.fromJson(jsonDecode(jsonStr))),
      );
      notifyListeners();
    }
  }

  Future<void> clearMessages() async {
    _messages.clear();
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('chat_messages');
  }

}
