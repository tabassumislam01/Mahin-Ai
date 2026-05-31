import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: const [
          ListTile(title: Text('Push Notifications'), subtitle: Text('Configure notification preferences')),
          ListTile(title: Text('Theme'), subtitle: Text('Light / Dark mode')),
          ListTile(title: Text('Privacy'), subtitle: Text('Manage data and account settings')),
        ],
      ),
    );
  }
}
