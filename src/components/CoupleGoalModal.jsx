import { useEffect, useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Field, Input, Textarea, DateInput, Select } from './Input';

const blankForm = () => ({ title: '', description: '', progress: 0, deadline: '' });

export default function CoupleGoalModal({ open, onClose, onSave, goal, users = [] }) {
  const [form, setForm] = useState(blankForm());
  const [createdBy, setCreatedBy] = useState(users[0]?.id || '');

  useEffect(() => {
    if (goal) {
      setForm({
        title: goal.title || '',
        description: goal.description || '',
        progress: goal.progress ?? 0,
        deadline: goal.deadline || '',
      });
      setCreatedBy(goal.createdBy || users[0]?.id || '');
    } else {
      setForm(blankForm());
      setCreatedBy(users[0]?.id || '');
    }
  }, [goal, open, users]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...goal, ...form, title: form.title.trim(), progress: Number(form.progress), createdBy, shared: true });
  };

  return (
    <Modal open={open} onClose={onClose} title={goal ? 'Edit Couple Goal' : 'Add Couple Goal'}>
      <form onSubmit={submit}>
        <Field label="Title">
          <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Prepare for interviews" />
        </Field>
        <Field label="Description">
          <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What are you building together?" />
        </Field>
        {users.length > 0 && (
          <Field label="Created by">
            <Select value={createdBy} onChange={(e) => setCreatedBy(e.target.value)}>
              {users.map((u) => <option key={u.id} value={u.id}>{u.avatar} {u.name}</option>)}
            </Select>
          </Field>
        )}
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
