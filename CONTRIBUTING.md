# Contributing to Website Service

Terima kasih telah tertarik untuk berkontribusi pada Website Service! 🎉

## 🤝 Cara Berkontribusi

### 1. Fork Repository
1. Klik tombol "Fork" di repository ini
2. Clone repository yang sudah di-fork ke komputer Anda
```bash
git clone https://github.com/your-username/website-service.git
cd website-service
```

### 2. Setup Development Environment
```bash
# Install dependencies
npm install

# Setup environment variables
cp env.example .env.local
# Edit .env.local dengan Supabase credentials Anda

# Run development server
npm run dev
```

### 3. Buat Branch untuk Feature
```bash
# Buat branch baru
git checkout -b feature/amazing-feature

# atau untuk bug fix
git checkout -b fix/bug-description
```

### 4. Development Guidelines

#### Code Style
- Gunakan TypeScript untuk semua file
- Ikuti ESLint configuration yang sudah ada
- Gunakan Prettier untuk formatting
- Tulis komentar yang jelas untuk kode kompleks

#### Commit Messages
Gunakan format conventional commits:
```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

#### Testing
```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

### 5. Pull Request Process

#### Sebelum Submit PR
- [ ] Code sudah di-test dan berfungsi
- [ ] Tidak ada linting errors
- [ ] TypeScript compilation berhasil
- [ ] Documentation sudah diupdate jika perlu
- [ ] Commit messages sudah sesuai format

#### Submit Pull Request
1. Push branch ke repository Anda
```bash
git push origin feature/amazing-feature
```

2. Buat Pull Request di GitHub
3. Isi template PR dengan detail yang jelas
4. Assign reviewer jika ada
5. Tunggu review dan feedback

## 📋 Development Workflow

### 1. Feature Development
```bash
# 1. Buat branch
git checkout -b feature/user-notifications

# 2. Develop feature
# ... coding ...

# 3. Test feature
npm run dev
# Test di browser

# 4. Commit changes
git add .
git commit -m "feat: add user notification system"

# 5. Push dan buat PR
git push origin feature/user-notifications
```

### 2. Bug Fix
```bash
# 1. Buat branch
git checkout -b fix/payment-upload-bug

# 2. Fix bug
# ... coding ...

# 3. Test fix
npm run dev
# Test scenario yang bermasalah

# 4. Commit fix
git add .
git commit -m "fix: resolve payment upload validation issue"

# 5. Push dan buat PR
git push origin fix/payment-upload-bug
```

## 🎯 Areas for Contribution

### High Priority
- 🐛 Bug fixes
- 📚 Documentation improvements
- 🧪 Test coverage
- 🚀 Performance optimizations
- 🔒 Security improvements

### Medium Priority
- ✨ New features
- 🎨 UI/UX improvements
- 📱 Mobile responsiveness
- 🌐 Internationalization
- 📊 Analytics integration

### Low Priority
- 🔧 Development tools
- 📝 Code comments
- 🎨 Design system
- 📈 Monitoring tools

## 🛠 Development Setup

### Prerequisites
- Node.js 18+
- npm atau yarn
- Git
- Supabase account

### Project Structure
```
website-service/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── admin/              # Admin pages
│   ├── dashboard/          # User dashboard
│   ├── api/                # API routes
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ui/                 # UI components
│   └── layout/             # Layout components
├── lib/                    # Utilities
│   ├── supabase.ts        # Supabase client
│   ├── auth.ts             # Auth utilities
│   └── utils.ts            # Helper functions
├── supabase/               # Database schema
└── middleware.ts           # Route protection
```

### Key Files
- `lib/supabase.ts` - Supabase configuration
- `lib/auth.ts` - Authentication utilities
- `middleware.ts` - Route protection
- `supabase/schema.sql` - Database schema
- `components/ui/` - Reusable UI components

## 🧪 Testing

### Manual Testing
```bash
# Start development server
npm run dev

# Test user flow
1. Register new user
2. Create order
3. Upload payment proof
4. Check admin dashboard
5. Verify order status
```

### Automated Testing
```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

## 📝 Documentation

### Code Documentation
- Tulis JSDoc untuk functions
- Comment complex logic
- Update README jika ada perubahan setup

### API Documentation
- Update `API.md` untuk perubahan API
- Document new endpoints
- Update request/response examples

## 🐛 Bug Reports

### Before Reporting
1. Cek existing issues
2. Test dengan latest version
3. Cek browser console untuk errors
4. Cek Supabase logs

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g. Windows, macOS, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]

**Screenshots**
If applicable, add screenshots

**Additional Context**
Any other context about the problem
```

## ✨ Feature Requests

### Before Requesting
1. Cek existing features
2. Cek roadmap
3. Cek similar issues

### Feature Request Template
```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternatives**
Any alternative solutions considered?

**Additional Context**
Any other context about the feature request
```

## 🏷 Release Process

### Version Numbering
- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features
- **Patch** (0.0.1): Bug fixes

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped
- [ ] Release notes written

## 📞 Support

### Getting Help
1. Cek documentation
2. Cek existing issues
3. Cek discussions
4. Create new issue jika perlu

### Contact
- GitHub Issues: Untuk bug reports dan feature requests
- GitHub Discussions: Untuk pertanyaan umum
- Email: [your-email@example.com]

## 🎉 Recognition

Contributors akan diakui di:
- README.md contributors section
- Release notes
- GitHub contributors page

## 📄 License

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah MIT License.

---

**Terima kasih telah berkontribusi! 🙏**

