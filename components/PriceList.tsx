import React, { useEffect, useState } from 'react';
import { DollarSign, Scissors } from 'lucide-react';
import { DataService } from '../services/DataService';

interface Service {
  id: number;
  name: string;
  price: number;
}

interface PriceListProps {
  tenantId: string;
}

const PriceList: React.FC<PriceListProps> = ({ tenantId }) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    loadServices();
  }, [tenantId]);

  const loadServices = async () => {
    try {
      const tenantServices = await DataService.getTenantServices(tenantId);
      setServices(tenantServices);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">מחירון</h2>
      <ul className="space-y-4">
        {services.map(({ id, name, price }) => (
          <li key={id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Scissors className="text-purple-400" size={24} />
              <span className="font-semibold">{name}</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <span className="font-bold text-lg">{price} ₪</span>
              <DollarSign className="text-green-400" size={18} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PriceList;