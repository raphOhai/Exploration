# Striga API Service Usage

## Setup

1. **Create a `.env` file** in the root directory with your Striga credentials:
   ```env
   STRIGA_API_KEY=your-api-key-here
   STRIGA_API_SECRET=your-api-secret-here
   STRIGA_API_BASE_URL=https://www.sandbox.striga.com/api/v1
   ```

2. **The service is already integrated** into `AppModule`, so it's available throughout your application.

## Usage Examples

### Basic Usage in a Service

```typescript
import { Injectable } from '@nestjs/common';
import { StrigaService } from '../striga/striga.service';

@Injectable()
export class YourService {
  constructor(private readonly strigaService: StrigaService) {}

  async getUser(userId: string) {
    return this.strigaService.getUser(userId);
  }

  async createUser(userData: unknown) {
    return this.strigaService.createUser(userData);
  }

  // Custom request
  async customRequest() {
    return this.strigaService.request({
      method: 'GET',
      endpoint: '/custom-endpoint',
      body: { some: 'data' },
    });
  }
}
```

### Usage in a Controller

```typescript
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { StrigaService } from '../striga/striga.service';

@Controller('striga')
export class StrigaController {
  constructor(private readonly strigaService: StrigaService) {}

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return this.strigaService.getUser(id);
  }

  @Post('user')
  async createUser(@Body() userData: unknown) {
    return this.strigaService.createUser(userData);
  }
}
```

## Available Methods

### Generic Request Method
```typescript
request<T>(options: StrigaRequestOptions): Promise<T>
```
- `method`: HTTP method ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')
- `endpoint`: API endpoint path (e.g., '/user/123')
- `body`: Optional request body

### Convenience Methods
- `getUser(userId: string)` - Get user by ID
- `createUser(data: unknown)` - Create a new user
- `updateUser(userId: string, data: unknown)` - Update user

## How It Works

1. **HMAC Signature**: Automatically calculates the HMAC-SHA256 signature required by Striga API
2. **Timestamp**: Includes current timestamp in the signature
3. **Content Hash**: Creates MD5 hash of the request body
4. **Headers**: Automatically sets required headers (authorization, api-key, Content-Type)

## Error Handling

The service throws errors if:
- API credentials are missing
- API request fails (non-2xx response)
- Network errors occur

Example error handling:
```typescript
try {
  const user = await this.strigaService.getUser('user-id');
} catch (error) {
  console.error('Striga API error:', error.message);
}
```

