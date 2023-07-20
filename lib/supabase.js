import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const projectUrl = process.env.SUPABASE_PROJECT_URL;
const projectKey = process.env.SUPABASE_PROJECT_KEY;

// AsyncStorage.getItem
// AsyncStorage.removeItem
// AsyncStorage.setItem

export const supabase = createClient(projectUrl, projectKey, {
  auth: {
    storage: AsyncStorage,
  },
});

export async function getUserRole() {
  const { data } = await supabase
    .from("roles")
    .select("role")
    return data[0].role;
}

export async function upgradeUserRole() {
  const {
    data: {
      user: { id },
    },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("roles")
    .update({ role: "staff" })
    .eq("user_id", id);
    return error;
}

export async function insertReportData(formData, table) {
  const {
    data: {
      user: { id },
    },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from(table)
    .insert({ ...formData, reporting_user: id });
  return error;
}

export async function insertVerifiedReport(formData, table) {
  const {
    data: {
      user: { id },
    },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from(table)
    .insert({ ...formData, verifying_user: id });
  return error;
}

export async function viewNewReports(table) {
  const { data } = await supabase
    .from(table)
    .select()
    .eq("verified", false)
    .eq("rejected", false)
    .eq("resolved", false);
  return data;
}

export async function viewVerifiedReports(table) {
  const { data } = await supabase.from(table).select("*");
  return data;
}

export async function rejectReport(table, id) {
  const { error } = await supabase
    .from(table)
    .update({ rejected: true })
    .eq("id", id);
  return error;
}

export async function verifyReport(table, id) {
  const { error } = await supabase
    .from(table)
    .update({ verified: true })
    .eq("id", id);
  return error;
}

export async function viewMarkers(table) {
  const { data } = await supabase.from(table).select("*");
  return data;
}

export async function resolveReport(id, type) {
  const { error } = await supabase
    .from(type === "incident" ? "verifiedincidents" : "verifiedinfras")
    .delete()
    .eq("id", id);
  const { data } = await supabase
    .from(type === "incident" ? "incidentreps" : "infrareps")
    .update({ resolved: true })
    .eq("id", id);
  return { error, data };
}

// To view filtered reports for general users.
export async function viewFilteredReport(reportType, filterType) {
  const {
    data: {
      user: { id },
    },
  } = await supabase.auth.getUser();

  if (filterType === "rejected") {
    const { data } = await supabase
      .from(reportType === "incidents" ? "incidentreps" : "infrareps")
      .select()
      .eq("rejected", true)
      .eq("reporting_user", id);
    return data;
  } else if (filterType === "resolved") {
    const { data } = await supabase
      .from(reportType === "incidents" ? "incidentreps" : "infrareps")
      .select()
      .eq("resolved", true)
      .eq("reporting_user", id);
    return data;
  } else if (filterType === "verified") {
    const { data } = await supabase
      .from(reportType === "incidents" ? "incidentreps" : "infrareps")
      .select()
      .eq("verified", true)
      .eq("resolved", false)
      .eq("reporting_user", id);
    return data;
  } else {
    // unverified reports
    const { data } = await supabase
      .from(reportType === "incidents" ? "incidentreps" : "infrareps")
      .select()
      .eq("verified", false)
      .eq("rejected", false)
      .eq("reporting_user", id);
    return data;
  }
}

export async function insertImage(bucketName, fileName, formData) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, formData, {
      cacheControl: "3600",
      upsert: false,
    });
  return { data, error };
}

export async function getImageURL(bucketName, fileName) {
  const { data, error} = await supabase.storage
  .from(bucketName)
  .getPublicUrl(fileName);
  return { data, error };
}
