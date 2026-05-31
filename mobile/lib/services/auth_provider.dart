import 'package:flutter/material.dart';
import 'api_service.dart';

class AuthProvider extends ChangeNotifier {
  final ApiService api;
  bool loading = false;
  Map<String, dynamic>? user;

  AuthProvider(this.api);

  Future<bool> login(String email, String password) async {
    loading = true;
    notifyListeners();
    try {
      final data = await api.login(email, password);
      user = data['user'];
      return true;
    } catch (_) {
      return false;
    } finally {
      loading = false;
      notifyListeners();
    }
  }
}
