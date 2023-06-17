import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';


const projectUrl = process.env.SUPABASE_PROJECT_URL;
const projectKey = process.env.SUPABASE_PROJECT_KEY;

// AsyncStorage.getItem
// AsyncStorage.removeItem
// AsyncStorage.setItem

export const supabase = createClient(projectUrl, projectKey, {
    auth: {
        storage: AsyncStorage
    }
});

export async function insertReportData(formData, table) {
    const { data: { user: {id} } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from(table)
      .insert({...formData, reporting_user: id});
      return error;
  }

export async function insertVerifiedReport(formData, table) {
    const { data: { user: {id} } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from(table)
      .insert({...formData, verifying_user: id});
      return error;
}

export async function viewNewReports(table) {
    const { data } = await supabase
    .from(table)
    .select()
    .eq('verified', false)
    .eq('rejected', false)
    .eq('resolved', false);
    return data;
}

export async function rejectReport(table, id) {
    const { error } = await supabase
    .from(table)
    .update({rejected: true})
    .eq('id', id);
    return error;
}

export async function verifyReport(table, id) {
    const { error } = await supabase
    .from(table)
    .update({verified: true})
    .eq('id', id);
    return error;
}