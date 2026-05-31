import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_provider.dart';
import '../services/api_service.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final inputCtrl = TextEditingController();
  String? conversationId;
  final List<Map<String, String>> messages = [];

  @override
  Widget build(BuildContext context) {
    final api = context.read<ApiService>();
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mahin AI Chat'),
        actions: [
          IconButton(
            onPressed: () => Navigator.pushNamed(context, '/settings'),
            icon: const Icon(Icons.settings),
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          children: [
            DrawerHeader(child: Text(auth.user?['name']?.toString() ?? 'User')),
            ListTile(title: const Text('Profile'), onTap: () => Navigator.pushNamed(context, '/profile')),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: messages.length,
              itemBuilder: (_, i) {
                final m = messages[i];
                return ListTile(
                  title: Text(m['content'] ?? ''),
                  subtitle: Text(m['role'] ?? ''),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(child: TextField(controller: inputCtrl, decoration: const InputDecoration(hintText: 'Ask Mahin AI'))),
                IconButton(
                  onPressed: () async {
                    final content = inputCtrl.text.trim();
                    if (content.isEmpty) return;
                    setState(() {
                      messages.add({'role': 'user', 'content': content});
                      inputCtrl.clear();
                    });
                    final res = await api.sendMessage(content, conversationId: conversationId);
                    setState(() {
                      conversationId = res['conversation']?['_id']?.toString();
                      messages.add({'role': 'assistant', 'content': res['assistantMessage']?['content']?.toString() ?? ''});
                    });
                  },
                  icon: const Icon(Icons.send),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
