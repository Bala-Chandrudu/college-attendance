import { supabase } from './supabase';

export async function isAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata?.admin === true;
}

export async function checkAdminAccess() {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
  return true;
}