import { supabase } from '../supabase';
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

export interface SupabaseLoadResult {
  users: User[];
  tickets: RepairTicket[];
  assets: ComputerAsset[];
  spareParts: SparePart[];
  lineConfig: LineNotifyConfig;
  apiConfig: ApiSyncConfig;
}

// Fetch all data from Supabase tables
export async function initializeSupabaseData(): Promise<SupabaseLoadResult> {
  try {
    const [usersRes, ticketsRes, assetsRes, sparePartsRes, configRes] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('tickets').select('*'),
      supabase.from('assets').select('*'),
      supabase.from('spare_parts').select('*'),
      supabase.from('system_config').select('*'),
    ]);

    // If any table query failed due to RLS or missing table, fallback gracefully
    if (usersRes.error || ticketsRes.error || assetsRes.error) {
      console.warn('[Supabase] RLS policy or table error detected, falling back to mock data:', {
        usersErr: usersRes.error?.message,
        ticketsErr: ticketsRes.error?.message,
        assetsErr: assetsRes.error?.message,
      });
      return {
        users: INITIAL_USERS,
        tickets: INITIAL_TICKETS,
        assets: INITIAL_ASSETS,
        spareParts: INITIAL_SPARE_PARTS,
        lineConfig: INITIAL_LINE_CONFIG,
        apiConfig: INITIAL_API_CONFIG,
      };
    }

    const hasData = (usersRes.data && usersRes.data.length > 0) || 
                    (ticketsRes.data && ticketsRes.data.length > 0) || 
                    (assetsRes.data && assetsRes.data.length > 0);

    if (!hasData) {
      console.log('[Supabase] Empty database detected. Seeding initial hospital data...');
      await seedSupabaseInitialData();
      return {
        users: INITIAL_USERS,
        tickets: INITIAL_TICKETS,
        assets: INITIAL_ASSETS,
        spareParts: INITIAL_SPARE_PARTS,
        lineConfig: INITIAL_LINE_CONFIG,
        apiConfig: INITIAL_API_CONFIG,
      };
    }

    // Map DB snake_case to Frontend camelCase User
    const users: User[] = (usersRes.data || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      department: u.department,
      phone: u.phone || '089-0000000',
      avatar: u.avatar || '',
      lineUserId: u.line_user_id,
      password: u.password || 'password123',
    }));

    // Map ComputerAsset
    const assets: ComputerAsset[] = (assetsRes.data || []).map((a: any) => ({
      id: a.id,
      assetCode: a.asset_code,
      name: a.name,
      category: a.category || 'pc',
      brand: a.brand || 'Dell / HP',
      model: a.model || 'Standard',
      serialNumber: a.serial_number || '',
      department: a.department,
      building: a.building || 'อาคารผู้ป่วยนอก',
      floor: a.floor || 'ชั้น 1',
      room: a.room || 'ห้องทำงาน',
      purchaseDate: a.purchase_date || '',
      warrantyExpiry: a.warranty_expiry || '',
      purchasePrice: Number(a.purchase_price || 15000),
      status: a.status || 'active',
      specs: a.specs || 'Intel Core i5, 8GB RAM, 256GB SSD',
      ipAddress: a.ip_address || '192.168.1.10',
      macAddress: a.mac_address || '00:11:22:33:44:55',
      totalRepairCount: a.total_repair_count || 0,
      totalRepairCost: Number(a.total_repair_cost || 0),
      lastMaintenanceDate: a.last_maintenance_date,
    }));

    // Map SparePart
    const spareParts: SparePart[] = (sparePartsRes.data || []).map((sp: any) => ({
      id: sp.id,
      code: sp.code || `SP-${sp.id}`,
      name: sp.name,
      category: sp.category || 'General',
      stockQty: sp.stock_qty || 0,
      minQty: sp.min_qty || sp.min_stock || 3,
      unitPrice: Number(sp.unit_price || 0),
      unit: sp.unit || 'ชิ้น',
    }));

    // Map RepairTicket
    const tickets: RepairTicket[] = (ticketsRes.data || []).map((t: any) => ({
      id: t.id,
      assetId: t.asset_id || '',
      assetCode: t.asset_code || '',
      assetName: t.asset_name || '',
      assetCategory: t.asset_category || 'pc',
      department: t.department,
      location: t.location || '',
      requesterName: t.requester_name,
      requesterPhone: t.requester_phone || '',
      requesterUserId: t.requester_id || '',
      priority: t.priority || 'medium',
      title: t.title,
      description: t.description,
      symptomType: t.symptom_type || 'hardware',
      status: t.status || 'pending',
      createdAt: t.created_at || new Date().toISOString(),
      updatedAt: t.updated_at || new Date().toISOString(),
      assignedTechnicianId: t.technician_id,
      assignedTechnicianName: t.technician_name,
      technicianNotes: t.technician_notes,
      resolutionSummary: t.resolution_summary,
      partsUsed: t.parts_used || [],
      estimatedCost: Number(t.estimated_cost || 0),
      actualCost: Number(t.actual_cost || 0),
      needsApproval: Boolean(t.needs_approval),
      approvalStatus: t.approval_status,
      approvedBy: t.approved_by,
      approvedAt: t.approved_at,
      approvalNotes: t.approval_notes,
      completedAt: t.completed_at,
      closedAt: t.closed_at,
      satisfactionRating: t.satisfaction_rating || undefined,
      logs: t.logs || [],
    }));

    let lineConfig = INITIAL_LINE_CONFIG;
    let apiConfig = INITIAL_API_CONFIG;

    (configRes.data || []).forEach((cfg: any) => {
      if (cfg.key === 'line_config') {
        lineConfig = cfg.config_data as LineNotifyConfig;
      } else if (cfg.key === 'api_config') {
        apiConfig = cfg.config_data as ApiSyncConfig;
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
    console.warn('[Supabase] Connection error, falling back to local mock data:', err);
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

// Seed initial data into Supabase
export async function seedSupabaseInitialData(): Promise<void> {
  try {
    // Users
    const usersPayload = INITIAL_USERS.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      department: u.department,
      phone: u.phone,
      avatar: u.avatar,
      line_user_id: u.lineUserId,
      password: u.password || 'password123',
    }));
    await supabase.from('users').upsert(usersPayload);

    // Assets
    const assetsPayload = INITIAL_ASSETS.map(a => ({
      id: a.id,
      asset_code: a.assetCode,
      name: a.name,
      category: a.category,
      brand: a.brand,
      model: a.model,
      serial_number: a.serialNumber,
      department: a.department,
      building: a.building,
      floor: a.floor,
      room: a.room,
      purchase_date: a.purchaseDate || null,
      warranty_expiry: a.warrantyExpiry || null,
      purchase_price: a.purchasePrice,
      status: a.status,
      specs: a.specs,
      ip_address: a.ipAddress,
      mac_address: a.macAddress,
      total_repair_count: a.totalRepairCount,
      total_repair_cost: a.totalRepairCost,
      last_maintenance_date: a.lastMaintenanceDate || null,
    }));
    await supabase.from('assets').upsert(assetsPayload);

    // Spare Parts
    const partsPayload = INITIAL_SPARE_PARTS.map(sp => ({
      id: sp.id,
      code: sp.code,
      name: sp.name,
      category: sp.category,
      stock_qty: sp.stockQty,
      min_qty: sp.minQty,
      unit_price: sp.unitPrice,
      unit: sp.unit,
    }));
    await supabase.from('spare_parts').upsert(partsPayload);

    // Tickets
    const ticketsPayload = INITIAL_TICKETS.map(t => ({
      id: t.id,
      asset_id: t.assetId || null,
      asset_code: t.assetCode || null,
      asset_name: t.assetName || null,
      asset_category: t.assetCategory || null,
      department: t.department,
      location: t.location || null,
      requester_name: t.requesterName,
      requester_phone: t.requesterPhone,
      requester_id: t.requesterUserId || null,
      priority: t.priority,
      title: t.title,
      description: t.description,
      symptom_type: t.symptomType || 'hardware',
      status: t.status,
      created_at: t.createdAt,
      updated_at: t.updatedAt,
      technician_id: t.assignedTechnicianId || null,
      technician_name: t.assignedTechnicianName || null,
      technician_notes: t.technicianNotes || null,
      resolution_summary: t.resolutionSummary || null,
      parts_used: t.partsUsed || [],
      estimated_cost: t.estimatedCost,
      actual_cost: t.actualCost,
      needs_approval: t.needsApproval,
      approval_status: t.approvalStatus || null,
      approved_by: t.approvedBy || null,
      approved_at: t.approvedAt || null,
      approval_notes: t.approvalNotes || null,
      completed_at: t.completedAt || null,
      closed_at: t.closedAt || null,
      satisfaction_rating: t.satisfactionRating || null,
      logs: t.logs || [],
    }));
    await supabase.from('tickets').upsert(ticketsPayload);

    // Config
    await supabase.from('system_config').upsert([
      { key: 'line_config', config_data: INITIAL_LINE_CONFIG },
      { key: 'api_config', config_data: INITIAL_API_CONFIG }
    ]);

    console.log('[Supabase] Initial seed completed successfully.');
  } catch (err) {
    console.error('[Supabase] Seeding error:', err);
  }
}

// Sync single ticket
export async function syncTicketToSupabase(t: RepairTicket): Promise<void> {
  const payload = {
    id: t.id,
    asset_id: t.assetId || null,
    asset_code: t.assetCode || null,
    asset_name: t.assetName || null,
    asset_category: t.assetCategory || null,
    department: t.department,
    location: t.location || null,
    requester_name: t.requesterName,
    requester_phone: t.requesterPhone,
    requester_id: t.requesterUserId || null,
    priority: t.priority,
    title: t.title,
    description: t.description,
    symptom_type: t.symptomType || 'hardware',
    status: t.status,
    created_at: t.createdAt,
    updated_at: t.updatedAt,
    technician_id: t.assignedTechnicianId || null,
    technician_name: t.assignedTechnicianName || null,
    technician_notes: t.technicianNotes || null,
    resolution_summary: t.resolutionSummary || null,
    parts_used: t.partsUsed || [],
    estimated_cost: t.estimatedCost,
    actual_cost: t.actualCost,
    needs_approval: t.needsApproval,
    approval_status: t.approvalStatus || null,
    approved_by: t.approvedBy || null,
    approved_at: t.approvedAt || null,
    approval_notes: t.approvalNotes || null,
    completed_at: t.completedAt || null,
    closed_at: t.closedAt || null,
    satisfaction_rating: t.satisfactionRating || null,
    logs: t.logs || [],
  };
  await supabase.from('tickets').upsert(payload);
}

// Sync single asset
export async function syncAssetToSupabase(a: ComputerAsset): Promise<void> {
  const payload = {
    id: a.id,
    asset_code: a.assetCode,
    name: a.name,
    category: a.category,
    brand: a.brand,
    model: a.model,
    serial_number: a.serialNumber,
    department: a.department,
    building: a.building,
    floor: a.floor,
    room: a.room,
    purchase_date: a.purchaseDate || null,
    warranty_expiry: a.warrantyExpiry || null,
    purchase_price: a.purchasePrice,
    status: a.status,
    specs: a.specs,
    ip_address: a.ipAddress,
    mac_address: a.macAddress,
    total_repair_count: a.totalRepairCount,
    total_repair_cost: a.totalRepairCost,
    last_maintenance_date: a.lastMaintenanceDate || null,
  };
  await supabase.from('assets').upsert(payload);
}

// Sync single user
export async function syncUserToSupabase(u: User): Promise<void> {
  const payload = {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    department: u.department,
    phone: u.phone,
    avatar: u.avatar,
    line_user_id: u.lineUserId,
    password: u.password || 'password123',
  };
  await supabase.from('users').upsert(payload);
}

// Sync single spare part
export async function syncSparePartToSupabase(sp: SparePart): Promise<void> {
  const payload = {
    id: sp.id,
    code: sp.code,
    name: sp.name,
    category: sp.category,
    stock_qty: sp.stockQty,
    min_qty: sp.minQty,
    unit_price: sp.unitPrice,
    unit: sp.unit,
  };
  await supabase.from('spare_parts').upsert(payload);
}

// Sync config
export async function syncConfigToSupabase(type: 'line' | 'api', configData: Record<string, unknown>): Promise<void> {
  const key = type === 'line' ? 'line_config' : 'api_config';
  await supabase.from('system_config').upsert({ key, config_data: configData });
}

// Sync all data
export async function syncAllToSupabase(data: {
  users?: User[];
  tickets?: RepairTicket[];
  assets?: ComputerAsset[];
  spareParts?: SparePart[];
  lineConfig?: LineNotifyConfig;
  apiConfig?: ApiSyncConfig;
}): Promise<void> {
  if (data.users) {
    const usersPayload = data.users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      department: u.department,
      phone: u.phone,
      avatar: u.avatar,
      line_user_id: u.lineUserId,
      password: u.password || 'password123',
    }));
    await supabase.from('users').upsert(usersPayload);
  }
  if (data.assets) {
    const assetsPayload = data.assets.map(a => ({
      id: a.id,
      asset_code: a.assetCode,
      name: a.name,
      category: a.category,
      brand: a.brand,
      model: a.model,
      serial_number: a.serialNumber,
      department: a.department,
      building: a.building,
      floor: a.floor,
      room: a.room,
      purchase_date: a.purchaseDate || null,
      warranty_expiry: a.warrantyExpiry || null,
      purchase_price: a.purchasePrice,
      status: a.status,
      specs: a.specs,
      ip_address: a.ipAddress,
      mac_address: a.macAddress,
      total_repair_count: a.totalRepairCount,
      total_repair_cost: a.totalRepairCost,
      last_maintenance_date: a.lastMaintenanceDate || null,
    }));
    await supabase.from('assets').upsert(assetsPayload);
  }
  if (data.spareParts) {
    const partsPayload = data.spareParts.map(sp => ({
      id: sp.id,
      code: sp.code,
      name: sp.name,
      category: sp.category,
      stock_qty: sp.stockQty,
      min_qty: sp.minQty,
      unit_price: sp.unitPrice,
      unit: sp.unit,
    }));
    await supabase.from('spare_parts').upsert(partsPayload);
  }
  if (data.tickets) {
    const ticketsPayload = data.tickets.map(t => ({
      id: t.id,
      asset_id: t.assetId || null,
      asset_code: t.assetCode || null,
      asset_name: t.assetName || null,
      asset_category: t.assetCategory || null,
      department: t.department,
      location: t.location || null,
      requester_name: t.requesterName,
      requester_phone: t.requesterPhone,
      requester_id: t.requesterUserId || null,
      priority: t.priority,
      title: t.title,
      description: t.description,
      symptom_type: t.symptomType || 'hardware',
      status: t.status,
      created_at: t.createdAt,
      updated_at: t.updatedAt,
      technician_id: t.assignedTechnicianId || null,
      technician_name: t.assignedTechnicianName || null,
      technician_notes: t.technicianNotes || null,
      resolution_summary: t.resolutionSummary || null,
      parts_used: t.partsUsed || [],
      estimated_cost: t.estimatedCost,
      actual_cost: t.actualCost,
      needs_approval: t.needsApproval,
      approval_status: t.approvalStatus || null,
      approved_by: t.approvedBy || null,
      approved_at: t.approvedAt || null,
      approval_notes: t.approvalNotes || null,
      completed_at: t.completedAt || null,
      closed_at: t.closedAt || null,
      satisfaction_rating: t.satisfactionRating || null,
      logs: t.logs || [],
    }));
    await supabase.from('tickets').upsert(ticketsPayload);
  }
  if (data.lineConfig) {
    await supabase.from('system_config').upsert({ key: 'line_config', config_data: data.lineConfig });
  }
  if (data.apiConfig) {
    await supabase.from('system_config').upsert({ key: 'api_config', config_data: data.apiConfig });
  }
}
