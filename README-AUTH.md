# Admin Authentication System

A secure admin authentication system built with Next.js, NextAuth.js, and ShadCN UI.

## Features

- 🔐 **Secure Authentication** - JWT-based sessions with NextAuth.js
- 🎨 **Modern UI** - Clean login interface using ShadCN UI components
- ✅ **Form Validation** - React Hook Form with Zod schema validation
- 🛡️ **Route Protection** - Middleware-based route protection
- 🔄 **Auto Redirects** - Smart redirects for authenticated/unauthenticated users
- 📱 **Responsive Design** - Mobile-friendly login interface
- 🌙 **Theme Support** - Dark/light mode compatibility

## Admin Credentials

```
Email: admin@example.com
Password: admin123
```

## File Structure

```
app/
├── admin/
│   ├── page.tsx              # Login page
│   └── dashboard/
│       └── page.tsx          # Protected dashboard
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts      # NextAuth API routes
└── layout.tsx                # Root layout with providers

lib/
├── auth.ts                   # NextAuth configuration
└── validations/
    └── auth.ts               # Zod validation schemas

components/
└── providers/
    └── session-provider.tsx  # Session provider wrapper

middleware.ts                 # Route protection middleware
types/
└── next-auth.d.ts           # NextAuth type definitions
```

## Environment Variables

Create a `.env.local` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Usage

### Accessing Admin Area

1. Navigate to `/admin` - Shows login form
2. Enter admin credentials
3. On success, redirects to `/admin/dashboard`
4. Dashboard shows welcome message and session info

### Route Protection

- `/admin` - Public (login page)
- `/admin/dashboard` - Protected (requires authentication)
- `/admin/*` - Protected (all other admin routes)

### Authentication Flow

1. **Login** - User submits credentials via form
2. **Validation** - Zod schema validates input
3. **Authentication** - NextAuth verifies credentials
4. **Session** - JWT token created and stored
5. **Redirect** - User redirected to dashboard
6. **Protection** - Middleware protects subsequent requests

## Security Features

- **Hardcoded Admin** - Single admin user for security
- **JWT Sessions** - Secure token-based authentication
- **Route Middleware** - Server-side route protection
- **Form Validation** - Client and server-side validation
- **Error Handling** - Secure error messages
- **Auto Logout** - Session management with sign out

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access admin login
http://localhost:3000/admin
```

## Production Considerations

- [ ] Replace hardcoded credentials with secure storage
- [ ] Add rate limiting for login attempts
- [ ] Implement session timeout
- [ ] Add audit logging
- [ ] Use environment-specific secrets
- [ ] Add CSRF protection
- [ ] Implement password complexity requirements
