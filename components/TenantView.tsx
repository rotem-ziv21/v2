import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataService, Tenant } from '../services/DataService';
import { AlertCircle, ArrowLeft, Calendar, Clock, DollarSign, User, Scissors, Star, Gift, Camera, Settings, BarChart, Home, Grid, UserCircle } from 'lucide-react';
import BookAppointment from './BookAppointment';
import PastAppointments from './PastAppointments';
import PriceList from './PriceList';
import Statistics from './Statistics';
import { GalleryProvider } from '../contexts/GalleryContext';
import ProfileSection from './ProfileSection';

const TenantView: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [contactId, setContactId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTenantData = async () => {
      if (!tenantId) {
        setError('מזהה עסק חסר');
        setIsLoading(false);
        return;
      }
      try {
        const tenantData = await DataService.getTenantById(tenantId);
        setTenant(tenantData);
        // כאן תוכל להוסיף קריאות נוספות לטעינת מידע ספציפי לעסק
        // לדוגמה: const appointments = await DataService.getTenantAppointments(tenantId);
      } catch (err) {
        setError('נכשלה טעינת נתוני העסק. אנא נסה שוב מאוחר יותר.');
      } finally {
        setIsLoading(false);
      }
    };
    loadTenantData();
  }, [tenantId]);

  const updateContactId = (newContactId: string | null) => {
    setContactId(newContactId);
    if (newContactId) {
      localStorage.setItem(`contactId_${tenantId}`, newContactId);
    } else {
      localStorage.removeItem(`contactId_${tenantId}`);
    }
  };

  const updateUserName = (newUserName: string | null) => {
    setUserName(newUserName);
    if (newUserName) {
      localStorage.setItem(`userName_${tenantId}`, newUserName);
    } else {
      localStorage.removeItem(`userName_${tenantId}`);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'book':
        return <BookAppointment contactId={contactId} tenantId={tenantId || ''} />;
      case 'past':
        return <PastAppointments tenantId={tenantId || ''} />;
      case 'prices':
        return <PriceList tenantId={tenantId || ''} />;
      case 'statistics':
        return <Statistics tenantId={tenantId || ''} />;
      case 'profile':
        return (
          <ProfileSection
            setContactId={updateContactId}
            onClose={() => setActiveSection('')}
            updateUserName={updateUserName}
            tenantId={tenantId || ''}
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

  if (isLoading) {
    return <div className="text-center mt-10">טוען נתוני עסק...</div>;
  }

  if (!tenant) {
    return <div className="text-center mt-10 text-red-600">לא נמצאו נתוני עסק</div>;
  }

  return (
    <GalleryProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={() => navigate('/admin')} className="mr-4">
                <ArrowLeft size={24} />
              </button>
              <Scissors className="text-blue-500 mr-2 animate-pulse" size={28} />
              <h1 className="text-2xl font-bold gradient-text">{tenant.name}</h1>
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
                onClick={() => navigate(`/business-settings/${tenantId}`)}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
                title="הגדרות עסק"
              >
                <Settings size={24} />
              </button>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-grow">
          {activeSection ? (
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
          )}
        </main>
        <footer className="bg-white shadow-md mt-auto">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-around">
              <button 
                onClick={() => setActiveSection('')}
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

export default TenantView;