import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { DataService } from '../services/DataService';

interface TokenManagementProps {
  tenantId: string;
  token: string;
}

const TokenManagement: React.FC<TokenManagementProps> = ({ tenantId, token: initialToken }) => {
  const [token, setToken] = useState(initialToken);
  const [locationId, setLocationId] = useState('');
  const [calendarId, setCalendarId] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTokenData();
  }, [tenantId]);

  const loadTokenData = async () => {
    try {
      // כאן צריך להיות קריאה לשרת להביא את נתוני הטוקן של העסק הספציפי
      // לדוגמה: const tokenData = await DataService.getTenantTokenData(tenantId);
      // setToken(tokenData.token);
      // setLocationId(tokenData.locationId);
      // setCalendarId(tokenData.calendarId);
      
      // בינתיים, נשתמש בנתונים מקומיים
      const storedLocationId = localStorage.getItem(`locationId_${tenantId}`);
      const storedCalendarId = localStorage.getItem(`calendarId_${tenantId}`);
      if (storedLocationId) setLocationId(storedLocationId);
      if (storedCalendarId) setCalendarId(storedCalendarId);
    } catch (error) {
      console.error('Error loading token data:', error);
      setError('טעינת נתוני הטוקן נכשלה. אנא נסה שוב מאוחר יותר.');
    }
  };

  const handleSave = async () => {
    try {
      // כאן צריך להיות קריאה לשרת לשמור את נתוני הטוקן
      // לדוגמה: await DataService.updateTenantTokenData(tenantId, { token, locationId, calendarId });
      
      // בינתיים, נשמור בלוקל סטורג'
      localStorage.setItem(`token_${tenantId}`, token);
      localStorage.setItem(`locationId_${tenantId}`, locationId);
      localStorage.setItem(`calendarId_${tenantId}`, calendarId);
      
      setSaveMessage('השינויים נשמרו בהצלחה!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving token data:', error);
      setError('שמירת נתוני הטוקן נכשלה. אנא נסה שוב.');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">ניהול טוקן API</h3>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <div className="flex items-center">
            <AlertCircle className="mr-2" size={18} />
            <span>{error}</span>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
            טוקן API
          </label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="הזן את טוקן ה-API כאן"
          />
        </div>
        <div>
          <label htmlFor="locationId" className="block text-sm font-medium text-gray-700 mb-1">
            מזהה מיקום (Location ID)
          </label>
          <input
            type="text"
            id="locationId"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="הזן את מזהה המיקום כאן"
          />
        </div>
        <div>
          <label htmlFor="calendarId" className="block text-sm font-medium text-gray-700 mb-1">
            מזהה לוח שנה (Calendar ID)
          </label>
          <input
            type="text"
            id="calendarId"
            value={calendarId}
            onChange={(e) => setCalendarId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="הזן את מזהה לוח השנה כאן"
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <Save size={18} className="mr-2" />
          שמור שינויים
        </button>
        {saveMessage && (
          <span className="text-green-500 animate-fade-in-out">{saveMessage}</span>
        )}
      </div>
    </div>
  );
};

export default TokenManagement;