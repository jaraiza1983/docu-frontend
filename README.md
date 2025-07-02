# DocuCMS - Content and Project Management System

A modern React/TypeScript-based Content Management System (CMS) with project management capabilities, built with Vite and Bootstrap.

## 🚀 Features

### Content Management
- **Create, Edit, Delete** content with rich text editor (TinyMCE)
- **Category and Subcategory** organization
- **Priority-based** content ranking (1-100 scale)
- **Status management** (Draft, Published, Archived)
- **Tag-based** content organization
- **Author tracking** and content history

### Project Management
- **Project creation** and management
- **Status and Area** categorization
- **Priority-based** project ranking
- **Rich text descriptions** and objectives
- **Project history** tracking

### User Management
- **Role-based access control** (Admin, Creator)
- **User authentication** with JWT tokens
- **User registration** and management (Admin only)

### Technical Features
- **Modern React 18** with TypeScript
- **Vite** for fast development and building
- **Bootstrap 5** for responsive UI
- **JWT Authentication** with secure token management
- **API integration** with RESTful backend
- **Real-time form validation**
- **Responsive design** for all devices

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Bootstrap 5, Bootstrap Icons
- **Rich Text Editor**: TinyMCE
- **Authentication**: JWT Bearer Tokens
- **State Management**: React Hooks
- **HTTP Client**: Fetch API with interceptors
- **Build Tool**: Vite
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)
- A backend API server (see API Configuration)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jaraiza1983/docucms.git
   cd docucms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### API Configuration
The application expects a backend API server. Update the API base URL in:
- `src/config/api.ts` - API endpoints configuration
- `.env` file - Environment variables

### Backend Requirements
The backend should implement the API specification defined in `api-spec-new.json` with endpoints for:
- Authentication (login/register)
- Content management
- Project management
- User management
- Categories and subcategories

## 📁 Project Structure

```
docucms/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Content*.tsx    # Content management components
│   │   ├── Project*.tsx    # Project management components
│   │   ├── User*.tsx       # User management components
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── config/             # Configuration files
│   ├── types/              # TypeScript type definitions
│   └── data/               # Mock data (for development)
├── api-spec-new.json       # API specification
└── package.json
```

## 🎯 Usage

### Authentication
1. Navigate to the login page
2. Enter your credentials
3. The system will automatically redirect you to the dashboard

### Content Management
1. **View Content**: Browse all content in the content list
2. **Create Content**: Click "New Content" to create new content
3. **Edit Content**: Click the edit button on any content item
4. **Delete Content**: Use the delete button (with confirmation)

### Project Management
1. **View Projects**: Navigate to the projects section
2. **Create Projects**: Use the "New Project" button
3. **Manage Projects**: Edit, update status, and track progress

### User Management (Admin Only)
1. **View Users**: Access the users section (admin only)
2. **Create Users**: Add new users to the system
3. **Manage Roles**: Assign admin or creator roles

## 🔐 Role-Based Access

### Admin Role
- Full access to all features
- User management capabilities
- Can view and manage all content and projects
- Category and subcategory management

### Creator Role
- Content and project creation
- Edit own content and projects
- View published content
- Limited access to system settings

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Static Hosting
The built files in the `dist/` directory can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jorge Araiza** - [jaraiza1983](https://github.com/jaraiza1983)

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Bootstrap team for the UI framework
- TinyMCE team for the rich text editor

## 📞 Support

If you have any questions or need support, please:
1. Check the [Issues](https://github.com/jaraiza1983/docucms/issues) page
2. Create a new issue if your problem isn't already listed
3. Contact the maintainer

---

**Happy coding! 🎉**
