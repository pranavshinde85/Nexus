import { VaultFile, Folder } from '../types';

const day = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const initialFolders: Folder[] = [
  { id: 'f1', name: 'Work', parentId: null, children: ['f3'], fileCount: 5, color: '#3B82F6' },
  { id: 'f2', name: 'Personal', parentId: null, children: ['f4'], fileCount: 4, color: '#10B981' },
  { id: 'f3', name: 'Projects', parentId: 'f1', children: [], fileCount: 3, color: '#7C3AED' },
  { id: 'f4', name: 'Travel', parentId: 'f2', children: [], fileCount: 2, color: '#F59E0B' },
];

export const initialFiles: VaultFile[] = [
  { id: 'vf1', name: 'Q4 Financial Report.pdf', type: 'application/pdf', category: 'documents', size: 2457600, dateUploaded: day(2), tags: ['finance', 'quarterly'], starred: true, folderId: 'f1', secure: false },
  { id: 'vf2', name: 'Contract_Draft_v2.docx', type: 'application/docx', category: 'documents', size: 184320, dateUploaded: day(5), tags: ['legal', 'draft'], starred: false, folderId: 'f1', secure: true },
  { id: 'vf3', name: 'Meeting Notes Dec.pdf', type: 'application/pdf', category: 'documents', size: 512000, dateUploaded: day(8), tags: ['meetings', 'work'], starred: false, folderId: 'f1', secure: false },
  { id: 'vf4', name: 'Resume_2024.pdf', type: 'application/pdf', category: 'documents', size: 358400, dateUploaded: day(30), tags: ['personal', 'career'], starred: true, folderId: 'f2', secure: false },
  { id: 'vf5', name: 'Budget_Sheet.xlsx', type: 'application/xlsx', category: 'documents', size: 143360, dateUploaded: day(3), tags: ['finance', 'planning'], starred: false, folderId: 'f1', secure: false },
  { id: 'vf6', name: 'Vacation_Sunset.jpg', type: 'image/jpeg', category: 'images', size: 3145728, dateUploaded: day(15), tags: ['vacation', 'travel'], starred: true, folderId: 'f4', secure: false },
  { id: 'vf7', name: 'Team_Photo_2024.png', type: 'image/png', category: 'images', size: 4194304, dateUploaded: day(20), tags: ['team', 'work'], starred: false, folderId: 'f1', secure: false },
  { id: 'vf8', name: 'App_Mockup_v3.png', type: 'image/png', category: 'images', size: 1572864, dateUploaded: day(1), tags: ['design', 'ui'], starred: true, folderId: 'f3', secure: false },
  { id: 'vf9', name: 'Product_Screenshot.jpg', type: 'image/jpeg', category: 'images', size: 921600, dateUploaded: day(4), tags: ['product', 'screenshot'], starred: false, folderId: 'f3', secure: false },
  { id: 'vf10', name: 'Logo_Final.svg', type: 'image/svg+xml', category: 'images', size: 24576, dateUploaded: day(10), tags: ['branding', 'logo'], starred: false, folderId: 'f3', secure: false },
  { id: 'vf11', name: 'Sprint_Presentation.mp4', type: 'video/mp4', category: 'videos', size: 52428800, dateUploaded: day(7), tags: ['presentation', 'work'], starred: false, folderId: 'f1', secure: false },
  { id: 'vf12', name: 'React_Tutorial.mp4', type: 'video/mp4', category: 'videos', size: 157286400, dateUploaded: day(25), tags: ['learning', 'react'], starred: true, folderId: null, secure: false },
  { id: 'vf13', name: 'Travel_Vlog_Clip.mov', type: 'video/quicktime', category: 'videos', size: 31457280, dateUploaded: day(12), tags: ['travel', 'personal'], starred: false, folderId: 'f4', secure: false },
  { id: 'vf14', name: 'Project_Backup.zip', type: 'application/zip', category: 'others', size: 104857600, dateUploaded: day(6), tags: ['backup', 'archive'], starred: false, folderId: 'f3', secure: false },
  { id: 'vf15', name: 'analytics_data.json', type: 'application/json', category: 'others', size: 81920, dateUploaded: day(3), tags: ['data', 'analytics'], starred: false, folderId: 'f1', secure: false },
  { id: 'vf16', name: 'contacts_export.csv', type: 'text/csv', category: 'others', size: 40960, dateUploaded: day(14), tags: ['contacts', 'export'], starred: false, folderId: 'f2', secure: true },
  { id: 'vf17', name: 'server_config.yaml', type: 'text/yaml', category: 'others', size: 8192, dateUploaded: day(9), tags: ['config', 'devops'], starred: false, folderId: null, secure: false },
  { id: 'vf18', name: 'README.md', type: 'text/markdown', category: 'others', size: 12288, dateUploaded: day(1), tags: ['docs', 'project'], starred: false, folderId: 'f3', secure: false },
];
