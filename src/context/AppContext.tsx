import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  UserRole, 
  RepairTicket, 
  ComputerAsset, 
  SparePart, 
  TicketStatus, 
  LineNotifyConfig, 
  ApiSyncConfig,
  SparePartItem
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_ASSETS, 
  INITIAL_TICKETS, 
  INITIAL_SPARE_PARTS, 
  INITIAL_LINE_CONFIG, 
  INITIAL_API_CONFIG,
  HOSPITAL_INFO 
} from '../data/mockData';
import {
  initializeSupabaseData,
  syncTicketToSupabase,
  syncAssetToSupabase,
  syncUserToSupabase,
  syncSparePartToSupabase,
  syncConfigToSupabase,
  syncAllToSupabase
} from '../services/supabaseDb';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  isAuthenticated: boolean;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;

  tickets: RepairTicket[];
  addTicket: (ticket: Omit<RepairTicket, 'id' | 'createdAt' | 'updatedAt' | 'logs' | 'status' | 'actualCost'>) => Promise<RepairTicket>;
  updateTicketStatus: (ticketId: string, status: TicketStatus, notes?: string, parts?: SparePartItem[]) => Promise<void>;
  approveTicket: (ticketId: string, approved: boolean, notes?: string) => Promise<void>;
  submitSatisfaction: (ticketId: string, rating: { scoreSpeed: number; scoreQuality: number; scoreService: number; comment?: string }) => Promise<void>;
  
  assets: ComputerAsset[];
  addAsset: (asset: Omit<ComputerAsset, 'id' | 'totalRepairCount' | 'totalRepairCost'>) => Promise<void>;
  updateAsset: (asset: ComputerAsset) => Promise<void>;

  spareParts: SparePart[];
  useSparePart: (partId: string, quantity: number) => Promise<boolean>;

  lineConfig: LineNotifyConfig;
  updateLineConfig: (config: Partial<LineNotifyConfig>) => Promise<void>;
  lineNotifications: Array<{ id: string; timestamp: string; message: string; type: string }>;
  sendMockLineNotify: (message: string, type?: string) => void;

  apiConfig: ApiSyncConfig;
  updateApiConfig: (config: Partial<ApiSyncConfig>) => Promise<void>;
  triggerHisSync: () => Promise<boolean>;
  isSyncingHis: boolean;

  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedTicket: RepairTicket | null;
  setSelectedTicket: (ticket: RepairTicket | null) => void;
  ticketToPrint: RepairTicket | null;
  setTicketToPrint: (ticket: RepairTicket | null) => void;
  satisfactionTicket: RepairTicket | null;
  setSatisfactionTicket: (ticket: RepairTicket | null) => void;

  // Cloud & Supabase status
  isSupabaseConnected: boolean;
  isLoadingSupabase: boolean;
  supabaseError: string | null;
  refreshFromSupabase: () => Promise<void>;

  // Cloud & Backup
  exportBackupJson: () => void;
  importBackupJson: (jsonData: string) => Promise<boolean>;
  resetToDefaultData: () => Promise<void>;
  lastBackupTime: string;

  // Hospital Info
  hospitalInfo: typeof HOSPITAL_INFO;
}

const STORAGE_KEY = 'sangkhla_hospital_it_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage as instant cache
  const loadInitialData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved state:', e);
    }
    return null;
  };

  const initialSaved = loadInitialData();

  const [users, setUsers] = useState<User[]>(initialSaved?.users || INITIAL_USERS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialSaved?.isAuthenticated !== undefined ? initialSaved.isAuthenticated : false
  );
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (initialSaved?.currentUserId) {
      const found = (initialSaved.users || INITIAL_USERS).find((u: User) => u.id === initialSaved.currentUserId);
      if (found) return found;
    }
    return (initialSaved?.users || INITIAL_USERS).find((u: User) => u.role === 'technician') || INITIAL_USERS[1];
  });
  const [tickets, setTickets] = useState<RepairTicket[]>(initialSaved?.tickets || INITIAL_TICKETS);
  const [assets, setAssets] = useState<ComputerAsset[]>(initialSaved?.assets || INITIAL_ASSETS);
  const [spareParts, setSpareParts] = useState<SparePart[]>(initialSaved?.spareParts || INITIAL_SPARE_PARTS);
  const [lineConfig, setLineConfig] = useState<LineNotifyConfig>(initialSaved?.lineConfig || INITIAL_LINE_CONFIG);
  const [apiConfig, setApiConfig] = useState<ApiSyncConfig>(initialSaved?.apiConfig || INITIAL_API_CONFIG);
  const [lastBackupTime, setLastBackupTime] = useState<string>(
    initialSaved?.lastBackupTime || new Date().toISOString()
  );

  // Supabase status state
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState<boolean>(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null);
  const [ticketToPrint, setTicketToPrint] = useState<RepairTicket | null>(null);
  const [satisfactionTicket, setSatisfactionTicket] = useState<RepairTicket | null>(null);
  const [isSyncingHis, setIsSyncingHis] = useState<boolean>(false);

  const [lineNotifications, setLineNotifications] = useState<Array<{ id: string; timestamp: string; message: string; type: string }>>([
    {
      id: 'notif-1',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      message: '🚨 [แจ้งซ่อมเร่งด่วน ER] คอมพิวเตอร์ประมวลผลระบบคัดกรองผู้ป่วย (คร.7440-001-0012/65) อาการ: เปิดไม่ติด มีเสียง Beep 3 ครั้ง',
      type: 'critical',
    },
    {
      id: 'notif-2',
      timestamp: new Date(Date.now() - 7200000).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      message: '⚠️ [รออนุมัติงบ] งานซ่อม UPS ห้องผ่าตัด OR-1 มูลค่าเสนอซ่อม 3,400 บาท ต้องการการอนุมัติจากหัวหน้างาน IT',
      type: 'approval',
    }
  ]);

  // Connect & sync with Supabase on mount
  const refreshFromSupabase = useCallback(async () => {
    setIsLoadingSupabase(true);
    setSupabaseError(null);
    try {
      const data = await initializeSupabaseData();
      setUsers(data.users);
      setTickets(data.tickets);
      setAssets(data.assets);
      setSpareParts(data.spareParts);
      setLineConfig(data.lineConfig);
      setApiConfig(data.apiConfig);
      setIsSupabaseConnected(true);
      console.log('[Supabase] Connected successfully to Supabase PostgreSQL.');
    } catch (err: unknown) {
      console.error('[Supabase] Connection error:', err);
      const msg = err instanceof Error ? err.message : 'Unknown Supabase error';
      setSupabaseError(msg);
    } finally {
      setIsLoadingSupabase(false);
    }
  }, []);

  useEffect(() => {
    refreshFromSupabase();
  }, [refreshFromSupabase]);

  // Sync to localStorage as offline cache
  useEffect(() => {
    try {
      const dataToSave = {
        users,
        tickets,
        assets,
        spareParts,
        lineConfig,
        apiConfig,
        lastBackupTime,
        isAuthenticated,
        currentUserId: currentUser.id,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Storage quota or error:', e);
    }
  }, [users, tickets, assets, spareParts, lineConfig, apiConfig, lastBackupTime, isAuthenticated, currentUser.id]);

  const login = async (identifier: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 350));
    const trimmedId = identifier.trim().toLowerCase();

    const foundUser = users.find(u => 
      u.email.toLowerCase() === trimmedId || 
      u.id.toLowerCase() === trimmedId ||
      u.name.toLowerCase().includes(trimmedId)
    );

    if (!foundUser) {
      return { success: false, message: 'ไม่พบบัญชีผู้ใช้งานนี้ในระบบโรงพยาบาล โปรดตรวจสอบอีเมลหรือรหัสพนักงาน' };
    }

    if (password && foundUser.password && foundUser.password !== password) {
      return { success: false, message: 'รหัสผ่านไม่ถูกต้อง โปรดตรวจสอบรหัสผ่านอีกครั้ง (รหัสผ่านเริ่มต้น: password123)' };
    }

    setCurrentUser(foundUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const loginAsRole = (role: UserRole) => {
    const roleUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(roleUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const sendMockLineNotify = (message: string, type: string = 'info') => {
    if (!lineConfig.enabled) return;
    const newNotif = {
      id: `line-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      message,
      type,
    };
    setLineNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
  };

  const addUser = async (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
    };
    setUsers(prev => [...prev, newUser]);
    try {
      await syncUserToSupabase(newUser);
    } catch (err) {
      console.error('[Supabase] Failed to sync new user:', err);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    let updatedUser: User | null = null;
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        updatedUser = { ...u, role: newRole };
        return updatedUser;
      }
      return u;
    }));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }
    if (updatedUser) {
      try {
        await syncUserToSupabase(updatedUser);
      } catch (err) {
        console.error('[Supabase] Failed to sync user role:', err);
      }
    }
  };

  const addTicket = async (ticketData: Omit<RepairTicket, 'id' | 'createdAt' | 'updatedAt' | 'logs' | 'status' | 'actualCost'>): Promise<RepairTicket> => {
    const newIdNumber = (tickets.length + 344).toString().padStart(4, '0');
    const newId = `SKL-IT-2026-${newIdNumber}`;
    const nowIso = new Date().toISOString();

    const newTicket: RepairTicket = {
      ...ticketData,
      id: newId,
      status: ticketData.needsApproval ? 'approved_wait' : 'pending',
      actualCost: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
      logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: nowIso,
          actor: currentUser.name,
          actorRole: currentUser.role === 'technician' ? 'ช่างเทคนิคคอมพิวเตอร์' : 'ผู้แจ้งซ่อม',
          action: `เปิดใบแจ้งซ่อมใหม่ (${ticketData.priority.toUpperCase()})`,
          notes: ticketData.description,
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);

    // Update asset status to under_repair
    let updatedAsset: ComputerAsset | null = null;
    if (ticketData.assetId) {
      setAssets(prev => prev.map(a => {
        if (a.id === ticketData.assetId) {
          updatedAsset = { ...a, status: 'under_repair', totalRepairCount: a.totalRepairCount + 1 };
          return updatedAsset;
        }
        return a;
      }));
    }

    // LINE Notification
    if (lineConfig.notifyOnNewTicket) {
      const urgencyIcons: Record<string, string> = {
        critical: '🚨 [ฉุกเฉินระดับ 1]',
        high: '🔴 [เร่งด่วน]',
        medium: '🟡 [ปกติ]',
        low: '🟢 [ต่ำ]',
      };
      sendMockLineNotify(
        `${urgencyIcons[ticketData.priority] || '📢'} แจ้งซ่อมใหม่ เลขที่ ${newId}\nครุภัณฑ์: ${ticketData.assetName} (${ticketData.assetCode})\nแผนก: ${ticketData.department}\nอาการ: ${ticketData.title}\nผู้แจ้ง: ${ticketData.requesterName} (โทร. ${ticketData.requesterPhone})`,
        ticketData.priority === 'critical' ? 'critical' : 'new'
      );
    }

    // Sync to Supabase
    try {
      await syncTicketToSupabase(newTicket);
      if (updatedAsset) {
        await syncAssetToSupabase(updatedAsset);
      }
    } catch (err) {
      console.error('[Supabase] Failed to sync new ticket to Supabase:', err);
    }

    return newTicket;
  };

  const updateTicketStatus = async (
    ticketId: string, 
    status: TicketStatus, 
    notes?: string, 
    parts?: SparePartItem[]
  ) => {
    const nowIso = new Date().toISOString();
    let targetTicket: RepairTicket | null = null;
    let targetAsset: ComputerAsset | null = null;

    const statusLabels: Record<TicketStatus, string> = {
      pending: 'รอดำเนินการรับเรื่อง',
      approved_wait: 'รอการอนุมัติงบ/อะไหล่',
      in_progress: 'กำลังดำเนินการซ่อม',
      waiting_parts: 'รออะไหล่/จัดซื้อ',
      completed: 'ซ่อมแซมเสร็จสิ้น / รอส่งมอบงาน',
      closed: 'ปิดงานเรียบร้อยแล้ว',
    };

    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;

      const updatedParts = parts !== undefined ? parts : t.partsUsed;
      const partsTotalCost = updatedParts.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0);

      // Deduct inventory if new parts were added
      if (parts && parts.length > 0) {
        parts.forEach(p => {
          useSparePart(p.partId, p.quantity);
        });
      }

      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: nowIso,
        actor: currentUser.name,
        actorRole: currentUser.role,
        action: `เปลี่ยนสถานะเป็น: ${statusLabels[status]}`,
        notes: notes || t.technicianNotes,
      };

      const updatedTicket: RepairTicket = {
        ...t,
        status,
        updatedAt: nowIso,
        technicianNotes: notes || t.technicianNotes,
        partsUsed: updatedParts,
        actualCost: partsTotalCost,
        completedAt: status === 'completed' && !t.completedAt ? nowIso : t.completedAt,
        closedAt: status === 'closed' && !t.closedAt ? nowIso : t.closedAt,
        assignedTechnicianName: t.assignedTechnicianName || (currentUser.role === 'technician' ? currentUser.name : undefined),
        logs: [newLog, ...t.logs],
      };

      targetTicket = updatedTicket;

      // Also update asset maintenance cost & status if closed/completed
      if (status === 'completed' || status === 'closed') {
        setAssets(aList => aList.map(a => {
          if (a.id === t.assetId) {
            targetAsset = { 
              ...a, 
              status: 'active', 
              totalRepairCost: a.totalRepairCost + partsTotalCost, 
              lastMaintenanceDate: nowIso.split('T')[0] 
            };
            return targetAsset;
          }
          return a;
        }));
      }

      // LINE Notify
      if (lineConfig.notifyOnStatusChange) {
        sendMockLineNotify(
          `🔄 [อัปเดตสถานะงาน] ใบงาน ${t.id}\nสถานะใหม่: ${statusLabels[status]}\nผู้ปรับปรุง: ${currentUser.name}\nหมายเหตุ: ${notes || '-'}`
        );
      }

      return updatedTicket;
    }));

    if (targetTicket) {
      try {
        await syncTicketToSupabase(targetTicket);
        if (targetAsset) {
          await syncAssetToSupabase(targetAsset);
        }
      } catch (err) {
        console.error('[Supabase] Failed to sync ticket status update:', err);
      }
    }
  };

  const approveTicket = async (ticketId: string, approved: boolean, notes?: string) => {
    const nowIso = new Date().toISOString();
    let updatedTicket: RepairTicket | null = null;

    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;

      const newStatus: TicketStatus = approved ? 'in_progress' : 'closed';
      const log = {
        id: `log-${Date.now()}`,
        timestamp: nowIso,
        actor: currentUser.name,
        actorRole: currentUser.role === 'supervisor' ? 'หัวหน้างาน IT' : 'ผู้บริหาร รพ.',
        action: approved ? 'อนุมัติการซ่อมและเบิกจ่ายงบประมาณ' : 'ไม่อนุมัติการซ่อม (ยกเลิก/ส่งซ่อมภายนอก)',
        notes: notes || '',
      };

      if (lineConfig.notifyOnApprovalRequired) {
        sendMockLineNotify(
          `${approved ? '✅' : '❌'} [ผลการพิจารณาอนุมัติ] ใบงาน ${t.id}\nผล: ${approved ? 'อนุมัติงบประมาณ' : 'ไม่อนุมัติ'}\nผู้อนุมัติ: ${currentUser.name}\nความเห็น: ${notes || '-'}`
        );
      }

      updatedTicket = {
        ...t,
        status: newStatus,
        approvalStatus: approved ? 'approved' : 'rejected',
        approvedBy: currentUser.name,
        approvedAt: nowIso,
        approvalNotes: notes,
        updatedAt: nowIso,
        logs: [log, ...t.logs],
      };

      return updatedTicket;
    }));

    if (updatedTicket) {
      try {
        await syncTicketToSupabase(updatedTicket);
      } catch (err) {
        console.error('[Supabase] Failed to sync ticket approval:', err);
      }
    }
  };

  const submitSatisfaction = async (
    ticketId: string, 
    rating: { scoreSpeed: number; scoreQuality: number; scoreService: number; comment?: string }
  ) => {
    const nowIso = new Date().toISOString();
    const average = Number(((rating.scoreSpeed + rating.scoreQuality + rating.scoreService) / 3).toFixed(2));
    let updatedTicket: RepairTicket | null = null;

    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;

      const log = {
        id: `log-${Date.now()}`,
        timestamp: nowIso,
        actor: currentUser.name,
        actorRole: 'ผู้ประเมินความพึงพอใจ',
        action: `บันทึกประเมินความพึงพอใจ: ${average}/5.00 คะแนน`,
        notes: rating.comment || 'ไม่มีความคิดเห็นเพิ่มเติม',
      };

      updatedTicket = {
        ...t,
        status: 'closed',
        closedAt: t.closedAt || nowIso,
        updatedAt: nowIso,
        satisfactionRating: {
          ...rating,
          average,
          evaluatedAt: nowIso,
        },
        logs: [log, ...t.logs],
      };

      return updatedTicket;
    }));

    if (updatedTicket) {
      try {
        await syncTicketToSupabase(updatedTicket);
      } catch (err) {
        console.error('[Supabase] Failed to sync satisfaction rating:', err);
      }
    }
  };

  const addAsset = async (assetData: Omit<ComputerAsset, 'id' | 'totalRepairCount' | 'totalRepairCost'>) => {
    const newAsset: ComputerAsset = {
      ...assetData,
      id: `ast-${Date.now()}`,
      totalRepairCount: 0,
      totalRepairCost: 0,
    };
    setAssets(prev => [newAsset, ...prev]);
    try {
      await syncAssetToSupabase(newAsset);
    } catch (err) {
      console.error('[Supabase] Failed to sync new asset:', err);
    }
  };

  const updateAsset = async (updated: ComputerAsset) => {
    setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
    try {
      await syncAssetToSupabase(updated);
    } catch (err) {
      console.error('[Supabase] Failed to sync asset update:', err);
    }
  };

  const useSparePart = async (partId: string, quantity: number): Promise<boolean> => {
    let success = false;
    let targetPart: SparePart | null = null;

    setSpareParts(prev => prev.map(p => {
      if (p.id === partId) {
        if (p.stockQty >= quantity) {
          success = true;
          targetPart = { ...p, stockQty: p.stockQty - quantity };
          return targetPart;
        }
      }
      return p;
    }));

    if (targetPart) {
      try {
        await syncSparePartToSupabase(targetPart);
      } catch (err) {
        console.error('[Supabase] Failed to sync spare part stock:', err);
      }
    }

    return success;
  };

  const updateLineConfig = async (cfg: Partial<LineNotifyConfig>) => {
    const updated = { ...lineConfig, ...cfg };
    setLineConfig(updated);
    try {
      await syncConfigToSupabase('line', updated);
    } catch (err) {
      console.error('[Supabase] Failed to sync line config:', err);
    }
  };

  const updateApiConfig = async (cfg: Partial<ApiSyncConfig>) => {
    const updated = { ...apiConfig, ...cfg };
    setApiConfig(updated);
    try {
      await syncConfigToSupabase('api', updated);
    } catch (err) {
      console.error('[Supabase] Failed to sync api config:', err);
    }
  };

  const triggerHisSync = async (): Promise<boolean> => {
    setIsSyncingHis(true);
    await new Promise(res => setTimeout(res, 1800)); // Simulate realistic network roundtrip
    const nowIso = new Date().toISOString();
    const updated = {
      ...apiConfig,
      lastSyncTimestamp: nowIso,
    };
    setApiConfig(updated);
    try {
      await syncConfigToSupabase('api', updated);
    } catch (err) {
      console.error('[Supabase] Failed to sync API sync time:', err);
    }
    setIsSyncingHis(false);
    return true;
  };

  const exportBackupJson = () => {
    const backupData = {
      hospital: HOSPITAL_INFO,
      exportTimestamp: new Date().toISOString(),
      users,
      tickets,
      assets,
      spareParts,
      lineConfig,
      apiConfig,
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `sangkhla_hospital_it_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setLastBackupTime(new Date().toISOString());
  };

  const importBackupJson = async (jsonData: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.tickets && parsed.assets) {
        if (parsed.users) setUsers(parsed.users);
        if (parsed.tickets) setTickets(parsed.tickets);
        if (parsed.assets) setAssets(parsed.assets);
        if (parsed.spareParts) setSpareParts(parsed.spareParts);
        if (parsed.lineConfig) setLineConfig(parsed.lineConfig);
        if (parsed.apiConfig) setApiConfig(parsed.apiConfig);
        setLastBackupTime(new Date().toISOString());

        // Sync imported data to Supabase
        await syncAllToSupabase({
          users: parsed.users,
          tickets: parsed.tickets,
          assets: parsed.assets,
          spareParts: parsed.spareParts,
          lineConfig: parsed.lineConfig,
          apiConfig: parsed.apiConfig,
        });

        return true;
      }
      return false;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  };

  const resetToDefaultData = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[1]);
    setIsAuthenticated(false);
    setTickets(INITIAL_TICKETS);
    setAssets(INITIAL_ASSETS);
    setSpareParts(INITIAL_SPARE_PARTS);
    setLineConfig(INITIAL_LINE_CONFIG);
    setApiConfig(INITIAL_API_CONFIG);
    setLastBackupTime(new Date().toISOString());

    // Reset data in Supabase
    try {
      await syncAllToSupabase({
        users: INITIAL_USERS,
        tickets: INITIAL_TICKETS,
        assets: INITIAL_ASSETS,
        spareParts: INITIAL_SPARE_PARTS,
        lineConfig: INITIAL_LINE_CONFIG,
        apiConfig: INITIAL_API_CONFIG,
      });
    } catch (err) {
      console.error('[Supabase] Failed to reset Supabase data:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        addUser,
        updateUserRole,
        isAuthenticated,
        login,
        loginAsRole,
        logout,
        tickets,
        addTicket,
        updateTicketStatus,
        approveTicket,
        submitSatisfaction,
        assets,
        addAsset,
        updateAsset,
        spareParts,
        useSparePart,
        lineConfig,
        updateLineConfig,
        lineNotifications,
        sendMockLineNotify,
        apiConfig,
        updateApiConfig,
        triggerHisSync,
        isSyncingHis,
        currentTab,
        setCurrentTab,
        selectedTicket,
        setSelectedTicket,
        ticketToPrint,
        setTicketToPrint,
        satisfactionTicket,
        setSatisfactionTicket,
        isSupabaseConnected,
        isLoadingSupabase,
        supabaseError,
        refreshFromSupabase,
        exportBackupJson,
        importBackupJson,
        resetToDefaultData,
        lastBackupTime,
        hospitalInfo: HOSPITAL_INFO,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
