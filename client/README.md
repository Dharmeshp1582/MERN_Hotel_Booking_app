# QuickStay - Hotel Booking App

QuickStay is a modern hotel booking web application that allows users to discover, search, and book luxury hotels and rooms worldwide. Built with React, Vite, and TailwindCSS, QuickStay offers a seamless and visually appealing experience for both guests and hotel owners.

---

## Table of Contents

- [QuickStay - Hotel Booking App](#quickstay---hotel-booking-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Screenshots](#screenshots)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [or](#or)

---

## Features

- 🌍 **Browse Hotels:** Explore featured destinations and exclusive offers.
- 🔍 **Search & Filter:** Search hotels by city, date, and guests. Filter by room type, price, and amenities.
- 🏨 **Room Details:** View detailed information, images, and amenities for each room.
- 📝 **Bookings:** Manage your bookings, view payment status, and pay online.
- 🧑‍💼 **Hotel Owner Dashboard:** Add, list, and manage rooms. Track bookings and revenue.
- 🔐 **Authentication:** Secure login/signup powered by Clerk.
- 📬 **Newsletter:** Subscribe for updates and offers.
- 💬 **Testimonials:** Read reviews from real guests.
- 📱 **Responsive Design:** Fully responsive for mobile, tablet, and desktop.

---

## Screenshots

> _Add screenshots or GIFs here to showcase the UI and features._

---

## Tech Stack

- **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Linting:** [ESLint](https://eslint.org/)
- **Icons & Assets:** Custom SVGs and Unsplash images

---

## Project Structure



---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Dharmeshp1582/MERN_Hotel_Booking_app

2. **Install dependencies:**
     ```sh
     npm install
     # or
     yarn install
     ```

3.**Set up environment variables:**

Create a .env file in the client/ directory and add your Clerk publishable key:
    
    
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
  
4.**Start the development server:**
npm run dev
# or
yarn dev


Available Scripts
npm run dev – Start the development server with hot reloading.
npm run build – Build the app for production.
npm run preview – Preview the production build locally.
npm run lint – Run ESLint to check for code issues.
Environment Variables
Variable	Description
VITE_CLERK_PUBLISHABLE_KEY	Clerk publishable key for auth
Folder Overview
src/assets/assets.js
Contains all static assets, dummy data for hotels, rooms, users, and configuration for icons and cities.

src/components/
Reusable UI components such as Navbar, Footer, Hero, HotelCard, Testimonials, NewsLetter, etc.

src/pages/
Page components for Home, AllRooms, RoomDetail, MyBookings, and hotel owner dashboard pages.

src/pages/hotelOwner/
Components and pages specific to hotel owners (Dashboard, AddRoom, ListRoom, Layout).

