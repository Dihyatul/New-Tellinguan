# Skema Penghubung Frontend (Flutter) dengan Backend (Node.js/Express + PostgreSQL)

Dokumen ini berisi panduan lengkap tentang bagaimana cara menghubungkan aplikasi Flutter (Frontend) dengan backend Express.js dan database PostgreSQL yang ada pada proyek TelLinguan.

---

## 1. Arsitektur Konektivitas & Aliran Data

Berikut adalah visualisasi bagaimana data dikirim dari aplikasi Flutter (HP/Emulator) menuju server API backend dan disimpan ke database PostgreSQL:

```mermaid
graph TD
    subgraph Flutter APP (Frontend)
        A[UI Widget / Halaman Login/Quiz] <-->|1. Memanggil fungsi| B[API Service / HTTP Client]
        B <-->|3. Simpan/Baca Token JWT| C[(Secure Storage)]
    end

    subgraph Express.js Server (Backend)
        D[Routes / Endpoints] <-->|2. Middleware JWT Auth| E[Controllers]
        E <-->|4. Enkripsi/Dekripsi Data| F[Crypto Utility]
    end

    subgraph Database Layer
        G[(PostgreSQL DB)]
    end

    B <-->|Kirim JSON via HTTP POST/GET/PUT/DELETE| D
    E <-->|5. Query SQL| G
```

---

## 2. Pemetaan Struktur Database ke Model Dart (Flutter)

Data dari tabel PostgreSQL perlu diubah menjadi objek kelas Dart (Model) agar mudah dikelola di Flutter. Berikut adalah pemetaannya berdasarkan `schema.sql`:

### A. Model Pengguna (Tabel `users`)
Meskipun kolom `email`, `instansi`, dan `nim_nisn` dienkripsi secara internal oleh backend saat disimpan di PostgreSQL, saat backend merespons ke Flutter, data tersebut sudah otomatis didekripsi. Oleh karena itu, di Flutter kita cukup menuliskannya sebagai `String`.

**File:** `user_model.dart`
```dart
class UserModel {
  final int id;
  final String email;
  final String username;
  final String instansi;
  final String nimNisn;

  UserModel({
    required this.id,
    required this.email,
    required this.username,
    required this.instansi,
    required this.nimNisn,
  });

  // Mengubah JSON dari backend menjadi Object Dart
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      email: json['email'],
      username: json['username'],
      instansi: json['instansi'],
      nimNisn: json['nimNisn'],
    );
  }

  // Mengubah Object Dart kembali menjadi JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'username': username,
      'instansi': instansi,
      'nimNisn': nimNisn,
    };
  }
}
```

### B. Model Soal (Tabel `questions`)
**File:** `question_model.dart`
```dart
class QuestionModel {
  final int id;
  final String type;
  final String question;
  final List<String> options;
  final int answer;
  final String? audioUrl;
  final dynamic passages; // Bisa berupa List atau Map JSON

  QuestionModel({
    required this.id,
    required this.type,
    required this.question,
    required this.options,
    required this.answer,
    this.audioUrl,
    this.passages,
  });

  factory QuestionModel.fromJson(Map<String, dynamic> json) {
    return QuestionModel(
      id: json['id'],
      type: json['type'],
      question: json['question'],
      options: List<String>.from(json['options']),
      answer: json['answer'],
      audioUrl: json['audio_url'],
      passages: json['passages'],
    );
  }
}
```

---

## 3. Aliran Pemanggilan Variabel & Payload JSON

Flutter dan backend berkomunikasi menggunakan data berformat **JSON**. Berikut bentuk data yang dikirim dan diterima:

### A. Registrasi Pengguna
*   **Endpoint:** `POST /api/auth/register`
*   **Request Body (JSON dikirim dari Flutter):**
    ```json
    {
      "email": "budi@gmail.com",
      "instansi": "Universitas Telkom",
      "userName": "budi_tellinguan",
      "nimNisn": "1301210000",
      "password": "password123",
      "confirmPassword": "password123"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "message": "Registration successful"
    }
    ```

### B. Login Pengguna
*   **Endpoint:** `POST /api/auth/login`
*   **Request Body (JSON dikirim dari Flutter):**
    ```json
    {
      "username": "budi_tellinguan",
      "password": "password123"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJidWRpX3RlbGxpbmd1YW4iLCJlbWFpbCI6ImJ1ZGlAZ21haWwuY29tIn0...",
      "user": {
        "id": 1,
        "email": "budi@gmail.com",
        "username": "budi_tellinguan",
        "instansi": "Universitas Telkom",
        "nimNisn": "1301210000"
      }
    }
    ```
    > **PENTING:** Simpan string `token` di Flutter menggunakan **flutter_secure_storage** untuk memverifikasi request di masa mendatang.

---

## 4. Implementasi Kode HTTP Client di Flutter (Dart)

Tambahkan dependency berikut pada file `pubspec.yaml` Flutter Anda:
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  flutter_secure_storage: ^9.0.0
```

### A. Kode API Service
Buat file `api_service.dart`:
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'user_model.dart';
import 'question_model.dart';

class ApiService {
  // Ganti IP sesuai server backend Anda.
  // Gunakan 'http://10.0.2.2:5000/api' jika menjalankan Android Emulator ke localhost komputer Anda.
  static const String baseUrl = 'http://10.0.2.2:5000/api'; 
  final _storage = const FlutterSecureStorage();

  // 1. Fungsi Register
  Future<String?> register({
    required String email,
    required String instansi,
    required String username,
    required String nimNisn,
    required String password,
    required String confirmPassword,
  }) async {
    final url = Uri.parse('$baseUrl/auth/register');
    
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'instansi': instansi,
          'userName': username,
          'nimNisn': nimNisn,
          'password': password,
          'confirmPassword': confirmPassword,
        }),
      );

      final responseData = jsonDecode(response.body);
      if (response.statusCode == 201) {
        return null; // Tidak ada error, berarti sukses
      } else {
        return responseData['message'] ?? 'Registrasi gagal';
      }
    } catch (e) {
      return 'Koneksi error: $e';
    }
  }

  // 2. Fungsi Login
  Future<UserModel?> login(String username, String password) async {
    final url = Uri.parse('$baseUrl/auth/login');

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      );

      final responseData = jsonDecode(response.body);
      if (response.statusCode == 200) {
        // Simpan token JWT secara lokal
        await _storage.write(key: 'jwt_token', value: responseData['token']);
        
        // Kembalikan data user
        return UserModel.fromJson(responseData['user']);
      } else {
        throw Exception(responseData['message'] ?? 'Username atau password salah.');
      }
    } catch (e) {
      rethrow;
    }
  }

  // 3. Ambil Soal Grammar (Membutuhkan Autentikasi JWT)
  Future<List<QuestionModel>> getGrammarQuestions() async {
    final url = Uri.parse('$baseUrl/questions/grammar');
    
    // Ambil JWT Token yang telah disimpan ketika login
    final token = await _storage.read(key: 'jwt_token');
    
    try {
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token', // Mengirimkan JWT Token
        },
      );

      if (response.statusCode == 200) {
        List<dynamic> body = jsonDecode(response.body);
        return body.map((dynamic item) => QuestionModel.fromJson(item)).toList();
      } else {
        throw Exception('Gagal memuat soal: ${response.statusCode}');
      }
    } catch (e) {
      rethrow;
    }
  }
}
```

### B. Pemanggilan Variabel di Sisi UI (Widget)
Berikut contoh penggunaan di dalam Widget saat tombol login ditekan:

```dart
final ApiService _apiService = ApiService();
final TextEditingController _usernameController = TextEditingController();
final TextEditingController _passwordController = TextEditingController();

void _loginUser() async {
  // Ambil nilai dari input form
  String username = _usernameController.text.trim();
  String password = _passwordController.text;

  if (username.isEmpty || password.isEmpty) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Kolom tidak boleh kosong')),
    );
    return;
  }

  try {
    // Memanggil API login
    UserModel? user = await _apiService.login(username, password);

    if (user != null) {
      // Navigasi ke halaman dashboard / home dan kirim objek user
      Navigator.pushReplacementNamed(context, '/home', arguments: user);
    }
  } catch (e) {
    // Tampilkan SnackBar jika gagal
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Login Gagal: ${e.toString()}')),
    );
  }
}
```
