# PlayPulse ⚽

PlayPulse is a comprehensive sports management platform designed for football enthusiasts. It provides a complete ecosystem for turf booking, team management, live match tracking, and social interaction among football players.


## Live Site

[Play Pulse Live](https://playpulse-f7706.web.app/)

## 🚀 Features

### Core Functionality

- **🏟️ Turf Management**: Browse and book football turfs with real-time availability
- **👥 Team Creation**: Build and manage football teams with player profiles
- **📅 Match Scheduling**: Create, schedule, and manage football matches
- **🔴 Live Match Tracking**: Real-time match updates and statistics
- **📊 Player Statistics**: Track individual player performance and rankings
- **📱 Social Platform**: Share posts, interact with the football community

### User Management

- **🔐 Authentication**: Email/password and Google OAuth integration
- **👤 User Profiles**: Customizable player profiles with avatars
- **📋 Booking History**: Track personal turf bookings and match participation
- **🏆 Leaderboards**: Player rankings based on performance metrics

### Admin Features

- **⚙️ Admin Panel**: Complete administrative control
- **📢 Announcements**: Broadcast important updates to users
- **📈 Booking Management**: Monitor and manage all turf bookings
- **🎮 Match Control**: Start, pause, and end live matches

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS
- **React Router DOM** - Client-side routing
- **Material-UI** - React component library
- **Framer Motion** - Animation library
- **Socket.io Client** - Real-time communication
- **Firebase** - Authentication and hosting
- **SweetAlert2** - Beautiful alerts and modals

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Socket.io** - Real-time bidirectional communication
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server auto-reload
- **Railway** - Deployment platform

## 📁 Project Structure

```
PlayPulse/
├── Client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── AddPlayerModal.jsx
│   │   │   ├── AddTurf.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── AuthProvider.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Turf.jsx
│   │   │   ├── TurfDetails.jsx
│   │   │   ├── MatchManagement.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── MyProfile.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PlayerSection.jsx
│   │   │   ├── TeamCreate.jsx
│   │   │   └── ...
│   │   ├── assets/         # Static assets
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Application entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Public assets
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── firebase.json       # Firebase configuration
├── Server/                 # Backend Node.js application
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   └── Railway.json        # Railway deployment configuration
└── README.md              # Project documentation
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v20 or higher)
- **npm**
- **MongoDB** database
- **Firebase** project (for authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/PlayPulse.git
   cd PlayPulse
   ```
2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd Client
   npm install

   # Install server dependencies
   cd ../Server
   npm install
   ```
4. **Firebase Configuration**

   Create `firebase.init.js` in the Client directory:

   ```javascript
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";

   const firebaseConfig = {
     // Your Firebase configuration
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd Server
   npm run start
   ```
2. **Start the frontend development server**

   ```bash
   cd Client
   npm run dev
   ```

### For Players

1. **Register/Login** using email or Google account
2. **Browse Turfs** and check availability
3. **Book Time Slots** for your preferred turf
4. **Create Teams** and invite players
5. **Schedule Matches** with other teams
6. **Track Statistics** and improve your rankings
7. **Share Posts** and engage with the community

### For Admins

1. **Access Admin Panel** with admin credentials
2. **Add New Turfs** to the platform
3. **Manage Announcements** for all users
4. **Monitor Bookings** and resolve conflicts
5. **Control Live Matches** and update statistics

## 📊 Database Schema

### Collections

- **Users**: Player profiles and authentication data
- **Turfs**: Football turf information and availability
- **Bookings**: Turf reservation records
- **Matches**: Match schedules and results
- **Players**: Player statistics and performance data
- **Posts**: Social media content
- **Announcements**: Admin broadcast messages

## 🔄 API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/google` - Google OAuth

### Turfs

- `GET /turfs` - Get all turfs
- `POST /turfs` - Add new turf (Admin)
- `POST /turfs/:id/book` - Book turf slot
- `DELETE /turfs/:id/cancel` - Cancel booking

### Matches

- `GET /matches` - Get all matches
- `POST /matches` - Create new match
- `PATCH /matches/:id/start` - Start match
- `PATCH /matches/:id/end` - End match
- `PATCH /matches/:id/stats` - Update match statistics

### Players

- `GET /players` - Get all players
- `POST /players` - Add new player
- `PUT /players/:id` - Update player profile

## 🔐 Authentication & Security

- **Firebase Authentication** for secure user management
- **Input Validation** on all endpoints
- **CORS Configuration** for secure cross-origin requests
- **Environment Variables** for sensitive configuration

## 🚀 Deployment

### Frontend (Firebase Hosting)

```bash
cd Client
npm run build
# Deploy to your preferred hosting platform
```

### Backend (Vercel)

```bash
cd Server
# Configure Railway.json for deployment
npm i -g @railway/cli
railway login
railway up
```

## 🤝 Contributing

1. **Fork** the project
2. Create your **feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: React, Tailwind CSS, Firebase
- **Backend Development**: Node.js, Express, MongoDB
- **Real-time Features**: Socket.io integration
- **UI/UX Design**: Modern, responsive design principles

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/yourusername/PlayPulse/issues) page to report bugs or request new features.

## 📱 Mobile Responsiveness

PlayPulse is fully responsive and optimized for:

- 📱 Mobile devices
- 📱 Tablets
- 💻 Desktop computers
- 🖥️ Large screens

## 🔄 Future Enhancements

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Tournament management system
- [ ] Payment integration
- [ ] Chat messaging system
- [ ] Video streaming for live matches
- [ ] AI-powered match recommendations
- [ ] Multi-language support

## 📞 Support

For support and questions, please contact:

- **Email**: u2004046@student.cuet.ac.bd
  u2004063@student.cuet.ac.bd
  u2004053@student.cuet.ac.bd
  u2004036@student.cuet.ac.bd
  u2004080@student.cuet.ac.bd
- **GitHub Issues**: https://github.com/SaimumAoyon1134/PlayPulse/issues

---

**Made with ⚽ for football lovers by football lovers**
