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

export async function insertData(formData, table) {
    const { data: { user: {id} } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from(table)
      .insert({...formData, user_id: id});
      return error;
  }

export async function viewStaffData(table) {
    const { data } = await supabase.from(table).select('*');
    return data;
}

export async function deleteStaffData(table, id, primaryKey) {
    const { error } = await supabase
    .from(table)
    .delete()
    .eq(primaryKey, id);
    console.log(error);
    return error;
}