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
  date: string;
  staff?: string;
  drugs?: string[];
  time?: string[];
  notes?: string;
}

export interface VitalSign {
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

export interface UserRecord {
  id: string;
  owner: Owner;
  animal: Animal;
  medicalCase: MedicalCase;
  treatment: Treatment[];
  vitalSigns: VitalSign[];
  status: CaseStatus;
}

const defaultUsers: UserRecord[] = [
  {
    id: "1",
    owner: { name: "Mahmoud Hefny", phone: "01124783322", id: "281103XXXX" },
    animal: { species: "Dog", sex: "Female", age: "1.5", weight: "", diagnosis: "Vomiting case" },
    medicalCase: { category: "Viral infection", type: ["Adeno Virus", "Canine Distemper"], subType: ["Glaucoma", "Off food"] },
    treatment: [
      { date: "24-2", staff: "MultiVet Yasser", drugs: ["Ceftriaxone", "Drotaverine", "Dexa", "Labonel"], time: ["2 AM", "11 AM", "11 PM"] },
      { date: "25-2", staff: "MultiVet Yasser", drugs: ["Dexa", "Gastrodine", "Ondanset", "Amrizole"], time: ["12 AM"] },
      { date: "27-2", notes: "Fluid therapy and monitoring" },
      { date: "28-2", notes: "Continued treatment and observation" },
    ],
    vitalSigns: [
      { date: "24-2", time: "12:15 PM", temp: "39.5", food: "Off", drink: "Off", urine: "Off", stool: "Off", notes: "Severe vomiting" },
      { date: "25-2", time: "11 PM", temp: "38", food: "Diet", drink: "Good", urine: "Good", stool: "Off", notes: "There is shifting" },
    ],
    status: "Euthanized",
  },
  {
    id: "2",
    owner: { name: "Ahmed Ali", phone: "01098765432", id: "290501XXXX" },
    animal: { species: "Cat", sex: "Male", age: "3", weight: "4.5", diagnosis: "Urinary blockage" },
    medicalCase: { category: "Urinary", type: ["FLUTD"], subType: ["Crystals", "Straining"] },
    treatment: [
      { date: "1-3", staff: "Dr. Khaled", drugs: ["Meloxicam", "Amoxicillin"], time: ["9 AM", "9 PM"] },
      { date: "2-3", notes: "Catheter placed, flushing" },
    ],
    vitalSigns: [
      { date: "1-3", time: "10 AM", temp: "39.0", food: "Off", drink: "Low", urine: "Blocked", stool: "Normal", notes: "Distressed" },
    ],
    status: "Improving",
  },
  {
    id: "3",
    owner: { name: "Sara Mohamed", phone: "01234567890", id: "950812XXXX" },
    animal: { species: "Dog", sex: "Male", age: "5", weight: "25", diagnosis: "Fracture - hind leg" },
    medicalCase: { category: "Orthopedic", type: ["Fracture"], subType: ["Femur", "Post-trauma"] },
    treatment: [
      { date: "10-3", staff: "Dr. Khaled", drugs: ["Tramadol", "Cefotaxime"], time: ["8 AM", "8 PM"] },
      { date: "11-3", notes: "Surgery scheduled" },
    ],
    vitalSigns: [
      { date: "10-3", time: "9 AM", temp: "38.5", food: "Low", drink: "Good", urine: "Good", stool: "Good", notes: "Pain on palpation" },
    ],
    status: "Stable",
  },
];

const STORAGE_KEY = "petplanet_users";

export function getUsers(): UserRecord[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

export function saveUsers(users: UserRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getUserByPhone(phone: string): UserRecord | undefined {
  return getUsers().find((u) => u.owner.phone === phone);
}

export function addUser(user: UserRecord) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function updateUser(id: string, data: Partial<UserRecord>) {
  const users = getUsers().map((u) => (u.id === id ? { ...u, ...data } : u));
  saveUsers(users);
}

export function deleteUser(id: string) {
  saveUsers(getUsers().filter((u) => u.id !== id));
}

export const ADMIN_PHONE = "1730183313455233839";
