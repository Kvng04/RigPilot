import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import type { AuditResult, MachineItem, UserProfileData, AnalyticsEventType } from '../types';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface LeadSubmission {
  id?: string;
  email: string;
  source: string;
  pricingTier?: string | null;
  timestamp: string;
  createdAt?: unknown;
}

export interface AppSettings {
  ownerUid: string;
  ownerEmail: string;
  claimedAt: string;
  liveUrl?: string;
  visitorCount?: number;
  checklist?: Record<string, boolean>;
}

// 1. Landing Lead Submissions
export async function submitLead(data: {
  email: string;
  source: string;
  pricingTier?: string;
}): Promise<void> {
  const leadsPath = 'leads';
  try {
    const leadsRef = collection(db, leadsPath);
    await addDoc(leadsRef, {
      email: data.email.trim().toLowerCase(),
      source: data.source,
      pricingTier: data.pricingTier || null,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, leadsPath);
  }
}

// 2. Authentication with Google
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  // Ensure profile is synced in Firestore with tolerant null displayName
  await syncUserProfile(user);
  return user;
}

export const signInWithGoogleAdmin = signInWithGoogle;

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export const logOutAdmin = logOut;

// 3. User Profile Sync
export async function syncUserProfile(user: User, additional?: { companyName?: string }): Promise<UserProfileData> {
  const path = `users/${user.uid}/profile/main`;
  try {
    const docRef = doc(db, 'users', user.uid, 'profile', 'main');
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      const data = existing.data() as UserProfileData;
      if (additional?.companyName && additional.companyName !== data.companyName) {
        await updateDoc(docRef, { companyName: additional.companyName });
        data.companyName = additional.companyName;
      }
      return data;
    }

    const newProfile: UserProfileData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || null, // Explicitly safe with null
      companyName: additional?.companyName || 'Independent Fleet',
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, newProfile);
    return newProfile;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// 4. User Audits Subcollection
export async function saveUserAudit(userId: string, audit: AuditResult): Promise<string> {
  const path = `users/${userId}/audits`;
  try {
    const colRef = collection(db, 'users', userId, 'audits');
    const docRef = await addDoc(colRef, {
      ...audit,
      userId,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export function subscribeToUserAudits(
  userId: string,
  onUpdate: (audits: AuditResult[]) => void,
  onError: (err: Error) => void
) {
  const path = `users/${userId}/audits`;
  const auditsQuery = query(collection(db, 'users', userId, 'audits'), orderBy('timestamp', 'desc'));
  return onSnapshot(
    auditsQuery,
    (snapshot) => {
      const audits: AuditResult[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<AuditResult, 'id'>),
      }));
      onUpdate(audits);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function deleteUserAudit(userId: string, auditId: string): Promise<void> {
  const path = `users/${userId}/audits/${auditId}`;
  try {
    const docRef = doc(db, 'users', userId, 'audits', auditId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 5. User Fleet Machinery Roster
export async function saveUserMachine(userId: string, machine: MachineItem): Promise<string> {
  const path = `users/${userId}/machines`;
  try {
    const colRef = collection(db, 'users', userId, 'machines');
    const docRef = await addDoc(colRef, {
      ...machine,
      userId,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export function subscribeToUserMachines(
  userId: string,
  onUpdate: (machines: MachineItem[]) => void,
  onError: (err: Error) => void
) {
  const path = `users/${userId}/machines`;
  const machinesQuery = query(collection(db, 'users', userId, 'machines'), orderBy('unitNumber', 'asc'));
  return onSnapshot(
    machinesQuery,
    (snapshot) => {
      const machines: MachineItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<MachineItem, 'id'>),
      }));
      onUpdate(machines);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function deleteUserMachine(userId: string, machineId: string): Promise<void> {
  const path = `users/${userId}/machines/${machineId}`;
  try {
    const docRef = doc(db, 'users', userId, 'machines', machineId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 6. Analytics Event Logging
export async function trackAnalyticsEvent(
  userId: string | null,
  eventName: AnalyticsEventType,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const targetUserId = userId || auth.currentUser?.uid;
    if (targetUserId) {
      const colRef = collection(db, 'users', targetUserId, 'events');
      await addDoc(colRef, {
        eventName,
        metadata: metadata || {},
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    // Non-blocking analytics
    console.warn('Analytics event log error:', err);
  }
}

// 7. Launch HQ / Admin Settings
export async function getOwnerSettings(): Promise<AppSettings | null> {
  const path = 'settings/app_config';
  try {
    const docRef = doc(db, 'settings', 'app_config');
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as AppSettings;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function claimOwnerSettings(user: User): Promise<AppSettings> {
  const path = 'settings/app_config';
  try {
    const docRef = doc(db, 'settings', 'app_config');
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      return existing.data() as AppSettings;
    }
    const newSettings: AppSettings = {
      ownerUid: user.uid,
      ownerEmail: user.email || '',
      claimedAt: new Date().toISOString(),
      liveUrl: window.location.origin,
      visitorCount: 0,
      checklist: {
        page_live: true,
        channel_1: false,
        channel_2: false,
        channel_3: false,
        dms_sent: false,
        visitors_100: false,
        verdict_read: false,
      },
    };
    await setDoc(docRef, newSettings);
    return newSettings;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function updateAppSettings(data: Partial<AppSettings>): Promise<void> {
  const path = 'settings/app_config';
  try {
    const docRef = doc(db, 'settings', 'app_config');
    await updateDoc(docRef, data);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export function subscribeToLeads(
  onUpdate: (leads: LeadSubmission[]) => void,
  onError: (err: Error) => void
) {
  const leadsPath = 'leads';
  const leadsQuery = query(collection(db, leadsPath), orderBy('timestamp', 'desc'));
  return onSnapshot(
    leadsQuery,
    (snapshot) => {
      const leads: LeadSubmission[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<LeadSubmission, 'id'>),
      }));
      onUpdate(leads);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, leadsPath);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export { onAuthStateChanged, signInWithPopup, signOut };
