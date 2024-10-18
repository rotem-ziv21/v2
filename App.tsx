import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, User, Scissors, Star, Gift, Camera, Settings, BarChart, Home, Grid, UserCircle } from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import BookAppointment from './components/BookAppointment';
import PastAppointments from './components/PastAppointments';
import PriceList from './components/PriceList';
import AdminDashboard from './components/AdminDashboard';
import Statistics from './components/Statistics';
import { GalleryProvider } from './contexts/GalleryContext';
import ProfileSection from './components/ProfileSection';
import { useTenant } from './contexts/TenantContext';
import BusinessSetup from './components/BusinessSetup';
import Login from './components/Login';
import BusinessSettings from './components/BusinessSettings';
import TeamManagement from './components/TeamManagement';
import TenantView from './components/TenantView';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('');
  const [token, setToken] = useState('');
  const [contactId, setContactId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const { currentTenant } = useTenant();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedContactId = localStorage.getItem('contactId');
    const storedUserName = localStorage.getItem('userName');
    if (storedToken) setToken(storedToken);
    if (storedContactId) setContactId(storedContactId);
    if (storedUserName) setUserName(storedUserName);
  }, []);

  const updateContactId = (newContactId: string | null) => {
    setContactId(newContactId);
    if (newContactId) {
      localStorage.setItem('contactId', newContactId);
    } else {
      localStorage.removeItem('contactId');
    }
  };

  const updateUserName = (newUserName: string | null) => {
    setUserName(newUserName);
    if (newUserName) {
      localStorage.setItem('userName', newUserName);
    } else {
      localStorage.removeItem('userName');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'book':
        return <BookAppointment contactId={contactId} />;
      case 'past':
        return <PastAppointments />;
      case 'prices':
        return <PriceList />;
      case 'admin':
        return <AdminDashboard />;
      case 'statistics':
        return <Statistics />;
      case 'profile':
        return (
          <ProfileSection
            setContactId={updateContactId}
            onClose={() => setActiveSection('')}
            updateUserName={updateUserName}
          />
        );
      default:
        return null;
    }
  };

  const menuItems = [
    { id: 'book', title: 'קביעת תור', icon: Calendar, color: 'from-blue-400 to-blue-600' },
    { id: 'past', title: 'תורים קודמים', icon: Clock, color: 'from-green-400 to-green-600' },
    { id: 'prices', title: 'מחירון', icon: DollarSign, color: 'from-yellow-400 to-yellow-600' },
  ];

  if (!currentTenant) {
    return <BusinessSetup />;
  }

  return (
    <GalleryProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Scissors className="text-blue-500 mr-2 animate-pulse" size={28} />
              <h1 className="text-2xl font-bold gradient-text">יופי בלחיצה</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="text-gray-600 hover:text-gray-800 transition-colors duration-300">
                <Gift size={24} />
              </button>
              <button 
                onClick={() => setActiveSection('profile')}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
              >
                <User size={24} />
              </button>
              <button 
                onClick={() => navigate('/admin')}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
                title="כניסת מנהל"
              >
                <Settings size={24} />
              </button>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/business-settings/:tenantId" element={<BusinessSettings />} />
            <Route path="/team-management/:tenantId" element={<TeamManagement />} />
            <Route path="/tenant-view/:tenantId" element={<TenantView />} />
            <Route path="/" element={
              activeSection ? (
                <div className="animate-fadeIn">
                  <button
                    onClick={() => setActiveSection('')}
                    className="mb-4 text-gray-600 hover:text-gray-800 flex items-center transition-colors duration-300"
                  >
                    <span className="ml-1">חזרה</span>
                    &rarr;
                  </button>
                  {renderSection()}
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="חיפוש שירות או מיקום"
                      className="w-full p-3 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`bg-gradient-to-r ${item.color} rounded-lg shadow-sm p-6 flex flex-col items-center justify-center transition duration-300 hover:shadow-md animate-fadeIn hover:scale-105`}
                      >
                        <item.icon className="text-white mb-2" size={32} />
                        <span className="text-white font-semibold">{item.title}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-12 animate-slideIn">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 gradient-text">העבודות שלנו</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* כאן תוכל להוסיף את התמונות מהגלריה */}
                    </div>
                  </div>
                </div>
              )
            } />
          </Routes>
        </main>
        <footer className="bg-white shadow-md mt-auto">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-around">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-blue-500 flex flex-col items-center transition-colors duration-300"
              >
                <Home size={24} />
                <span className="text-xs mt-1">בית</span>
              </button>
              <button 
                onClick={() => setActiveSection('prices')}
                className="text-gray-600 hover:text-blue-500 flex flex-col items-center transition-colors duration-300"
              >
                <Grid size={24} />
                <span className="text-xs mt-1">שירותים</span>
              </button>
              <button 
                onClick={() => setActiveSection('book')}
                className="text-gray-600 hover:text-blue-500 flex flex-col items-center transition-colors duration-300"
              >
                <Calendar size={24} />
                <span className="text-xs mt-1">תורים</span>
              </button>
              <button 
                onClick={() => setActiveSection('profile')}
                className="text-gray-600 hover:text-blue-500 flex flex-col items-center transition-colors duration-300"
              >
                <UserCircle size={24} />
                <span className="text-xs mt-1">פרופיל</span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </GalleryProvider>
  );
};

export default App;