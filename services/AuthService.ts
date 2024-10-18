// כרגע נשאיר את השירות הזה ריק, נשתמש בו בעתיד כשנחזיר את מערכת ההתחברות
export const AuthService = {
  getCurrentUser: () => ({ id: 'temp-user-id', role: 'super_admin' }),
  isSuperAdmin: () => true
};