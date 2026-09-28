import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  User, 
  RepairTicket, 
  ComputerAsset, 
  SparePart, 
  LineNotifyConfig, 
  ApiSyncConfig 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_ASSETS, 
  INITIAL_TICKETS, 
  INITIAL_SPARE_PARTS, 
  INITIAL_LINE_CONFIG, 
  INITIAL_API_CONFIG 
} from '../data/mockData';

export const COLLECTIONS = {
  USERS: 'users',
  TICKETS: 'tickets',
  ASSETS: 'assets',
  SPARE_PARTS: 'spare_parts',
  SYSTEM_CONFIG: 'system_config',
} as const;

export interface FirebaseLoadResult {
  users: User[];
  tickets: RepairTicket[];
  assets: ComputerAsset[];
  spareParts: SparePart[];
  lineConfig: LineNotifyConfig;
  apiConfig: ApiSyncConfig;
}

// Fetch all collections from Firestore, or seed if empty
export async function initializeFirestoreData(): Promise<FirebaseLoadResult> {
  try {
    const usersSnap = await getDocs(collection(db, COLLECTIONS.USERS));
    const ticketsSnap = await getDocs(collection(db, COLLECTIONS.TICKETS));
    const assetsSnap = await getDocs(collection(db, COLLECTIONS.ASSETS));
    const sparePartsSnap = await getDocs(collection(db, COLLECTIONS.SPARE_PARTS));
    const configSnap = await getDocs(collection(db, COLLECTIONS.SYSTEM_CONFIG));

    // If database is completely empty, seed with initial hospital data
    if (usersSnap.empty && ticketsSnap.empty && assetsSnap.empty) {
      console.log('[Firebase] Empty database detected. Seeding initial hospital data...');
      await seedFirestoreInitialData();

      return {
        users: INITIAL_USERS,
        tickets: INITIAL_TICKETS,
        assets: INITIAL_ASSETS,
        spareParts: INITIAL_SPARE_PARTS,
        lineConfig: INITIAL_LINE_CONFIG,
        apiConfig: INITIAL_API_CONFIG,
      };
    }

    // Parse existing data
    const users = usersSnap.docs.map(d => d.data() as User);
    const tickets = ticketsSnap.docs.map(d => d.data() as RepairTicket);
    const assets = assetsSnap.docs.map(d => d.data() as ComputerAsset);
    const spareParts = sparePartsSnap.docs.map(d => d.data() as SparePart);

    let lineConfig = INITIAL_LINE_CONFIG;
    let apiConfig = INITIAL_API_CONFIG;

    configSnap.docs.forEach(docSnap => {
      if (docSnap.id === 'line_config') {
        lineConfig = docSnap.data() as LineNotifyConfig;
      } else if (docSnap.id === 'api_config') {
        apiConfig = docSnap.data() as ApiSyncConfig;
      }
    });

    return {
      users: users.length > 0 ? users : INITIAL_USERS,
      tickets: tickets.length > 0 ? tickets : INITIAL_TICKETS,
      assets: assets.length > 0 ? assets : INITIAL_ASSETS,
      spareParts: spareParts.length > 0 ? spareParts : INITIAL_SPARE_PARTS,
      lineConfig,
      apiConfig,
    };
  } catch (err) {
    console.warn('[Firebase] Firestore read failed due to permissions or offline state. Falling back to local hospital data.', err);
    return {
      users: INITIAL_USERS,
      tickets: INITIAL_TICKETS,
      assets: INITIAL_ASSETS,
      spareParts: INITIAL_SPARE_PARTS,
      lineConfig: INITIAL_LINE_CONFIG,
      apiConfig: INITIAL_API_CONFIG,
    };
  }
}

// Seed initial data in batch
export async function seedFirestoreInitialData(): Promise<void> {
  const batch = writeBatch(db);

  // Users
  INITIAL_USERS.forEach(u => {
    const ref = doc(db, COLLECTIONS.USERS, u.id);
    batch.set(ref, u);
  });

  // Assets
  INITIAL_ASSETS.forEach(a => {
    const ref = doc(db, COLLECTIONS.ASSETS, a.id);
    batch.set(ref, a);
  });

  // Tickets
  INITIAL_TICKETS.forEach(t => {
    const ref = doc(db, COLLECTIONS.TICKETS, t.id);
    batch.set(ref, t);
  });

  // Spare Parts
  INITIAL_SPARE_PARTS.forEach(sp => {
    const ref = doc(db, COLLECTIONS.SPARE_PARTS, sp.id);
    batch.set(ref, sp);
  });

  // System Config
  batch.set(doc(db, COLLECTIONS.SYSTEM_CONFIG, 'line_config'), INITIAL_LINE_CONFIG);
  batch.set(doc(db, COLLECTIONS.SYSTEM_CONFIG, 'api_config'), INITIAL_API_CONFIG);

  await batch.commit();
}

// Sync single document updates to Firestore
export async function syncTicketToFirestore(ticket: RepairTicket): Promise<void> {
  const ref = doc(db, COLLECTIONS.TICKETS, ticket.id);
  await setDoc(ref, ticket, { merge: true });
}

export async function syncAssetToFirestore(asset: ComputerAsset): Promise<void> {
  const ref = doc(db, COLLECTIONS.ASSETS, asset.id);
  await setDoc(ref, asset, { merge: true });
}

export async function syncUserToFirestore(user: User): Promise<void> {
  const ref = doc(db, COLLECTIONS.USERS, user.id);
  await setDoc(ref, user, { merge: true });
}

export async function syncSparePartToFirestore(sparePart: SparePart): Promise<void> {
  const ref = doc(db, COLLECTIONS.SPARE_PARTS, sparePart.id);
  await setDoc(ref, sparePart, { merge: true });
}

export async function syncConfigToFirestore(type: 'line' | 'api', configData: Record<string, unknown>): Promise<void> {
  const docId = type === 'line' ? 'line_config' : 'api_config';
  const ref = doc(db, COLLECTIONS.SYSTEM_CONFIG, docId);
  await setDoc(ref, configData, { merge: true });
}

// Bulk sync all collections (e.g. for backup restore or reset)
export async function syncAllToFirestore(data: {
  users?: User[];
  tickets?: RepairTicket[];
  assets?: ComputerAsset[];
  spareParts?: SparePart[];
  lineConfig?: LineNotifyConfig;
  apiConfig?: ApiSyncConfig;
}): Promise<void> {
  const batch = writeBatch(db);

  if (data.users) {
    data.users.forEach(u => batch.set(doc(db, COLLECTIONS.USERS, u.id), u));
  }
  if (data.tickets) {
    data.tickets.forEach(t => batch.set(doc(db, COLLECTIONS.TICKETS, t.id), t));
  }
  if (data.assets) {
    data.assets.forEach(a => batch.set(doc(db, COLLECTIONS.ASSETS, a.id), a));
  }
  if (data.spareParts) {
    data.spareParts.forEach(sp => batch.set(doc(db, COLLECTIONS.SPARE_PARTS, sp.id), sp));
  }
  if (data.lineConfig) {
    batch.set(doc(db, COLLECTIONS.SYSTEM_CONFIG, 'line_config'), data.lineConfig);
  }
  if (data.apiConfig) {
    batch.set(doc(db, COLLECTIONS.SYSTEM_CONFIG, 'api_config'), data.apiConfig);
  }

  await batch.commit();
}
