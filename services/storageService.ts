
import { AppData, Group, ScoreLog } from '../types';

const STORAGE_KEY = 'ieee_leaderboard_data';
const ADMIN_PWD_KEY = 'ieee_admin_password';

const initialData: AppData = {
  groups: [
    { id: '1', name: 'Quantum Knights', accessCode: 'IEEE-101', score: 0, logs: [] },
    { id: '2', name: 'Silicon Pioneers', accessCode: 'IEEE-102', score: 0, logs: [] },
    { id: '3', name: 'Digital Dynamo', accessCode: 'IEEE-103', score: 0, logs: [] },
  ],
  activityLogs: [`System initialized at ${new Date().toLocaleString()}`],
};

export const storageService = {
  getData: (): AppData => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initialData;
  },

  saveData: (data: AppData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  getAdminPassword: (): string => {
    return localStorage.getItem(ADMIN_PWD_KEY) || 'IEEEAdmin2025';
  },

  setAdminPassword: (newPassword: string): void => {
    localStorage.setItem(ADMIN_PWD_KEY, newPassword);
    const data = storageService.getData();
    data.activityLogs.unshift(`Admin password updated at ${new Date().toLocaleString()}`);
    storageService.saveData(data);
  },

  addGroup: (name: string): Group => {
    const data = storageService.getData();
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      accessCode: `IEEE-${Math.floor(100 + Math.random() * 900)}`,
      score: 0,
      logs: [],
    };
    data.groups.push(newGroup);
    data.activityLogs.unshift(`Group added: ${name}`);
    storageService.saveData(data);
    return newGroup;
  },

  updateGroup: (id: string, updates: Partial<Group>): void => {
    const data = storageService.getData();
    const index = data.groups.findIndex(g => g.id === id);
    if (index !== -1) {
      const oldGroup = data.groups[index];
      data.groups[index] = { ...oldGroup, ...updates };
      
      if (updates.name && updates.name !== oldGroup.name) {
        data.activityLogs.unshift(`Group renamed: ${oldGroup.name} -> ${updates.name}`);
      }
      if (updates.accessCode && updates.accessCode !== oldGroup.accessCode) {
        data.activityLogs.unshift(`Access code for ${data.groups[index].name} updated`);
      }
      
      storageService.saveData(data);
    }
  },

  updateScore: (groupId: string, newScore: number, adminId: string): void => {
    const data = storageService.getData();
    const group = data.groups.find(g => g.id === groupId);
    if (group) {
      const log: ScoreLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        oldScore: group.score,
        newScore: newScore,
        adminId: adminId,
      };
      group.score = newScore;
      group.logs.unshift(log);
      data.activityLogs.unshift(`Score updated for ${group.name}: ${log.oldScore} -> ${newScore}`);
      storageService.saveData(data);
    }
  },

  deleteGroup: (id: string): void => {
    const data = storageService.getData();
    const groupName = data.groups.find(g => g.id === id)?.name;
    data.groups = data.groups.filter(g => g.id !== id);
    data.activityLogs.unshift(`Group deleted: ${groupName}`);
    storageService.saveData(data);
  }
};
