import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Scissors, DollarSign } from 'lucide-react';

interface Appointment {
  date: string;
  time: string;
  service: string;
  price: number;
  name: string;
  phone: string;
}

const AppointmentsView: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(storedAppointments);
    console.log('Loaded appointments:', storedAppointments); // לוג לבדיקה
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">תורים שנקבעו</h3>
      {appointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-right">תאריך</th>
                <th className="py-2 px-4 text-right">שעה</th>
                <th className="py-2 px-4 text-right">שירות</th>
                <th className="py-2 px-4 text-right">מחיר</th>
                <th className="py-2 px-4 text-right">שם הלקוח</th>
                <th className="py-2 px-4 text-right">טלפון</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <Calendar className="text-blue-400 ml-2" size={18} />
                      {formatDate(appointment.date)}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <Clock className="text-gray-400 ml-2" size={18} />
                      {appointment.time}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <Scissors className="text-purple-400 ml-2" size={18} />
                      {appointment.service}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <DollarSign className="text-green-400 ml-2" size={18} />
                      ₪{appointment.price}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <User className="text-green-400 ml-2" size={18} />
                      {appointment.name}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <Phone className="text-red-400 ml-2" size={18} />
                      {appointment.phone}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">לא נמצאו תורים.</p>
      )}
    </div>
  );
};

export default AppointmentsView;