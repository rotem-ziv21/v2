import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash, Save } from 'lucide-react';
import { DataService } from '../services/DataService';

interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

interface BusinessHoursProps {
  tenantId: string;
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ tenantId }) => {
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [newSlot, setNewSlot] = useState<AvailabilitySlot>({
    id: '',
    date: '',
    startTime: '',
    endTime: '',
    breakStart: '',
    breakEnd: ''
  });
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadAvailabilitySlots();
  }, [tenantId]);

  const loadAvailabilitySlots = async () => {
    try {
      // כאן צריך להיות קריאה לשרת להביא את שעות הפעילות של העסק הספציפי
      // לדוגמה: const loadedSlots = await DataService.getTenantAvailabilitySlots(tenantId);
      // setAvailabilitySlots(loadedSlots);
      
      // בינתיים, נשתמש בנתונים מקומיים
      const storedSlots = localStorage.getItem(`availabilitySlots_${tenantId}`);
      if (storedSlots) {
        setAvailabilitySlots(JSON.parse(storedSlots));
      }
    } catch (error) {
      console.error('Error loading availability slots:', error);
    }
  };

  const handleAddSlot = () => {
    if (newSlot.date && newSlot.startTime && newSlot.endTime) {
      const updatedSlots = [...availabilitySlots, { ...newSlot, id: Date.now().toString() }];
      setAvailabilitySlots(updatedSlots);
      setNewSlot({ id: '', date: '', startTime: '', endTime: '', breakStart: '', breakEnd: '' });
    }
  };

  const handleRemoveSlot = (id: string) => {
    const updatedSlots = availabilitySlots.filter(slot => slot.id !== id);
    setAvailabilitySlots(updatedSlots);
  };

  const handleSave = async () => {
    try {
      // כאן צריך להיות קריאה לשרת לשמור את שעות הפעילות
      // לדוגמה: await DataService.updateTenantAvailabilitySlots(tenantId, availabilitySlots);
      
      // בינתיים, נשמור בלוקל סטורג'
      localStorage.setItem(`availabilitySlots_${tenantId}`, JSON.stringify(availabilitySlots));
      setSaveMessage('השינויים נשמרו בהצלחה!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving availability slots:', error);
      setSaveMessage('שגיאה בשמירת השינויים');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">ניהול זמינות</h3>
      
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-medium mb-2">הוסף זמינות חדשה</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תאריך</label>
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={newSlot.date}
                onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                className="pr-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-green-400 focus:border-green-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שעת התחלה</label>
            <div className="relative">
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                className="pr-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-green-400 focus:border-green-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שעת סיום</label>
            <div className="relative">
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                className="pr-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-green-400 focus:border-green-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תחילת הפסקה (אופציונלי)</label>
            <div className="relative">
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="time"
                value={newSlot.breakStart}
                onChange={(e) => setNewSlot({ ...newSlot, breakStart: e.target.value })}
                className="pr-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-green-400 focus:border-green-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סיום הפסקה (אופציונלי)</label>
            <div className="relative">
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="time"
                value={newSlot.breakEnd}
                onChange={(e) => setNewSlot({ ...newSlot, breakEnd: e.target.value })}
                className="pr-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-green-400 focus:border-green-400"
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleAddSlot}
            className="bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            הוסף זמינות
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {availabilitySlots.map((slot) => (
          <div key={slot.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
            <div className="flex space-x-4 space-x-reverse">
              <span className="flex items-center">
                <Calendar className="mr-2 text-blue-400" size={18} />
                {slot.date}
              </span>
              <span className="flex items-center">
                <Clock className="mr-2 text-green-400" size={18} />
                {slot.startTime} - {slot.endTime}
              </span>
              {slot.breakStart && slot.breakEnd && (
                <span className="flex items-center">
                  <Clock className="mr-2 text-red-400" size={18} />
                  הפסקה: {slot.breakStart} - {slot.breakEnd}
                </span>
              )}
            </div>
            <button
              onClick={() => handleRemoveSlot(slot.id)}
              className="text-red-500 hover:text-red-700 transition duration-300"
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
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

export default BusinessHours;