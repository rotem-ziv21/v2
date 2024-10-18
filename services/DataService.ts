import { AuthService } from './AuthService';

export interface Tenant {
  id: string;
  name: string;
  ownerId: string;
  locationId?: string;
  calendarId?: string;
  apiToken?: string;
}

const TENANTS_STORAGE_KEY = 'tenants';

export const DataService = {
  async getAllTenants(): Promise<Tenant[]> {
    const tenantsJson = localStorage.getItem(TENANTS_STORAGE_KEY);
    return tenantsJson ? JSON.parse(tenantsJson) : [];
  },

  async getTenantById(tenantId: string): Promise<Tenant> {
    const tenants = await this.getAllTenants();
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) {
      throw new Error('העסק לא נמצא');
    }
    return tenant;
  },

  async createTenant(tenantData: Omit<Tenant, 'id'>): Promise<Tenant> {
    const tenants = await this.getAllTenants();
    const newTenant: Tenant = {
      ...tenantData,
      id: Date.now().toString(),
    };
    tenants.push(newTenant);
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
    return newTenant;
  },

  async updateTenant(tenantId: string, tenantData: Partial<Tenant>): Promise<Tenant> {
    const tenants = await this.getAllTenants();
    const index = tenants.findIndex(t => t.id === tenantId);
    if (index === -1) {
      throw new Error('העסק לא נמצא');
    }
    tenants[index] = { ...tenants[index], ...tenantData };
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
    return tenants[index];
  },

  async deleteTenant(tenantId: string): Promise<void> {
    const tenants = await this.getAllTenants();
    const updatedTenants = tenants.filter(t => t.id !== tenantId);
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(updatedTenants));
  },

  // Helper functions for other components
  async getTenantServices(tenantId: string): Promise<any[]> {
    const servicesJson = localStorage.getItem(`services_${tenantId}`);
    return servicesJson ? JSON.parse(servicesJson) : [];
  },

  async updateTenantServices(tenantId: string, services: any[]): Promise<void> {
    localStorage.setItem(`services_${tenantId}`, JSON.stringify(services));
  },

  async getTenantAvailabilitySlots(tenantId: string): Promise<any[]> {
    const slotsJson = localStorage.getItem(`availabilitySlots_${tenantId}`);
    return slotsJson ? JSON.parse(slotsJson) : [];
  },

  async updateTenantAvailabilitySlots(tenantId: string, slots: any[]): Promise<void> {
    localStorage.setItem(`availabilitySlots_${tenantId}`, JSON.stringify(slots));
  },

  async getTenantImages(tenantId: string): Promise<any[]> {
    const imagesJson = localStorage.getItem(`gallery_${tenantId}`);
    return imagesJson ? JSON.parse(imagesJson) : [];
  },

  async updateTenantImages(tenantId: string, images: any[]): Promise<void> {
    localStorage.setItem(`gallery_${tenantId}`, JSON.stringify(images));
  },

  async getTenantTokenData(tenantId: string): Promise<{ token: string, locationId: string, calendarId: string }> {
    const tenant = await this.getTenantById(tenantId);
    return {
      token: tenant.apiToken || '',
      locationId: tenant.locationId || '',
      calendarId: tenant.calendarId || '',
    };
  },

  async updateTenantTokenData(tenantId: string, data: { token: string, locationId: string, calendarId: string }): Promise<void> {
    await this.updateTenant(tenantId, {
      apiToken: data.token,
      locationId: data.locationId,
      calendarId: data.calendarId,
    });
  },
};