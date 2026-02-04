// middleware.js

export const config = {
  // Only run this middleware on the dashboard page and API routes.
  // This prevents it from blocking static assets like your icon (GN ICON.png)
  // if you want those to remain public, though usually protecting everything is safer.
  matcher: ['/', '/index.html', '/api/:path*'],
};

export default function middleware(request) {
  // 1. Get the Authorization header
  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    // 2. The header comes as "Basic base64string". Split it to get the token.
    const authValue = basicAuth.split(' ')[1];
    
    // 3. Decode the Base64 string "username:password"
    // 'atob' is a standard function available in Vercel Edge Runtime.
    const [user, pwd] = atob(authValue).split(':');

    // 4. Check against your Environment Variables
    // Make sure these match what you set in Vercel!
    if (user === process.env.AUTH_USER && pwd === process.env.AUTH_PASS) {
      // Success: Allow the request to continue to the site
      return new Response(null, {
        status: 200,
        headers: {
          'x-middleware-next': '1', // Internal Vercel header to pass request
        },
      });
    }
  }

  // 5. If not authenticated (or wrong password), force the browser popup
  return new Response('Auth Required.', {
    status: 401,
    headers: {
      // This strict header forces the browser to show the login prompt
      'WWW-Authenticate': 'Basic realm="Secure Finance Dashboard"',
    },
  });
}
