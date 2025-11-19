# Environment Variables Setup

## .env File Configuration

The application uses `@nestjs/config` to load environment variables from a `.env` file in the project root.

### Required Setup

1. **Create a `.env` file** in the root directory (`/Users/ra/Desktop/jobTest/nestjs/.env`)

2. **Add your Striga API credentials:**
   ```env
   STRIGA_API_KEY=your-api-key-here
   STRIGA_API_SECRET=your-api-secret-here
   STRIGA_API_BASE_URL=https://www.sandbox.striga.com/api/v1
   ```

3. **Optional: Add other environment variables:**
   ```env
   # Database (if you want to use env vars instead of hardcoded values)
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=mydb

   # Server
   PORT=3000
   ```

### How It Works

- `ConfigModule` is configured in `AppModule` with:
  - `isGlobal: true` - Makes ConfigService available app-wide
  - `envFilePath: '.env'` - Specifies the .env file location
  - `expandVariables: true` - Allows variable expansion in .env

- The `.env` file is automatically loaded when the app starts
- Variables are accessible via `ConfigService.get('VARIABLE_NAME')`

### Security Notes

⚠️ **Important:**
- Never commit `.env` files to version control
- Add `.env` to your `.gitignore` file
- Use `.env.example` as a template (without actual secrets)

### Verification

To verify your .env file is being loaded:

1. Check that the file exists: `ls -la .env`
2. Start the app - if credentials are missing, you'll get a clear error message
3. The StrigaService will throw an error on startup if `STRIGA_API_KEY` or `STRIGA_API_SECRET` are missing

