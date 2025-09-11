# Key Blog Frontend

A modern, full-featured blog application built with Next.js 15, React 19, and TypeScript. This project provides a complete blogging platform with authentication, post management, and a beautiful user interface.

## 🚀 Features

### Core Functionality

- **📝 Blog Post Management**: Create, read, update, and delete blog posts
- **🔐 User Authentication**: Secure login and registration system
- **👤 User Dashboard**: Personal dashboard for managing posts
- **📱 Responsive Design**: Mobile-first, responsive UI across all devices
- **🎨 Modern UI**: Clean, professional design with Tailwind CSS

### Technical Features

- **⚡ Next.js 15**: Latest Next.js with App Router and Turbopack
- **⚛️ React 19**: Latest React with modern hooks and patterns
- **🔷 TypeScript**: Full type safety throughout the application
- **🎯 API Integration**: RESTful API integration with proper error handling
- **📦 Component Library**: Reusable UI components with Radix UI
- **📅 Date Handling**: Advanced date formatting with date-fns
- **🎨 Styling**: Tailwind CSS with custom design system

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5.2
- **React**: 19.1.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.1.13
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns

### Development Tools

- **Build Tool**: Turbopack (Next.js)
- **Package Manager**: npm
- **Type Checking**: TypeScript
- **Code Formatting**: Built-in Next.js formatting

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   │   └── page.tsx             # Login/Register page
│   ├── dashboard/                # User dashboard
│   │   └── page.tsx             # Dashboard with post management
│   ├── post/[slug]/             # Dynamic post pages
│   │   └── page.tsx             # Individual post view
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── auth/                    # Authentication components
│   │   ├── login-form.tsx       # Login form
│   │   └── register-form.tsx    # Registration form
│   ├── blog/                    # Blog-specific components
│   │   ├── footer.tsx           # Site footer
│   │   ├── header.tsx           # Site header
│   │   ├── hero.tsx             # Hero section
│   │   ├── markdown-renderer.tsx # Markdown content renderer
│   │   ├── post-form.tsx        # Post creation/editing form
│   │   └── post-list.tsx        # Post listing component
│   └── ui/                      # Base UI components
│       ├── alert.tsx            # Alert component
│       ├── badge.tsx            # Badge component
│       ├── button.tsx           # Button component
│       ├── card.tsx             # Card component
│       ├── input.tsx            # Input component
│       ├── label.tsx            # Label component
│       ├── switch.tsx           # Switch component
│       ├── tabs.tsx             # Tabs component
│       └── textarea.tsx         # Textarea component
├── lib/                         # Utility libraries
│   ├── blog.ts                  # Legacy blog service (localStorage)
│   └── utils.ts                 # Utility functions
└── services/                    # API services
    ├── api.service.ts           # Base API configuration
    ├── auth.service.ts          # Authentication API
    └── post.service.ts          # Posts API
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API server running (see API configuration)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd key_blog_frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### API Configuration

The application connects to a backend API. Configure the API URL in your environment:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server

## 📱 Pages & Features

### Home Page (`/`)

- **Hero Section**: Welcome message and call-to-action
- **Post Listing**: Displays all published posts
- **Navigation**: Links to authentication and post viewing

### Authentication (`/auth`)

- **Login Form**: Email/password authentication
- **Registration Form**: New user registration
- **Redirect Support**: Supports `?redirect=` parameter for post-login navigation
- **Auto-redirect**: Redirects authenticated users away from auth page

### Dashboard (`/dashboard`)

- **Post Management**: Create, edit, delete posts
- **Statistics**: View post counts (total, published, drafts)
- **Tabbed Interface**: Organized view of posts and stats
- **Real-time Updates**: Immediate updates after operations

### Individual Posts (`/post/[slug]`)

- **Full Post View**: Complete post content with markdown rendering
- **Metadata Display**: Author, publication date, last updated
- **Navigation**: Back to posts, view more posts
- **Responsive Layout**: Optimized for all screen sizes

## 🔌 API Integration

### Authentication Service

```typescript
// Login
AuthService.login({ email, password });

// Registration
AuthService.register({ email, password, name });

// Get current user
AuthService.me();

// Logout
AuthService.logout();
```

### Posts Service

```typescript
// Get all posts
PostService.findAll({ published: "true" });

// Get post by slug
PostService.findOneBySlug(slug);

// Create post
PostService.create({ title, slug, content, published, tags });

// Update post
PostService.update(id, { title, slug, content, published, tags });

// Delete post
PostService.remove(id);
```

## 🎨 UI Components

### Design System

- **Colors**: Primary, secondary, muted, destructive variants
- **Typography**: Consistent font sizing and spacing
- **Spacing**: Tailwind's spacing scale
- **Shadows**: Subtle elevation system
- **Borders**: Consistent border radius and colors

### Component Library

Built with Radix UI primitives for accessibility and functionality:

- **Button**: Multiple variants (default, outline, ghost, destructive)
- **Card**: Content containers with header, content, footer
- **Input**: Form inputs with proper labeling
- **Tabs**: Tabbed navigation interface
- **Switch**: Toggle controls
- **Alert**: Notification and error messages
- **Badge**: Status indicators

## 🔒 Authentication Flow

1. **Login/Register**: Users authenticate via `/auth`
2. **Token Management**: JWT tokens handled via HTTP-only cookies
3. **Protected Routes**: Dashboard requires authentication
4. **Auto-redirect**: Authenticated users redirected from auth page
5. **Session Persistence**: Maintains login state across page refreshes

## 📝 Post Management

### Creating Posts

- **Title**: Required, auto-generates slug
- **Content**: Markdown support with live preview
- **Excerpt**: Auto-generated from content preview
- **Publishing**: Toggle between draft and published
- **Tags**: Optional categorization

### Post States

- **Draft**: Not visible to public, editable by author
- **Published**: Visible to all users, appears in listings
- **Author-only**: Drafts visible to post author in dashboard

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Deployment Platforms

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment option
- **Docker**: Containerized deployment available

## 🛠️ Development

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (if configured)
- **Component Structure**: Functional components with hooks

### State Management

- **React Hooks**: useState, useEffect for local state
- **API State**: Managed via service layer
- **Form State**: Controlled components with validation

### Error Handling

- **API Errors**: Centralized error handling in services
- **User Feedback**: Toast notifications and error messages
- **Fallback UI**: Graceful degradation for failed requests

## 📚 Dependencies

### Core Dependencies

- `next`: React framework with SSR/SSG
- `react`: UI library
- `typescript`: Type safety
- `axios`: HTTP client
- `date-fns`: Date manipulation
- `lucide-react`: Icon library

### UI Dependencies

- `@radix-ui/*`: Accessible UI primitives
- `tailwindcss`: Utility-first CSS
- `class-variance-authority`: Component variants
- `clsx`: Conditional class names
- `tailwind-merge`: Tailwind class merging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using Next.js, React, and TypeScript**
