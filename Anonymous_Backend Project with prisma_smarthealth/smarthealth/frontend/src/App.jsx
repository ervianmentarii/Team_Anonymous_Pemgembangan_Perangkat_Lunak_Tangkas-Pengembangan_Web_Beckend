import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Services from './components/Services';
import Doctors from './components/Doctors';
import DoctorDetail from './components/DoctorDetail';
import DoctorSchedule from './components/DoctorSchedule';
import Appointments from './components/Appointments';
import AppointmentHistory from './components/AppointmentHistory';
import HealthRecords from './components/HealthRecords';
import Contact from './components/Contact';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import StaffDashboard from './components/StaffDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/doctor-schedule" element={<DoctorSchedule />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointment-history" element={<AppointmentHistory />} />
            <Route path="/health-records" element={<HealthRecords />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
