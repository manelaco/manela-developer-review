# Manela MVP - Parental Leave Management Platform

A modern web application for managing parental leave processes, built with Next.js, Supabase, and AI integration.

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-org/manela-mvp.git
cd manela-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration values.

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI, Anthropic, OpenRouter
- **Deployment**: Vercel

### Key Features
- Multi-tenant architecture
- Role-based access control
- Document management
- AI-powered policy generation
- Employee onboarding workflow
- Leave tracking and management

## 🔧 Configuration

### Required Environment Variables
- `NEXT_PUBLIC_APP_URL`: Your application URL
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key
- `OPENROUTER_API_KEY`: OpenRouter API key

### Database Setup
1. Create a new Supabase project
2. Import the schema from `schema.sql`
3. Set up the required tables and relationships
4. Configure Row Level Security (RLS) policies

## 🛠️ Development

### Project Structure
```
src/
├── components/     # React components
├── contexts/       # React contexts
├── hooks/         # Custom hooks
├── lib/           # Utility functions
├── pages/         # Next.js pages
└── styles/        # Global styles
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests

## 🔒 Security

- All sensitive data is stored in environment variables
- API keys are never exposed to the client
- Row Level Security (RLS) is implemented in Supabase
- Authentication is handled through Supabase Auth

## 📝 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For support, email support@example.com

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/555d2496-d96f-4a9e-bb37-298194227f01

## How can I edit this code?

There are several ways of editing your application.




