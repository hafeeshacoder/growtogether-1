import { useEffect, useState } from 'react';
import Card from '../components/Card';
import AchievementCard from '../components/AchievementCard';
import { useApp } from '../context/AppContext';
import { useCollection } from '../hooks/useCollection';
import { AchievementsRepo } from '../db/repository';
import { ACHIEVEMENT_DEFS } from '../data/constants';
import { checkAndUnlockAchievements } from '../services/achievementService';

export default function Achievements() {
  const { activeUser } = useApp();
  const { items: allAchievements, reload } = useCollection(AchievementsRepo, activeUser?.id);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!activeUser || checked) return;
    checkAndUnlockAchievements(activeUser.id).then(() => { setChecked(true); reload(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUser]);

  const mine = allAchievements.filter((a) => a.userId === activeUser?.id);
  const unlockedIds = new Set(mine.map((a) => a.achievementId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-xl sm:text-2xl text-ink dark:text-white">Achievements</h1>
        <p className="text-sm text-muted">{mine.length} of {ACHIEVEMENT_DEFS.length} unlocked</p>
      </div>

      <Card className="bg-gradient-to-br from-primary-600 to-rose-deep text-white text-center">
        <p className="text-3xl">🏆</p>
        <p className="font-display font-semibold mt-1">Keep going — every badge tells your story.</p>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ACHIEVEMENT_DEFS.map((def) => {
          const unlocked = mine.find((a) => a.achievementId === def.id);
          return (
            <AchievementCard
              key={def.id}
              achievement={unlocked || def}
              locked={!unlockedIds.has(def.id)}
              description={def.description}
            />
          );
        })}
      </div>
    </div>
  );
}
