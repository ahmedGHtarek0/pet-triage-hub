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

export type CaseStatus = "Improving" | "Stable" | "Critical" | "Euthanized";

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

const defaultUsers: UserRecord[] = [
  {
    id: "1",
    owner: { name: "Mahmoud Hefny", phone: "01124783322", id: "281103XXXX" },
    animal: { species: "Dog", sex: "Female", age: "1.5", weight: "", diagnosis: "Vomiting case" },
    medicalCase: { category: "Viral infection", type: ["Adeno Virus", "Canine Distemper"], subType: ["Glaucoma", "Off food"] },
    treatment: [
      { id: "t1", date: "24-2", staff: "MultiVet Yasser", drugs: ["Ceftriaxone", "Drotaverine", "Dexa", "Labonel"], time: ["2 AM", "11 AM", "11 PM"] },
      { id: "t2", date: "25-2", staff: "MultiVet Yasser", drugs: ["Dexa", "Gastrodine", "Ondanset", "Amrizole"], time: ["12 AM"] },
      { id: "t3", date: "27-2", notes: "Fluid therapy and monitoring" },
      { id: "t4", date: "28-2", notes: "Continued treatment and observation" },
    ],
    vitalSigns: [
      { id: "v1", date: "24-2", time: "12:15 PM", temp: "39.5", food: "Off", drink: "Off", urine: "Off", stool: "Off", notes: "Severe vomiting" },
      { id: "v2", date: "25-2", time: "11 PM", temp: "38", food: "Diet", drink: "Good", urine: "Good", stool: "Off", notes: "There is shifting" },
    ],
    status: "Euthanized",
    photos: [],
  },
  {
    id: "2",
    owner: { name: "Ahmed Ali", phone: "01098765432", id: "290501XXXX" },
    animal: { species: "Cat", sex: "Male", age: "3", weight: "4.5", diagnosis: "Urinary blockage" },
    medicalCase: { category: "Urinary", type: ["FLUTD"], subType: ["Crystals", "Straining"] },
    treatment: [
      { id: "t5", date: "1-3", staff: "Dr. Khaled", drugs: ["Meloxicam", "Amoxicillin"], time: ["9 AM", "9 PM"] },
      { id: "t6", date: "2-3", notes: "Catheter placed, flushing" },
    ],
    vitalSigns: [
      { id: "v3", date: "1-3", time: "10 AM", temp: "39.0", food: "Off", drink: "Low", urine: "Blocked", stool: "Normal", notes: "Distressed" },
    ],
    status: "Improving",
    photos: [],
  },
  {
    id: "3",
    owner: { name: "Sara Mohamed", phone: "01234567890", id: "950812XXXX" },
    animal: { species: "Dog", sex: "Male", age: "5", weight: "25", diagnosis: "Fracture - hind leg" },
    medicalCase: { category: "Orthopedic", type: ["Fracture"], subType: ["Femur", "Post-trauma"] },
    treatment: [
      { id: "t7", date: "10-3", staff: "Dr. Khaled", drugs: ["Tramadol", "Cefotaxime"], time: ["8 AM", "8 PM"] },
      { id: "t8", date: "11-3", notes: "Surgery scheduled" },
    ],
    vitalSigns: [
      { id: "v4", date: "10-3", time: "9 AM", temp: "38.5", food: "Low", drink: "Good", urine: "Good", stool: "Good", notes: "Pain on palpation" },
    ],
    status: "Stable",
    photos: [],
  },
];

const STORAGE_KEY = "petplanet_users";
const ACTIVITY_KEY = "petplanet_activity";
const CONTENT_KEY = "petplanet_content";

export function getUsers(): UserRecord[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

export function saveUsers(users: UserRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getUserById(id: string): UserRecord | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByPhone(phone: string): UserRecord | undefined {
  return getUsers().find((u) => u.owner.phone === phone);
}

export function addUser(user: UserRecord) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  addActivity(user.id, "New patient added", `${user.owner.name} - ${user.animal.species}`);
}

export function updateUser(id: string, data: Partial<UserRecord>) {
  const users = getUsers().map((u) => (u.id === id ? { ...u, ...data } : u));
  saveUsers(users);
}

export function deleteUser(id: string) {
  const user = getUserById(id);
  saveUsers(getUsers().filter((u) => u.id !== id));
  if (user) addActivity(id, "Patient deleted", user.owner.name);
}

// Treatment CRUD
export function addTreatment(userId: string, treatment: Treatment) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;
  user.treatment.push(treatment);
  saveUsers(users);
  addActivity(userId, "Treatment added", `${treatment.date} - ${treatment.staff || "N/A"}`);
}

export function updateTreatment(userId: string, treatmentId: string, data: Partial<Treatment>) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;
  user.treatment = user.treatment.map(t => t.id === treatmentId ? { ...t, ...data } : t);
  saveUsers(users);
  addActivity(userId, "Treatment updated", `${data.date || treatmentId}`);
}

export function deleteTreatment(userId: string, treatmentId: string) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;
  user.treatment = user.treatment.filter(t => t.id !== treatmentId);
  saveUsers(users);
  addActivity(userId, "Treatment deleted", treatmentId);
}

// Vital Signs CRUD
export function addVitalSign(userId: string, vital: VitalSign) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;
  user.vitalSigns.push(vital);
  saveUsers(users);
  addActivity(userId, "Vital sign added", `${vital.date} ${vital.time}`);
}

export function updateVitalSign(userId: string, vitalId: string, data: Partial<VitalSign>) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;
  user.vitalSigns = user.vitalSigns.map(v => v.id === vitalId ? { ...v, ...data } : v);
  saveUsers(users);
  addActivity(userId, "Vital sign updated", `${data.date || vitalId}`);
}

export function deleteVitalSign(userId: string, vitalId: string) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;
  user.vitalSigns = user.vitalSigns.filter(v => v.id !== vitalId);
  saveUsers(users);
  addActivity(userId, "Vital sign deleted", vitalId);
}

// Activity Log
export function getActivities(): ActivityLog[] {
  const stored = localStorage.getItem(ACTIVITY_KEY);
  if (stored) return JSON.parse(stored);
  return [];
}

export function addActivity(userId: string, action: string, details: string) {
  const activities = getActivities();
  activities.unshift({
    id: Date.now().toString(),
    userId,
    action,
    details,
    timestamp: new Date().toISOString(),
  });
  // Keep last 100
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities.slice(0, 100)));
}

// Site Content
export function getSiteContent(): SiteContent {
  const stored = localStorage.getItem(CONTENT_KEY);
  if (stored) return JSON.parse(stored);
  const defaults: SiteContent = {
    hero: { title: "Pet Planet", subtitle: "Veterinary Clinic", videoUrl: "/videos/hero-bg.mp4" },
    about: {
      text: "Welcome to Pet Planet Veterinary Clinic, led by Dr. Khaled Nasser. We provide comprehensive veterinary services with state-of-the-art facilities and compassionate care for your beloved pets.",
      images: ["/images/doctor.jpg"],
    },
    services: [
      { title: "Treatment", description: "Advanced medical treatment for all conditions.", icon: "Heart", image: "/images/service-treatment.jpg" },
      { title: "Surgery", description: "State-of-the-art surgical procedures.", icon: "Scissors", image: "/images/service-surgery.jpg" },
      { title: "Vaccination", description: "Complete vaccination programs.", icon: "Syringe", image: "/images/service-vaccination.jpg" },
    ],
    gallery: [
      { type: "image", url: "/images/gallery-1.jpg" },
      { type: "image", url: "/images/gallery-2.jpg" },
      { type: "image", url: "/images/doctor.jpg" },
      { type: "video", url: "/videos/gallery-1.mp4" },
      { type: "video", url: "/videos/gallery-2.mp4" },
    ],
  };
  localStorage.setItem(CONTENT_KEY, JSON.stringify(defaults));
  return defaults;
}

export function saveSiteContent(content: SiteContent) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
}

export const ADMIN_PHONE = "1730183313455233839";
