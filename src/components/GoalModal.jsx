import { useEffect, useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Field, Input, Select, Textarea, DateInput } from './Input';

const GOAL_CATEGORIES = [
  { id: 'personal', label: '🏠 Personal' },
  { id: 'career', label: '💼 Career' },
  { id: 'learning', label: '📚 Learning' },
];

const blankForm = () => ({ title: '', description: '', progress: 0, category: 'personal', deadline: '' });

export default function GoalModal({ open, onClose, onSave, goal }) {
  const [form, setForm] = useState(blankForm());

  useEffect(() => {
    if (goal) {
      setForm({
        title: goal.title || '',
        description: goal.description || '',
        progress: goal.progress ?? 0,
        category: goal.category || 'personal',
        deadline: goal.deadline || '',
      });
    } else {
      setForm(blankForm());
    }
  }, [goal, open]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...goal, ...form, title: form.title.trim(), progress: Number(form.progress) });
  };

  return (
    <Modal open={open} onClose={onClose} title={goal ? 'Edit Goal' : 'Add Goal'}>
      <form onSubmit={submit}>
        <Field label="Title">
          <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Complete DSA roadmap" />
        </Field>
        <Field label="Description">
          <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What does success look like?" />
        </Field>
        <Field label="Category">
          <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            {GOAL_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </Select>
        </Field>
        <Field label="Deadline (optional)">
          <DateInput value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} />
        </Field>
        <Field label={`Progress: ${form.progress}%`}>
          <input
            type="range"
            min="0"
            max="100"
            value={form.progress}
            onChange={(e) => setForm((f) => ({ ...f, progress: Number(e.target.value) }))}
            className="w-full accent-primary-600"
            aria-label="Progress"
          />
        </Field>
        <div className="flex gap-3 mt-2">
          <Button type="button" variant="ghost" onClick={onClose} fullWidth>Cancel</Button>
          <Button type="submit" fullWidth>{goal ? 'Save Changes' : 'Add Goal'}</Button>
        </div>
      </form>
    </Modal>
  );
}
