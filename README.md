# SmartSync

A comprehensive attendance management system featuring identity verification and AI-driven insights.

## Project Structure

- **SmartSync-Backend**: Node.js backend handling authentication, attendance logic, and database interactions.
- **attendance_app_frontend**: Expo/React Native mobile application for students and faculty.

## Getting Started

### Backend
1. Navigate to `SmartSync-Backend`
2. Run `npm install`
3. Configure your `.env` file
4. Start the server with `npm start` or `npm run dev`

### Frontend
1. Navigate to `attendance_app_frontend`
2. Run `npm install`
3. Start the Expo development server with `npx expo start`

---

## SmartSync App Flow

This section provides a structured explanation of how SmartSync works for different users and how the system components interact.

### 1. Faculty Flow (End-to-End)
*   **Step 1: Login**
    *   Faculty logs in using their college email ID and password.
    *   The frontend sends credentials to the backend.
    *   Backend verifies the faculty role and returns a JWT token stored securely in the app.
*   **Step 2: Faculty Dashboard**
    *   Shows class statistics, attendance summaries, alerts, and analytics.
*   **Step 3: Start Attendance Session**
    *   Faculty clicks “Generate QR Code”.
    *   Backend creates a session ID, stores the faculty IP address, and sets an expiry time (e.g., 2 minutes).
    *   Frontend displays the QR code.
*   **Step 4: Monitor Attendance**
    *   Faculty sees a live count of students joining and can stop the session manually.
*   **Step 5: View Analytics**
    *   Access subject-wise attendance, low attendance alerts, and downloadable reports.

### 2. Student Flow (End-to-End)
*   **Step 1: Login / Signup**
    *   Student authenticates using their Register Number and password to receive a JWT token.
*   **Step 2: Student Dashboard**
    *   View attendance percentage per subject and past records.
*   **Step 3: Scan QR Code**
    *   Student scans the faculty's QR code.
    *   Frontend sends session ID, student token, and student IP.
    *   Backend validates session activity, IP matching (proximity check), and duplicate prevention.
*   **Step 4: Attendance Confirmation**
    *   Success or rejection notification based on validation results.

### 3. System Architecture & Component Roles

#### Frontend (React Native / Expo)
*   **Responsibilities**: UI/UX, role-based navigation, QR scanning, and secure communication with the backend.
*   **Key Points**: No sensitive data is stored locally; every request is validated via JWT.

#### Backend (Node.js / Express.js)
*   **Responsibilities**: Authentication, session lifecycle management, attendance verification logic, and security enforcement (RBAC).
*   **Workflow**: Receives requests → Verifies tokens → Checks permissions → Executes logic → Interacts with DB → Returns response.

#### Database (MongoDB Atlas)
*   **Collections**:
    *   **Users**: Stores hashed credentials and role permissions.
    *   **Sessions**: Tracks QR session details, faculty IP, and expiry.
    *   **Attendance**: Links students to sessions with timestamps and duplicate prevention.

### 4. How They Work Together
1.  **Frontend** collects input and sends secure requests.
2.  **Backend** applies security checks and handles business logic.
3.  **Database** ensures permanent records and data consistency for reporting.
