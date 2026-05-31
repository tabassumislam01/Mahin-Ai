import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio = Dio(
    BaseOptions(baseUrl: const String.fromEnvironment('API_URL', defaultValue: 'http://localhost:5000')),
  );

  String? accessToken;
  String? refreshToken;

  ApiService() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (accessToken != null && accessToken!.isNotEmpty) {
            options.headers['Authorization'] = ['Bearer', accessToken].join(' ');
          }
          handler.next(options);
        },
      ),
    );
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await _dio.post('/api/auth/login', data: {'email': email, 'password': password});
    accessToken = res.data['accessToken'];
    refreshToken = res.data['refreshToken'];
    return Map<String, dynamic>.from(res.data);
  }

  Future<List<dynamic>> fetchConversations() async {
    final res = await _dio.get('/api/chat/conversations');
    return List<dynamic>.from(res.data['conversations'] ?? []);
  }

  Future<Map<String, dynamic>> sendMessage(String content, {String? conversationId}) async {
    final res = await _dio.post('/api/chat/message', data: {
      'content': content,
      if (conversationId != null) 'conversationId': conversationId,
    });
    return Map<String, dynamic>.from(res.data);
  }
}
