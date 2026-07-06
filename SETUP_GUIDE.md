# Quick Setup Guide - Fingerprint Authentication

## Prerequisites Verification

### 1. Install Required Dependencies

Run the following in the mobile directory to ensure all dependencies are installed:

```bash
cd mobile
npm install expo-local-authentication
npm install --save-dev @types/expo-local-authentication
```

### 2. Verify Backend Dependencies

Run the following in the backend directory:

```bash
cd securebi-backend
npm install
npm install bcrypt jsonwebtoken
```

### 3. Environment Configuration

Create or verify `.env` file in `securebi-backend/`:
```
JWT_SECRET=securebi-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/securebi
PORT=4000
CORS_ORIGIN=*
```

## Running the Application

### 1. Start Backend Server
```bash
cd mobile/securebi-backend
npm start
# Backend runs on http://localhost:4000
```

### 2. Start Frontend App
```bash
cd mobile
npm start
# Choose: 'i' for iOS simulator or 'a' for Android emulator
# Or scan QR code with Expo Go on physical device
```

## Testing the Authentication System

### Test Case 1: Password Login
1. Start the app
2. Select a role (Courier, Customer, or Admin)
3. Enter email and password
4. Click "Login"
5. ✓ Should navigate to appropriate dashboard

### Test Case 2: Fingerprint Enrollment (Registration)
1. Click "Register" on login screen
2. Fill in all registration fields
3. Click "Register"
4. On BiometricScreen:
   - Place finger on scanner (Step 1)
   - Lift and place again (Step 2)
   - System completes enrollment (Step 3)
5. ✓ Should return to login screen

### Test Case 3: Fingerprint Login
1. On login screen, click fingerprint icon
2. Scan your fingerprint on device
3. Enter email when prompted
4. ✓ Should authenticate and navigate to dashboard

### Test Case 4: Skip Biometric
1. During registration, click "Skip for now"
2. ✓ Should proceed without biometric setup
3. Later login only available via password

## Troubleshooting

### Issue: "Biometric Not Available" on login
**Solution**: 
- For physical device: Ensure fingerprint is enrolled in device settings
- For simulator: Biometric not available (fallback to password login)

### Issue: Biometric enrollment fails
**Solution**:
- Clean fingerprint before scanning
- Move finger slower on sensor
- Ensure proper finger placement

### Issue: "User not found" after biometric scan
**Solution**:
- Ensure you entered correct email
- Verify user exists in database
- Check if account is active (not deactivated by admin)

### Issue: API connection failed
**Solution**:
- Verify backend is running on port 4000
- Check API_BASE_URL configuration
- Ensure firewall allows connection
- For Android emulator: Use 10.0.2.2 instead of localhost

## Database Initialization

If database is not initialized, run:

```bash
cd mobile/securebi-backend
psql -U postgres -d securebi -f schema.sql
```

To create tables and indexes.

## API Endpoints Reference

### Authentication Endpoints

#### POST /api/v1/auth/login/password
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /api/v1/auth/login/biometric
```json
{
  "userId": "uuid",
  "biometricHash": "hash_value"
}
```

#### POST /api/v1/auth/register
```json
{
  "name": "John Courier",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepass123",
  "role": "courier"
}
```

#### POST /api/v1/biometric/register
```json
{
  "userId": "uuid",
  "biometricHash": "biometric_hash"
}
```

## Common Commands

### Check Backend Status
```bash
curl http://localhost:4000/api/v1/health
# Should return: {"status":"ok"}
```

### View Backend Logs
```bash
cd mobile/securebi-backend
npm start
# Logs displayed in terminal
```

### Clear Cache (if issues persist)
```bash
cd mobile
npm start --reset-cache
```

## Development Notes

### File Structure
```
mobile/
├── src/
│   ├── screens/auth/
│   │   ├── LoginScreen.tsx (✓ Updated)
│   │   ├── BiometricScreen.tsx (✓ Updated)
│   │   ├── RegisterScreen.tsx (✓ Working)
│   │   └── ResetPasswordScreen.tsx
│   ├── context/
│   │   └── AuthContext.tsx (✓ Updated)
│   └── api.ts (✓ Updated)
└── securebi-backend/
    ├── routes/
    │   ├── auth.js (✓ Updated)
    │   ├── biometric.js
    │   └── users.js
    ├── models/
    │   └── users.js
    └── schema.sql
```

### Key Features Implemented
- ✓ Password-based login restored
- ✓ User registration with validation
- ✓ Fingerprint enrollment (2-step)
- ✓ Fingerprint authentication
- ✓ JWT token generation
- ✓ Role-based routing
- ✓ Account deactivation checks
- ✓ Biometric availability detection

### Security Checklist
- ✓ Passwords hashed with bcrypt
- ✓ JWT tokens with 8-hour expiration
- ✓ CORS enabled for frontend
- ✓ Input validation on backend
- ✓ Database indexes for performance
- ✓ Environment variables for secrets

## Next Steps

1. **Test on Physical Device**: Enables real biometric testing
2. **Configure Production Database**: Update DATABASE_URL
3. **Implement Rate Limiting**: Prevent brute force attacks
4. **Add Logging**: For production monitoring
5. **Setup CI/CD**: Automated testing and deployment

## Support

For issues or questions:
1. Check error messages in console
2. Review API response in network tab
3. Verify database connection
4. Check environment variables
5. Review logs in backend terminal

---

**Last Updated**: 2026-06-15
