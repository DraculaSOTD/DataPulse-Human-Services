# DataPulse AI Website

A modern, fullstack website for DataPulse AI featuring animated backgrounds, smooth transitions, and comprehensive information about the company's AI and software development partnership services.

## Features

- **Animated Background**: Dynamic particle system with data pulse effects that changes based on the current section
- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: Built with Framer Motion for fluid page transitions and interactions
- **Modern Stack**: React + Vite frontend with Express backend
- **Multiple Pages**:
  - Home: Hero section, problem statement, solution overview, and Acceleration Engine details
  - Services: Pricing, service details, and value comparison
  - About: Company philosophy, track record, and team information
  - Contact: Contact form with backend integration

## Tech Stack

### Frontend
- React 19
- Vite 7
- Framer Motion (animations)
- React Router DOM (routing)
- CSS3 (custom styling)

### Backend
- Express 5
- Node.js
- CORS
- Body Parser

## Installation

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
cd ..
```

## Running the Application

### Development Mode (Both Frontend and Backend)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:3000`

### Backend Only
```bash
npm run server
```

### Frontend Only
```bash
npm run client
```

### Production
```bash
npm start
```

## Project Structure

```
DataPulse-Human-Services/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── animations/    # Animated background components
│   │   ├── components/    # Reusable components (Navigation)
│   │   ├── pages/         # Page components (Home, Services, About, Contact)
│   │   ├── styles/        # Global styles
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── vite.config.js     # Vite configuration
├── server/                # Backend Express application
│   ├── controllers/       # Request handlers
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
└── package.json          # Root package configuration
```

## Color Scheme

The website uses a dark, professional color palette with cyan and blue accents:
- Primary Cyan: `#0fd5ce`
- Primary Blue: `#0096ff`
- Secondary Green: `#3cb371`
- Accent Purple: `#8a2be2`
- Dark Navy: `#0a192f`
- Light Navy: `#112240`

## Animated Background Themes

The background dynamically changes based on the section:
- **Default**: Cyan/blue pulse
- **Problem**: Red-tinted warning theme
- **Solution**: Green-tinted success theme
- **Acceleration**: Purple-tinted innovation theme

## Contact Form

The contact form is fully functional and connected to the backend API. In production, you would integrate it with:
- Email service (SendGrid, AWS SES, etc.)
- CRM system (Salesforce, HubSpot, etc.)
- Database storage

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

## Contact

- Email: arthur@datapulseai.co
- Email: info@datapulseai.co
