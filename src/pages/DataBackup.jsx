import { useEffect, useRef, useState } from 'react';
import { Download, Upload, FileSpreadsheet, FileJson, RotateCcw, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { exportToExcel, importFromExcel } from '../services/excelService';
import { exportToJSON, importFromJSON } from '../services/jsonBackupService';
import { loadDemoData, clearAllData } from '../services/seedService';
import {
  UsersRepo, TasksRepo, GoalsRepo, ActivitiesRepo, getMeta,
} from '../db/repository';
import { formatTimestamp } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

export default function DataBackup() {
  const { refresh, isDemo } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const excelInputRef = useRef(null);
  const jsonInputRef = useRef(null);

  const [counts, setCounts] = useState({ users: 0, tasks: 0, goals: 0, activities: 0 });
  const [lastBackup, setLastBackup] = useState(null);
  const [confirmRestore, setConfirmRestore] = useState(null); // { type, file }
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [busy, setBusy] = useState(false);

  const loadStats = async () => {
    const [users, tasks, goals, activities, lb] = await Promise.all([
      UsersRepo.all(), TasksRepo.all(), GoalsRepo.all(), ActivitiesRepo.all(), getMeta('lastBackup', null),
    ]);
    setCounts({ users: users.length, tasks: tasks.length, goals: goals.length, activities: activities.length });
    setLastBackup(lb);
  };

  useEffect(() => { loadStats(); }, []);

  const doExportExcel = async () => {
    setBusy(true);
    try {
      await exportToExcel();
      showToast('Excel backup downloaded 📊');
      loadStats();
    } catch {
      showToast('Could not export backup. Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const doExportJSON = async () => {
    setBusy(true);
    try {
      await exportToJSON();
      showToast('JSON backup downloaded 📄');
      loadStats();
    } catch {
      showToast('Could not export backup. Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleFileSelected = (type, e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setConfirmRestore({ type, file });
  };

  const performRestore = async () => {
    if (!confirmRestore) return;
    setBusy(true);
    try {
      if (confirmRestore.type === 'excel') {
        await importFromExcel(confirmRestore.file);
      } else {
        await importFromJSON(confirmRestore.file);
      }
      refresh();
      await loadStats();
      showToast('Your backup has been restored successfully! 💕');
    } catch {
      showToast('Unable to restore this file. Please select a valid GrowTogether backup.', 'error');
    } finally {
      setBusy(false);
      setConfirmRestore(null);
    }
  };

  const doResetDemo = async () => {
    setBusy(true);
    await loadDemoData();
    refresh();
    await loadStats();
    showToast('Demo data reset 🌸');
    setBusy(false);
  };

  const doClearAll = async () => {
    setBusy(true);
    await clearAllData();
    refresh();
    showToast('All data cleared');
    setBusy(false);
    navigate('/', { replace: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-white">Data & Backup</h1>
        <p className="text-sm text-muted">🔒 Your data is stored locally on this device.</p>
      </div>

      <Card>
        <h2 className="font-semibold text-sm text-ink dark:text-white mb-3">Storage Status</h2>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-slate-700">
            <p className="font-bold text-lg text-ink dark:text-white">{counts.users}</p>
            <p className="text-[11px] text-muted">Users</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-slate-700">
            <p className="font-bold text-lg text-ink dark:text-white">{counts.tasks}</p>
            <p className="text-[11px] text-muted">Tasks</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-slate-700">
            <p className="font-bold text-lg text-ink dark:text-white">{counts.goals}</p>
            <p className="text-[11px] text-muted">Goals</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-slate-700">
            <p className="font-bold text-lg text-ink dark:text-white">{counts.activities}</p>
            <p className="text-[11px] text-muted">Activities</p>
          </div>
        </div>
        <p className="text-xs text-muted mt-3 text-center">
          Last Backup: <span className="font-medium text-ink dark:text-white">{lastBackup ? formatTimestamp(lastBackup) : 'Never'}</span>
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold text-sm text-ink dark:text-white mb-3">Excel Backup</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" icon={<FileSpreadsheet size={16} />} disabled={busy} onClick={doExportExcel}>Export Excel</Button>
          <Button variant="outline" icon={<Upload size={16} />} disabled={busy} onClick={() => excelInputRef.current?.click()}>Restore Excel</Button>
        </div>
        <input ref={excelInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => handleFileSelected('excel', e)} />
      </Card>

      <Card>
        <h2 className="font-semibold text-sm text-ink dark:text-white mb-3">JSON Backup</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" icon={<FileJson size={16} />} disabled={busy} onClick={doExportJSON}>Export JSON</Button>
          <Button variant="outline" icon={<Download size={16} />} disabled={busy} onClick={() => jsonInputRef.current?.click()}>Import JSON</Button>
        </div>
        <input ref={jsonInputRef} type="file" accept=".json" className="hidden" onChange={(e) => handleFileSelected('json', e)} />
      </Card>

      <Card>
        <h2 className="font-semibold text-sm text-ink dark:text-white mb-3">Demo Data</h2>
        <Button variant="secondary" icon={<RotateCcw size={16} />} fullWidth disabled={busy} onClick={() => setConfirmReset(true)}>
          Reset Demo Data {isDemo && '(active)'}
        </Button>
      </Card>

      <Card className="border-danger/30">
        <h2 className="font-semibold text-sm text-danger mb-3">Danger Zone</h2>
        <Button variant="danger" icon={<Trash2 size={16} />} fullWidth disabled={busy} onClick={() => setConfirmClear(true)}>
          Clear All Application Data
        </Button>
      </Card>

      <ConfirmDialog
        open={!!confirmRestore}
        onClose={() => setConfirmRestore(null)}
        onConfirm={performRestore}
        title="Restore Backup?"
        message="This will replace all current data with the contents of this backup file. This cannot be undone."
        confirmLabel="Restore"
        danger
      />
      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={doResetDemo}
        title="Reset Demo Data?"
        message="This will replace all current data with fresh demo data for Hafeeza and Partner."
        confirmLabel="Reset"
        danger
      />
      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={doClearAll}
        title="Clear All Data?"
        message="This will permanently delete every profile, task, goal, and record on this device. This cannot be undone."
        confirmLabel="Clear Everything"
        danger
      />
    </div>
  );
}
