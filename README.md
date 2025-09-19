# Alumverse - SRM IST Alumni Platform

A comprehensive digital platform connecting students, alumni, faculty, and committee members at SRM Institute of Science and Technology.

## 🚀 Features

### For Students:
- **Smart Alumni Directory** - Search alumni by skills, company, batch, location
- **Profile Management** - Edit CGPA, projects, internships, certifications
- **Meeting Requests** - Request meetings with alumni for career guidance
- **Collaboration Hub** - Pitch startup ideas and research projects
- **Analytics Dashboard** - Track engagement and progress

### For Alumni:
- **SRM Events** - View upcoming events and functions
- **Student Profiles** - Connect with students and offer mentorship
- **Meeting Management** - Accept/decline student meeting requests
- **Collaboration Requests** - Review and respond to student pitches
- **Alumni Feed** - Post updates visible to all users

### For Faculty:
- **Student Monitoring** - Track student progress and engagement
- **Analytics** - View comprehensive metrics and reports

### For Committee:
- **Event Management** - Create and manage events with calendar view
- **Alumni Engagement** - Invite alumni for talks and mentorship
- **Funding & Scholarships** - Post and track scholarship applications
- **Communication Hub** - Send announcements to specific groups
- **Approvals & Oversight** - Approve/reject student proposals
- **Committee Members** - Manage main and student committee members

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Architecture**: Single Page Application (SPA)
- **Storage**: LocalStorage for state management
- **Styling**: Custom CSS with glassmorphism effects
- **Icons**: Material Design icons

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd alumverse
   ```

2. **Start local server**
   ```bash
   python -m http.server 3000
   # or
   npx serve .
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

## 👥 User Roles

- **Student** - Access to directory, profiles, meetings, collaboration
- **Alumni** - Access to events, student profiles, meeting management
- **Faculty** - Access to monitoring dashboard and analytics
- **Committee** - Full access to management dashboard

## 🎨 Design Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean, professional interface with gradient backgrounds
- **Role-based Access** - Different views for different user types
- **Interactive Elements** - Smooth animations and transitions

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔧 Development

The application is built as a static website with no backend dependencies. All data is stored in localStorage and mock data files.

### File Structure
```
├── index.html          # Main HTML file
├── app.js             # JavaScript application logic
├── styles.css         # Main stylesheet
├── mock-data.js       # Sample data
└── README.md          # This file
```

## 🌐 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main`)
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify
1. Connect your GitHub repository
2. Deploy automatically on every push
3. Custom domain support available

### Vercel
1. Import your GitHub repository
2. Automatic deployments
3. Global CDN included

## 📄 License

This project is created for SRM IST Hackathon 3.0.

## 🤝 Contributing

This is a hackathon project. For improvements or suggestions, please contact the development team.

---

**Built with ❤️ for SRM Institute of Science and Technology**
