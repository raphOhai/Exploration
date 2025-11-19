import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface StrigaRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  body?: unknown;
}

@Injectable()
export class StrigaService {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    // Load credentials from .env file via ConfigService
    // Make sure .env file exists in project root with:
    // STRIGA_API_KEY=your-key
    // STRIGA_API_SECRET=your-secret
    // STRIGA_API_BASE_URL=https://www.sandbox.striga.com/api/v1 (optional)
    this.apiKey = this.configService.get<string>('STRIGA_API_KEY', '');
    this.apiSecret = this.configService.get<string>('STRIGA_API_SECRET', '');
    this.baseUrl =
      this.configService.get<string>('STRIGA_API_BASE_URL') ||
      'https://www.sandbox.striga.com/api/v1';

    // Validate that required credentials are present
    if (!this.apiKey || !this.apiSecret) {
      throw new Error(
        'STRIGA_API_KEY and STRIGA_API_SECRET must be set in .env file. ' +
          'Please create a .env file in the project root with these variables.',
      );
    }
  }

  private calculateSignature(
    method: string,
    endpoint: string,
    body: unknown,
  ): string {
    const hmac = crypto.createHmac('sha256', this.apiSecret);
    const time = Date.now().toString();

    hmac.update(time);
    hmac.update(method);
    hmac.update(endpoint);

    const contentHash = crypto.createHash('md5');
    contentHash.update(JSON.stringify(body || {}));
    hmac.update(contentHash.digest('hex'));

    const auth = `HMAC ${time}:${hmac.digest('hex')}`;
    return auth;
  }

  async request<T = unknown>(options: StrigaRequestOptions): Promise<T> {
    const { method, endpoint, body } = options;
    const signature = this.calculateSignature(method, endpoint, body);

    const headers: Record<string, string> = {
      authorization: signature,
      'api-key': this.apiKey,
      'Content-Type': 'application/json',
    };

    const fullUrl = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Striga API error: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return (await response.json()) as T;
      }

      return (await response.text()) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Striga API request failed: ${error.message}`);
      }
      throw error;
    }
  }

  // Convenience methods for common operations
  async getUser(userId: string) {
    return this.request({
      method: 'GET',
      endpoint: `/user/${userId}`,
    });
  }

  async createUser(data: unknown) {
    return this.request({
      method: 'POST',
      endpoint: '/user',
      body: data,
    });
  }

  async updateUser(userId: string, data: unknown) {
    return this.request({
      method: 'PUT',
      endpoint: `/user/${userId}`,
      body: data,
    });
  }
}
