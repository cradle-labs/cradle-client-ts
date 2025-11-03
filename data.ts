import CradleApiClient from "./cradle-api-client";


async function main() {
    const client = new CradleApiClient({
      baseUrl: 'http://localhost:3000',
      apiKey: process.env.API_SECRET_KEY || 'your-secret-key',
      timeout: 30000,
    });


}