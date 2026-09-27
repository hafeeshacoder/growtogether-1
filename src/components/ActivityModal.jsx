import { useEffect, useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Field, Input, Select, Textarea, TimeInput } from './Input';
import { CATEGORIES, getCategory } from '../data/constants';

const REPEAT_OPTIONS = [
  { id: 'daily', label: 'Every day' },
  { id: 'weekdays', label: 'Weekdays only' },
  { id: 'once', label: 'Just once' },
];

const EMOJI_CHOICES = ['☀️', '📚', '💻', '🤖', '🎓', '💼', '🏃', '🧘', '❤️', '🏠', '🎯', '🚀', '🌙', '✨'];

const blankForm = (mode) => ({
  title: '',
  category: 'study',
  icon: '📚',
  color: '#EC4899',
  startTime: '09:00',
  endTime: '10:00',
  repeat: 'daily',
  mode,
  notes: '',
  completed: false,
});

export default function ActivityModal({ open, onClose, onSave, activity, mode }) {
  const [form, setForm] = useState(() => blankForm(mode));

  useEffect(() => {
    if (activity) {
      setForm({
        title: activity.title || '',
        category: activity.category || 'study',
        icon: activity.icon || '📚',
        color: activity.color || getCategory(activity.category).color,
        startTime: to24h(activity.startTime),
        endTime: to24h(activity.endTime),
        repeat: activity.repeat || 'daily',
        mode: activity.mode || mode,
        notes: activity.notes || '',
        completed: !!activity.completed,
      });
    } else {
      setForm(blankForm(mode));
    }
  }, [activity, mode, open]);

  const handleCategoryChange = (categoryId) => {
    const cat = getCategory(categoryId);
    setForm((f) => ({ ...f, category: categoryId, icon: cat.icon, color: cat.color }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...activity,
      ...form,
      title: form.title.trim(),
      startTime: to12h(form.startTime),
      endTime: to12h(form.endTime),
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={activity ? 'Edit Activity' : 'Add Activity'}>
      <form onSubmit={submit}>
        <Field label="Title">
          <Input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. DSA Practice"
          />
        </Field>

        <Field label="Category">
          <Select value={form.category} onChange={(e) => handleCategoryChange(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </Select>
        </Field>

        <Field label="Icon / Emoji">
          <div className="flex flex-wrap gap-2">
            {EMOJI_CHOICES.map((em) => (
              <button
                type="button"
                key={em}
                onClick={() => setForm((f) => ({ ...f, icon: em }))}
                aria-label={`Choose icon ${em}`}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-base ${form.icon === em ? 'bg-primary-200 dark:bg-primary-800 ring-2 ring-primary-500' : 'bg-primary-50 dark:bg-slate-700'}`}
              >
                {em}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Time">
            <TimeInput required value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} />
          </Field>
          <Field label="End Time">
            <TimeInput required value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))} />
          </Field>
        </div>

        <Field label="Repeat">
          <Select value={form.repeat} onChange={(e) => setForm((f) => ({ ...f, repeat: e.target.value }))}>
            {REPEAT_OPTIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </Select>
        </Field>

        <Field label="Notes (optional)">
          <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Any extra detail…" />
        </Field>

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="ghost" onClick={onClose} fullWidth>Cancel</Button>
          <Button type="submit" fullWidth>{activity ? 'Save Changes' : 'Add Activity'}</Button>
        </div>
      </form>
    </Modal>
  );
}

function to24h(t) {
  if (!t) return '09:00';
  if (/^\d{2}:\d{2}$/.test(t)) return t;
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return '09:00';
  let [, h, min, ap] = m;
  h = parseInt(h, 10);
  if (ap.toUpperCase() === 'PM' && h !== 12) h += 12;
  if (ap.toUpperCase() === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${min}`;
}

function to12h(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ap}`;
}
