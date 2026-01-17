// Test script to verify if auth.js crashes when env vars are missing
process.env.DATABASE_URL = ''; // Simulate missing DB
process.env.BETTER_AUTH_SECRET = 'somerandomsecret';

try {
    console.log('Attempting to import auth.js...');
    const { auth } = await import('./lib/auth.js');
    console.log('Success! Auth loaded.');
    console.log('Auth object keys:', Object.keys(auth));
} catch (error) {
    console.error('CRASHED during import!');
    console.error(error);
}
