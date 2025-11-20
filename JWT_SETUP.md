# JWT Authentication Setup

## Overview

JWT authentication is now set up in your NestJS application. Tokens are signed with user ID and email.

## Installation

Run the following to install required packages:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local bcrypt
npm install -D @types/passport-jwt @types/passport-local @types/bcrypt
```

## Environment Variables

Add to your `.env` file:

```env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

## How It Works

### Token Payload Structure

JWTs are signed with the following payload:
```typescript
{
  sub: "123",        // User ID (as string)
  email: "user@example.com",
  iat: 1234567890,   // Issued at (auto)
  exp: 1234567890    // Expiration (auto)
}
```

### Generating Tokens

#### 1. Via Login/Register Endpoints

**Register:**
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Login:**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### 2. Programmatically in Services

```typescript
import { AuthService } from './auth/auth.service';

// Generate token with user ID
const token = this.authService.generateToken({ id: user.id });

// Generate token with email
const token = this.authService.generateToken({ email: user.email });

// Generate token with both
const token = this.authService.generateToken({ 
  id: user.id, 
  email: user.email 
});
```

#### 3. Direct JWT Service Usage

```typescript
import { JwtService } from '@nestjs/jwt';

constructor(private readonly jwtService: JwtService) {}

// Sign token with custom payload
const payload = { sub: user.id.toString(), email: user.email };
const token = this.jwtService.sign(payload);
```

## Protecting Routes

### Using JWT Guard

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProtectedData(@Request() req) {
    // req.user contains the authenticated user
    return { message: 'This is protected', user: req.user };
  }
}
```

### Making Routes Public

```typescript
import { Public } from './auth/decorators/public.decorator';

@Public()
@Get('public')
getPublicData() {
  return { message: 'This is public' };
}
```

## Using Tokens in Requests

Include the token in the Authorization header:

```bash
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Available Endpoints

- `POST /auth/register` - Register new user (returns JWT)
- `POST /auth/login` - Login user (returns JWT)
- `GET /auth/profile` - Get current user profile (protected)

## Token Verification

```typescript
// Verify and decode token
const payload = await this.authService.verifyToken(token);
console.log(payload.sub); // User ID
console.log(payload.email); // User email
```

## Example: Using in Frontend

```typescript
// Login
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

const { access_token } = await response.json();

// Store token
localStorage.setItem('token', access_token);

// Use token in requests
const profile = await fetch('http://localhost:3000/auth/profile', {
  headers: {
    'Authorization': `Bearer ${access_token}`,
  },
});
```

## Security Notes

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Set appropriate expiration** times
4. **Store tokens securely** (httpOnly cookies recommended for web)
5. **Implement refresh tokens** for better security



