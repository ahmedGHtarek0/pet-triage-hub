import { supabase } from "@/integrations/supabase/client";

// ============ Types ============

export type CaseStatus = "Improving" | "Stable" | "Critical" | "Euthanized";

export interface Owner {
  name: string;
  phone: string;
  id: string;
}

export interface Animal {
  species: string;
  sex: string;
  age: string;
  weight: string;
  diagnosis: string;
}

export interface MedicalCase {
  category: string;
  type: string[];
  subType: string[];
}

export interface Treatment {
  id: string;
  date: string;
  staff?: string;
  drugs?: string[];
  time?: string[];
  notes?: string;
  photos?: string[];
}

export interface VitalSign {
  id: string;
  date: string;
  time: string;
  temp: string;
  food: string;
  drink: string;
  urine: string;
  stool: string;
  notes: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface UserRecord {
  id: string;
  owner: Owner;
  animal: Animal;
  medicalCase: MedicalCase;
  treatment: Treatment[];
  vitalSigns: VitalSign[];
  status: CaseStatus;
  photos?: string[];
}

export interface SiteContent {
  hero: { title: string; subtitle: string; videoUrl: string };
  about: { text: string; images: string[] };
  services: { title: string; description: string; icon: string; image: string }[];
  gallery: { type: "image" | "video"; url: string }[];
}

export const ADMIN_PHONE = "1730183313455233839";

// ============ Helpers: map DB rows to app types ============

function mapPatientRow(row: any, treatments: any[], vitals: any[]): UserRecord {
  return {
    id: row.id,
    owner: { name: row.owner_name, phone: row.owner_phone, id: row.owner_national_id || "" },
    animal: {
      species: row.animal_species,
      sex: row.animal_sex,
      age: row.animal_age || "",
      weight: row.animal_weight || "",
      diagnosis: row.animal_diagnosis || "",
    },
    medicalCase: {
      category: row.case_category || "",
      type: row.case_type || [],
      subType: row.case_sub_type || [],
    },
    treatment: treatments.map((t) => ({
      id: t.id,
      date: t.date,
      staff: t.staff || undefined,
      drugs: t.drugs?.length ? t.drugs : undefined,
      time: t.times?.length ? t.times : undefined,
      notes: t.notes || undefined,
      photos: t.photos || [],
    })),
    vitalSigns: vitals.map((v) => ({
      id: v.id,
      date: v.date,
      time: v.time,
      temp: v.temp || "",
      food: v.food || "",
      drink: v.drink || "",
      urine: v.urine || "",
      stool: v.stool || "",
      notes: v.notes || "",
    })),
    status: row.status as CaseStatus,
    photos: row.photos || [],
  };
}

// ============ Patients (Users) ============

export async function getUsers(): Promise<UserRecord[]> {
  const { data: patients, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at");
  if (error || !patients) return [];

  const ids = patients.map((p) => p.id);

  const [{ data: treatments }, { data: vitals }] = await Promise.all([
    supabase.from("treatments").select("*").in("patient_id", ids).order("created_at"),
    supabase.from("vital_signs").select("*").in("patient_id", ids).order("created_at"),
  ]);

  return patients.map((p) =>
    mapPatientRow(
      p,
      (treatments || []).filter((t) => t.patient_id === p.id),
      (vitals || []).filter((v) => v.patient_id === p.id)
    )
  );
}

export async function getUserById(id: string): Promise<UserRecord | undefined> {
  const { data: patient } = await supabase.from("patients").select("*").eq("id", id).single();
  if (!patient) return undefined;

  const [{ data: treatments }, { data: vitals }] = await Promise.all([
    supabase.from("treatments").select("*").eq("patient_id", id).order("created_at"),
    supabase.from("vital_signs").select("*").eq("patient_id", id).order("created_at"),
  ]);

  return mapPatientRow(patient, treatments || [], vitals || []);
}

export async function getUserByPhone(phone: string): Promise<UserRecord | undefined> {
  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("owner_phone", phone)
    .maybeSingle();
  if (!patient) return undefined;

  const [{ data: treatments }, { data: vitals }] = await Promise.all([
    supabase.from("treatments").select("*").eq("patient_id", patient.id).order("created_at"),
    supabase.from("vital_signs").select("*").eq("patient_id", patient.id).order("created_at"),
  ]);

  return mapPatientRow(patient, treatments || [], vitals || []);
}

export async function addUser(user: UserRecord): Promise<void> {
  const { data, error } = await supabase
    .from("patients")
    .insert({
      owner_name: user.owner.name,
      owner_phone: user.owner.phone,
      owner_national_id: user.owner.id,
      animal_species: user.animal.species,
      animal_sex: user.animal.sex,
      animal_age: user.animal.age,
      animal_weight: user.animal.weight,
      animal_diagnosis: user.animal.diagnosis,
      case_category: user.medicalCase.category,
      case_type: user.medicalCase.type,
      case_sub_type: user.medicalCase.subType,
      status: user.status,
    })
    .select()
    .single();

  if (data) {
    await addActivity(data.id, "New patient added", `${user.owner.name} - ${user.animal.species}`);
  }
}

export async function updateUser(id: string, data: Partial<UserRecord>): Promise<void> {
  const update: any = {};
  if (data.owner) {
    update.owner_name = data.owner.name;
    update.owner_phone = data.owner.phone;
    update.owner_national_id = data.owner.id;
  }
  if (data.animal) {
    update.animal_species = data.animal.species;
    update.animal_sex = data.animal.sex;
    update.animal_age = data.animal.age;
    update.animal_weight = data.animal.weight;
    update.animal_diagnosis = data.animal.diagnosis;
  }
  if (data.medicalCase) {
    update.case_category = data.medicalCase.category;
    update.case_type = data.medicalCase.type;
    update.case_sub_type = data.medicalCase.subType;
  }
  if (data.status) update.status = data.status;
  if (data.photos !== undefined) update.photos = data.photos;

  if (Object.keys(update).length > 0) {
    await supabase.from("patients").update(update).eq("id", id);
  }
}

export async function deleteUser(id: string): Promise<void> {
  const { data: patient } = await supabase.from("patients").select("owner_name").eq("id", id).single();
  await supabase.from("patients").delete().eq("id", id);
  if (patient) await addActivity(id, "Patient deleted", patient.owner_name);
}

// ============ Treatments ============

export async function addTreatment(userId: string, treatment: Treatment): Promise<void> {
  await supabase.from("treatments").insert({
    patient_id: userId,
    date: treatment.date,
    staff: treatment.staff || null,
    drugs: treatment.drugs || [],
    times: treatment.time || [],
    notes: treatment.notes || null,
    photos: treatment.photos || [],
  });
  await addActivity(userId, "Treatment added", `${treatment.date} - ${treatment.staff || "N/A"}`);
}

export async function updateTreatment(userId: string, treatmentId: string, data: Partial<Treatment>): Promise<void> {
  const update: any = {};
  if (data.date !== undefined) update.date = data.date;
  if (data.staff !== undefined) update.staff = data.staff;
  if (data.drugs !== undefined) update.drugs = data.drugs;
  if (data.time !== undefined) update.times = data.time;
  if (data.notes !== undefined) update.notes = data.notes;
  if (data.photos !== undefined) update.photos = data.photos;

  await supabase.from("treatments").update(update).eq("id", treatmentId);
  await addActivity(userId, "Treatment updated", `${data.date || treatmentId}`);
}

export async function deleteTreatment(userId: string, treatmentId: string): Promise<void> {
  await supabase.from("treatments").delete().eq("id", treatmentId);
  await addActivity(userId, "Treatment deleted", treatmentId);
}

// ============ Vital Signs ============

export async function addVitalSign(userId: string, vital: VitalSign): Promise<void> {
  await supabase.from("vital_signs").insert({
    patient_id: userId,
    date: vital.date,
    time: vital.time,
    temp: vital.temp,
    food: vital.food,
    drink: vital.drink,
    urine: vital.urine,
    stool: vital.stool,
    notes: vital.notes,
  });
  await addActivity(userId, "Vital sign added", `${vital.date} ${vital.time}`);
}

export async function updateVitalSign(userId: string, vitalId: string, data: Partial<VitalSign>): Promise<void> {
  const update: any = {};
  if (data.date !== undefined) update.date = data.date;
  if (data.time !== undefined) update.time = data.time;
  if (data.temp !== undefined) update.temp = data.temp;
  if (data.food !== undefined) update.food = data.food;
  if (data.drink !== undefined) update.drink = data.drink;
  if (data.urine !== undefined) update.urine = data.urine;
  if (data.stool !== undefined) update.stool = data.stool;
  if (data.notes !== undefined) update.notes = data.notes;

  await supabase.from("vital_signs").update(update).eq("id", vitalId);
  await addActivity(userId, "Vital sign updated", `${data.date || vitalId}`);
}

export async function deleteVitalSign(userId: string, vitalId: string): Promise<void> {
  await supabase.from("vital_signs").delete().eq("id", vitalId);
  await addActivity(userId, "Vital sign deleted", vitalId);
}

// ============ Activity Log ============

export async function getActivities(): Promise<ActivityLog[]> {
  const { data } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (data || []).map((a) => ({
    id: a.id,
    userId: a.patient_id || "",
    action: a.action,
    details: a.details || "",
    timestamp: a.created_at,
  }));
}

export async function addActivity(userId: string, action: string, details: string): Promise<void> {
  await supabase.from("activity_log").insert({
    patient_id: userId,
    action,
    details,
  });
}

// ============ Site Content ============

export async function getSiteContent(): Promise<SiteContent> {
  const { data } = await supabase.from("site_content").select("*").limit(1).single();

  if (!data) {
    return {
      hero: { title: "Pet Planet", subtitle: "Veterinary Clinic", videoUrl: "/videos/hero-bg.mp4" },
      about: { text: "Welcome to Pet Planet Veterinary Clinic.", images: ["/images/doctor.jpg"] },
      services: [],
      gallery: [],
    };
  }

  return {
    hero: { title: data.hero_title, subtitle: data.hero_subtitle, videoUrl: data.hero_video_url },
    about: { text: data.about_text, images: data.about_images || ["/images/doctor.jpg"] },
    services: (data.services as any[]) || [],
    gallery: (data.gallery as any[]) || [],
  };
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const { data: existing } = await supabase.from("site_content").select("id").limit(1).single();
  if (!existing) return;

  await supabase
    .from("site_content")
    .update({
      hero_title: content.hero.title,
      hero_subtitle: content.hero.subtitle,
      hero_video_url: content.hero.videoUrl,
      about_text: content.about.text,
      about_images: content.about.images,
      services: content.services as any,
      gallery: content.gallery as any,
    })
    .eq("id", existing.id);
}
