import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import PriceManagement from './PriceManagement';
import BusinessHours from './BusinessHours';
import GalleryManagement from './GalleryManagement';
import TokenManagement from './TokenManagement';
import { DataService, Tenant } from '../services/DataService';

const BusinessSettings: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const [activeTab, setActiveTab] = useState('prices');
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadTenantData = async () => {
      if (!tenantId) {
        setError('מזהה עסק חסר');
        return;
      }
      try {
        const tenantData = await DataService.getTenantById(tenantId);
        setTenant(tenantData);
      } catch (err) {
        setError('נכשלה טעינת נתוני העסק. אנא נסה שוב מאוחר יותר.');
      }
    };
    loadTenantData();
  }, [tenantId]);

  const handleSave = async () => {
    if (!tenantId || !tenant) return;
    try {
      // כאן תוכל להוסיף לוגיקה לשמירת כל ההגדרות
      // לדוגמה:
      // await DataService.updateTenant(tenantId, updatedData);
      setSuccessMessage('ההגדרות נשמרו בהצלחה!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('שמירת ההגדרות נכשלה. אנא נסה שוב.');
    }
  };

  if (!tenant) {
    return <div className="text-center mt-10">טוען נתוני עסק...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">הגדרות עסק: {tenant.name}</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <div className="flex items-center">
            <AlertCircle className="mr-2" size={18} />
            <span>{error}</span>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span>{successMessage}</span>
        </div>
      )}
      <div className="mb-4">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('prices')}
            className={`px-3 py-2 rounded-md ${activeTab === 'prices' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
          >
            מחירון
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`px-3 py-2 rounded-md ${activeTab === 'hours' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
          >
            שעות פעילות
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-2 rounded-md ${activeTab === 'gallery' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
          >
            גלריה
          </button>
          <button
            onClick={() => setActiveTab('token')}
            className={`px-3 py-2 rounded-md ${activeTab === 'token' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
          >
            טוקן API
          </button>
        </nav>
      </div>
      <div className="mt-6">
        {activeTab === 'prices' && <PriceManagement tenantId={tenantId || ''} />}
        {activeTab === 'hours' && <BusinessHours tenantId={tenantId || ''} />}
        {activeTab === 'gallery' && <GalleryManagement tenantId={tenantId || ''} />}
        {activeTab === 'token' && <TokenManagement tenantId={tenantId || ''} token={tenant.apiToken || ''} />}
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
          שמור כל ההגדרות
        </button>
      </div>
    </div>
  );
};

export default BusinessSettings;