"use server"; 
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// --- CITAS ---
export async function getAppointments() {
  const { data, error } = await supabaseAdmin
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function confirmAppointment(id) {
  const { error } = await supabaseAdmin
    .from('appointments')
    .update({ status: 'confirmed' })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteAppointment(id) {
  const { error } = await supabaseAdmin
    .from('appointments')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// --- AGENDA ---
export async function getAvailability() {
  const { data, error } = await supabaseAdmin
    .from('availability')
    .select('*')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .order('time', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function addAvailability(date, time) {
  const { error } = await supabaseAdmin
    .from('availability')
    .insert([{ date, time, status: 'free' }]);
  if (error) {
    if (error.code === '23505') throw new Error('Este horario ya está abierto en tu agenda.');
    throw new Error(error.message);
  }
}

export async function deleteAvailability(id) {
  const { error } = await supabaseAdmin
    .from('availability')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function addBulkAvailability(slotsArray) {
  const { error } = await supabaseAdmin
    .from('availability')
    .upsert(slotsArray, { onConflict: 'date,time', ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

// --- CÁPSULAS CLÍNICAS ---
export async function getCapsulas() {
  const { data, error } = await supabaseAdmin
    .from('capsulas')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addCapsula(capsulaData) {
  const { error } = await supabaseAdmin
    .from('capsulas')
    .insert([capsulaData]);
  if (error) throw new Error(error.message);
}

export async function deleteCapsula(id) {
  const { error } = await supabaseAdmin
    .from('capsulas')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}
// ==========================================
// NUEVAS ACCIONES PARA RECURSOS CLÍNICOS
// ==========================================
export async function getRecursos() {
  const { data, error } = await supabaseAdmin
    .from('recursos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addRecurso(recursoData) {
  const { error } = await supabaseAdmin
    .from('recursos')
    .insert([recursoData]);
  if (error) throw new Error(error.message);
}

export async function deleteRecurso(id) {
  const { error } = await supabaseAdmin
    .from('recursos')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}
// ==========================================
// NUEVAS ACCIONES: BLOG, CONSULTANTES E ITACA
// ==========================================

// --- BLOG ---
export async function getBlog() {
  const { data, error } = await supabaseAdmin.from('blog').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}
export async function addBlog(blogData) {
  const { error } = await supabaseAdmin.from('blog').insert([blogData]);
  if (error) throw new Error(error.message);
}
export async function deleteBlog(id) {
  const { error } = await supabaseAdmin.from('blog').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// --- CONSULTANTES ---
export async function getConsultantes() {
  const { data, error } = await supabaseAdmin.from('consultantes').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}
export async function addConsultante(consData) {
  const { error } = await supabaseAdmin.from('consultantes').insert([consData]);
  if (error) throw new Error(error.message);
}
export async function deleteConsultante(id) {
  const { error } = await supabaseAdmin.from('consultantes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// --- ITACA (CONTRASEÑA) ---
export async function getItacaPassword() {
  const { data, error } = await supabaseAdmin.from('itaca_config').select('password').single();
  if (error) throw new Error(error.message);
  return data?.password || "";
}
export async function updateItacaPassword(newPassword) {
  // Asumimos que la fila con id=1 es la que guarda la contraseña
  const { error } = await supabaseAdmin.from('itaca_config').update({ password: newPassword, updated_at: new Date() }).eq('id', 1);
  if (error) throw new Error(error.message);
}
// --- ACCIONES PARA MÓDULOS DE ITACA ---

export async function getItacaModules() {
  const { data, error } = await supabaseAdmin
    .from('itaca_modules') // Asegúrate de que el nombre sea este
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw new Error(error.message);
  return data;
}

export async function addItacaModule(moduleData) {
  const { error } = await supabaseAdmin
    .from('itaca_modules')
    .insert([moduleData]);
    
  if (error) throw new Error(error.message);
}

export async function deleteItacaModule(id) {
  const { error } = await supabaseAdmin
    .from('itaca_modules')
    .delete()
    .eq('id', id);
    
  if (error) throw new Error(error.message);
}