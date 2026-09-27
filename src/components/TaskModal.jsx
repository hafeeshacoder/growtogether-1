import { useEffect, useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Field, Input, Select, DateInput } from './Input';
import { CATEGORIES, PRIORITIES } from '../data/constants';
import { todayISO } from '../utils/dateUtils';

const blankForm = () => ({ title: '', category: 'study', date: todayISO(), priority: 'medium', completed: false });

export default function TaskModal({ open, onClose, onSave, task }) {
  const [form, setForm] = useState(blankForm());

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        category: task.category || 'study',
        date: task.date || todayISO(),
        priority: task.priority || 'medium',
        completed: !!task.completed,
      });
    } else {
      setForm(blankForm());
    }
  }, [task, open]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...task, ...form, title: form.title.trim() });
  };

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit Task' : 'Add Task'}>
      <form onSubmit={submit}>
        <Field label="Title">
          <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Solve 5 DSA problems" />
        </Field>
        <Field label="Category">
          <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date">
            <DateInput value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </Field>
          <Field label="Priority">
            <Select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
              {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </Select>
          </Field>
        </div>
        <div className="flex gap-3 mt-2">
          <Button type="button" variant="ghost" onClick={onClose} fullWidth>Cancel</Button>
          <Button type="submit" fullWidth>{task ? 'Save Changes' : 'Add Task'}</Button>
        </div>
      </form>
    </Modal>
  );
}
