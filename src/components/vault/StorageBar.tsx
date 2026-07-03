import { useVaultStore } from '../../stores/vaultStore';
import { formatFileSize } from '../../utils/formatters';

export function StorageBar() {
  const files = useVaultStore((s) => s.files);
  const totalUsed = files.reduce((sum, f) => sum + f.size, 0);
  const totalStorage = 15 * 1024 * 1024 * 1024; // 15 GB
  const percentage = Math.min((totalUsed / totalStorage) * 100, 100);

  return (
    <div className="px-4 py-3 border-b border-white/[0.06]">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-text-secondary">{formatFileSize(totalUsed)} used</span>
        <span className="text-text-muted">15 GB</span>
      </div>
      <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full gradient-violet-horizontal glow-violet-sm transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
