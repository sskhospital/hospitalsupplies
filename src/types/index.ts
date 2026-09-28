export type UserRole = 'requester' | 'technician' | 'supervisor' | 'executive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone: string;
  avatar?: string;
  lineUserId?: string;
  password?: string;
}

export type TicketStatus = 
  | 'pending'       // รอดำเนินการรับเรื่อง
  | 'approved_wait' // รออนุมัติงบ/อะไหล่
  | 'in_progress'   // กำลังซ่อมบำรุง
  | 'waiting_parts' // รออะไหล่
  | 'completed'     // ซ่อมเสร็จสิ้น / รอส่งมอบ
  | 'closed';       // ปิดงานเรียบร้อย / ประเมินแล้ว

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface SparePartItem {
  partId: string;
  name: string;
  code: string;
  quantity: number;
  unitPrice: number;
}

export interface TicketLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  notes?: string;
}

export interface RepairTicket {
  id: string; // e.g. "SKL-IT-2026-0042"
  assetId: string;
  assetCode: string;
  assetName: string;
  assetCategory: string;
  department: string;
  location: string;
  requesterName: string;
  requesterPhone: string;
  requesterUserId: string;
  priority: Priority;
  title: string;
  description: string;
  symptomType: 'hardware' | 'software' | 'network' | 'printer' | 'other';
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  technicianNotes?: string;
  resolutionSummary?: string;
  partsUsed: SparePartItem[];
  estimatedCost: number;
  actualCost: number;
  needsApproval: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  approvalNotes?: string;
  completedAt?: string;
  closedAt?: string;
  satisfactionRating?: {
    scoreSpeed: number; // 1-5
    scoreQuality: number; // 1-5
    scoreService: number; // 1-5
    average: number;
    comment?: string;
    evaluatedAt: string;
  };
  logs: TicketLog[];
}

export interface ComputerAsset {
  id: string;
  assetCode: string; // e.g. "คร.7440-001-0024/65"
  name: string;
  category: 'pc' | 'aio' | 'laptop' | 'printer' | 'scanner' | 'network' | 'ups' | 'other';
  brand: string;
  model: string;
  serialNumber: string;
  department: string;
  building: string;
  floor: string;
  room: string;
  purchaseDate: string;
  warrantyExpiry: string;
  purchasePrice: number;
  status: 'active' | 'under_repair' | 'standby' | 'decommissioned';
  specs?: string;
  ipAddress?: string;
  macAddress?: string;
  totalRepairCount: number;
  totalRepairCost: number;
  lastMaintenanceDate?: string;
}

export interface SparePart {
  id: string;
  code: string;
  name: string;
  category: string;
  stockQty: number;
  minQty: number;
  unitPrice: number;
  unit: string;
}

export interface HospitalDepartment {
  id: string;
  name: string;
  building: string;
  contactPerson: string;
  phoneExt: string;
}

export interface LineNotifyConfig {
  enabled: boolean;
  token: string;
  targetGroup: string;
  notifyOnNewTicket: boolean;
  notifyOnStatusChange: boolean;
  notifyOnApprovalRequired: boolean;
  notifyOnCompletion: boolean;
}

export interface ApiSyncConfig {
  enabled: boolean;
  hisProvider: 'HOSxP' | 'JHCIS' | 'CustomAPI';
  endpointUrl: string;
  apiKey: string;
  lastSyncTimestamp: string;
  syncIntervalHours: number;
  autoSync: boolean;
}
