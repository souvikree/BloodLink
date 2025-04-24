# BloodLink Application

A seamless, secure, and responsive mobile app designed to connect blood donors, recipients, and blood banks. Built using Flutter for cross-platform performance across Android and iOS.

---

## 🚀 Frontend Overview

BloodLink leverages **Flutter**, a powerful UI toolkit, to ensure a consistent and fluid experience across devices. Its native performance capabilities make it ideal for emergency and real-time use cases like blood requests.

---

## 🔐 Authentication System

### 1. Login/Signup Interface
- **OTP-Based Authentication**: Mobile number verification via SMS.
- **Tab Navigation**: Seamless switching between Login and Signup.
- **Secure Backend Calls**:
  ```dart
  // Request OTP
  final response = await http.post(
    Uri.parse('https://bloodlink-flsd.onrender.com/api/patients/login/send-otp'),
    body: jsonEncode({"mobile": loginPhoneController.text.trim()}),
    headers: {'Content-Type': 'application/json'},
  );
  ```

### 2. Signup Process
- Captures:
  - Full Name
  - Mobile Number
- API Call:
  ```dart
  final response = await http.post(
    Uri.parse('https://bloodlink-flsd.onrender.com/api/patients/signup'),
    body: jsonEncode({
      "name": regNameController.text,
      "mobile": regPhoneController.text,
    }),
    headers: {'Content-Type': 'application/json'},
  );
  ```

---

## 📱 Core Features & Navigation

### Home Screen
- **Banner Carousel**: For blood drives, alerts, tips.
- **Nearby Blood Banks**: Real-time list with availability.
- **Search Function**: Filter by blood type and distance.

### Bottom Navigation Bar
- **Tabs**:
  - Home
  - Orders
  - Profile
- **Floating Action Button (FAB)**:
  - Place blood request
  - Edit profile
  - Emergency features *(coming soon)*

### Orders Page
- Chronological order history
- View order details (date, type, quantity, status)
- Create new order via form

### Profile Page
- View & Edit:
  - Name
  - Phone Number
  - Address
- FAB for quick profile edit

### Place Order Page
- Fields:
  - Blood Type
  - Quantity
  - Urgency (Normal/Urgent)
- **Geolocation**: Auto-fetch user location

### Search Blood Bank Page
- Filter by:
  - Distance (within 7 km)
  - Blood type availability
- **Google Maps Integration**: Blood banks on the map

---

## 💡 User Experience Enhancements

- **Responsive Design**: Adaptive layouts for all screen sizes
- **Error Handling**: Input validation, connectivity messages
- **Loading Indicators**: Custom spinners for async states

### Planned Accessibility Features
- Voice navigation for visually impaired
- Adjustable text size for readability

---

## 📸 Screenshots

| Login | Signup | OTP Verification |
|:--:|:--:|:--:|
| ![](https://github.com/user-attachments/assets/44d270b9-441e-4f6e-8e63-673c35a68ebc) | ![](https://github.com/user-attachments/assets/01484266-bc2e-4a75-9052-25b791f48ab8) | ![](https://github.com/user-attachments/assets/d4cc222a-efac-48f5-bdc8-2749747e8aa7) |

| Home | Orders | Profile |
|:--:|:--:|:--:|
| ![](https://github.com/user-attachments/assets/9603e207-51b9-44e1-aaf8-1201c56902ac) | ![](https://github.com/user-attachments/assets/df5d48f0-c6c6-472d-89d4-3071ba533141) | ![](https://github.com/user-attachments/assets/528c0429-a8b9-4d2b-a73b-7811c336e894) |

| Place Order | Search Bank | Map View |
|:--:|:--:|:--:|
| ![](https://github.com/user-attachments/assets/ccdccb61-4a60-4d0a-9780-4be31000e984) | ![](https://github.com/user-attachments/assets/9ea7da84-1ac6-4d66-a9b4-bb8357b866c3) | ![](https://github.com/user-attachments/assets/fa1f62a9-bf15-4b5a-8219-6a4d927b3f37) |

| Loading State |
|:--:|
| ![](https://github.com/user-attachments/assets/3fb20c6d-00da-4eda-b16d-5ad5fc53ad5a) |

---

Let me know if you'd like to expand the **Result Analysis**, **Future Scope**, or add **backend/API documentation**!
