# Dissertation Scaffold - Demo Flow

This document describes the complete demo flow for the Dissertation Scaffold application with mocked authentication and data.

## Demo Authentication

The application uses mocked authentication that imitates the real NextAuth.js flow but stores data in Jotai with localStorage persistence. The flow includes:

- **Sign up** with any email and password (account created and activated immediately)
- **Sign in** with email and password
- **Demo user** available: `demo@example.com` with password `password123`

## Complete Demo Flow

### 1. Home Page (`/`)
- Enter a research topic (e.g., "AI Ethics in Healthcare")
- Click "Evaluate Now" button
- This will redirect you to the evaluation page

### 2. Evaluation Page (`/evaluation`)
- View the comprehensive evaluation of your research topic
- See scores across 6 key academic metrics
- If not signed in: Click "Sign In to Create Timeline"
- If signed in: Click "Create Timeline" to proceed

### 2.5. Authentication Flow (if needed)
- **Sign Up**: Create account (activated immediately)
- **Sign In**: Use email and password

### 3. Timeline Creation (`/student/timelines?create=true`)
- Automatically opens the timeline creation modal
- Select document type (Research Proposal or Dissertation)
- Configure timeline settings (dates, academic level, discipline)
- Customize section durations
- Create the timeline

### 4. Writing Sections (`/student/new`)
- After creating a timeline, you can start writing
- Each section has specific guidelines and requirements
- Track your progress and word count
- Mark sections as complete when ready

## Mocked Data

All data is stored locally using Jotai atoms with localStorage persistence, imitating the real NextAuth.js + Prisma structure:

- **User Database**: Mocked user table with hashed passwords
- **Authentication State**: User sessions, login/logout
- **Timeline Data**: Research timelines, sections, progress
- **User Data**: Profile information, preferences, account status

## File Structure

```
app/
├── page.tsx                    # Home page with research topic input
├── evaluation/                 # Evaluation results page
├── signin/                     # Sign in page
├── signup/                     # Sign up page
├── student/                    # Protected student routes
│   ├── dashboard/             # Student dashboard
│   ├── timelines/             # Timeline management
│   └── new/                   # Document writing interface
└── components/                 # Reusable components

lib/
├── stores/
│   ├── authStore.ts          # Mocked authentication store
│   ├── timelineStore.ts      # Timeline data store
│   └── signupStore.ts        # Signup form state
```

## Backend Integration

When ready to integrate with a real backend:

1. **Replace authStore.ts** with NextAuth.js or similar
2. **Update timelineStore.ts** to use API calls instead of local state
3. **Modify signup/signin pages** to use real authentication
4. **Update middleware.ts** to use proper session validation

## Demo Credentials

For quick testing:
- **Email**: `demo@example.com`
- **Password**: `password123`

Or create a new account through the signup flow.

## Features Demonstrated

- ✅ Mocked authentication with Jotai
- ✅ Protected routes with middleware
- ✅ Research topic evaluation
- ✅ Timeline creation and management
- ✅ Document writing interface
- ✅ Progress tracking
- ✅ Responsive design with dark/light themes
- ✅ Form validation with Zod schemas
- ✅ Local storage persistence
