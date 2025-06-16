# Manela Developer Guide

## 🔑 Access and Setup

### Repository Access
1. You've been granted access to this private repository
2. Clone using: `git clone https://github.com/yourusername/manela-developer-review.git`
3. Create a new branch for your work: `git checkout -b feature/your-feature-name`

### Development Environment
1. **Node.js Setup**
   ```bash
   # Install Node.js 18.x or later
   nvm install 18
   nvm use 18
   ```

2. **Database Setup**
   ```bash
   # Create a new Supabase project
   # Import the schema
   psql -U your_user -d your_database -f database-schema.sql
   ```

3. **Environment Configuration**
   ```bash
   # Copy example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your values
   # Required values are marked with * in .env.example
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 13+ (App Router)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: OpenAI, Anthropic, OpenRouter

### Key Features
- Multi-tenant architecture
- Role-based access control
- Document management
- AI-powered policy generation
- Employee onboarding workflow

## 🔧 Development Workflow

### 1. Code Structure
```
src/
├── app/              # Next.js 13 app directory
├── components/       # React components
├── lib/             # Utility functions
├── types/           # TypeScript types
└── styles/          # Global styles
```

### 2. Development Process
1. Create feature branch
2. Implement changes
3. Write tests
4. Create PR
5. Get review
6. Merge to main

### 3. Testing
```bash
# Run tests
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 🔒 Security Guidelines

### 1. Environment Variables
- Never commit `.env` files
- Use `.env.example` as template
- Keep API keys secure
- Rotate keys regularly

### 2. Database Security
- Use Row Level Security (RLS)
- Follow principle of least privilege
- Sanitize all user inputs
- Use parameterized queries

### 3. API Security
- Validate all inputs
- Implement rate limiting
- Use HTTPS only
- Sanitize error messages

## 📝 API Documentation

### Authentication Endpoints
```typescript
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/session
```

### Employee Management
```typescript
GET /api/employees
POST /api/employees
PUT /api/employees/:id
DELETE /api/employees/:id
```

### Policy Management
```typescript
POST /api/policies/generate
GET /api/policies/:id
PUT /api/policies/:id
```

## 🔍 Troubleshooting

### Common Issues
1. **Database Connection**
   - Check Supabase credentials
   - Verify database URL
   - Check network access

2. **Authentication**
   - Verify JWT token
   - Check role permissions
   - Validate session

3. **API Issues**
   - Check request format
   - Verify API keys
   - Check rate limits

### Debugging Tools
- Browser DevTools
- Network tab
- Console logs
- API testing tools

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

### Support
- Create an issue in the repository
- Tag with appropriate labels
- Provide detailed description
- Include error logs if applicable

## ⚠️ Important Notes

1. This is a sanitized version of the codebase
2. No production data is included
3. API keys are placeholders
4. Database schema is structure-only

## 🔐 Security Checklist

Before deploying:
- [ ] All environment variables set
- [ ] API keys configured
- [ ] Database security enabled
- [ ] Input validation implemented
- [ ] Error handling in place
- [ ] Logging configured
- [ ] CORS settings correct
- [ ] Rate limiting enabled 