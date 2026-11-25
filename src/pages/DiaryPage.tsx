import { useState } from 'react';
import { useDiary } from '@/hooks/useDiary';
import { Mood } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Smile, Meh, Frown, Battery } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const moodOptions: { mood: Mood; icon: React.ElementType; label: string; color: string }[] = [
  { mood: 'happy', icon: Smile, label: 'Happy', color: 'text-green-500 bg-green-500/10 border-green-200' },
  { mood: 'neutral', icon: Meh, label: 'Neutral', color: 'text-blue-500 bg-blue-500/10 border-blue-200' },
  { mood: 'stressed', icon: Frown, label: 'Stressed', color: 'text-red-500 bg-red-500/10 border-red-200' },
  { mood: 'tired', icon: Battery, label: 'Tired', color: 'text-amber-500 bg-amber-500/10 border-amber-200' },
];

const getMoodBadge = (mood: Mood) => {
  const option = moodOptions.find((o) => o.mood === mood);
  if (!option) return null;
  const Icon = option.icon;
  return (
    <Badge variant="outline" className={cn('gap-1', option.color)}>
      <Icon className="w-3 h-3" />
      {option.label}
    </Badge>
  );
};

export default function DiaryPage() {
  const { entries, addEntry, getEntryByDate } = useDiary();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const existingEntry = getEntryByDate(selectedDate);

  const handleSave = () => {
    if (!content.trim() || !selectedMood) return;
    
    addEntry({
      date: selectedDate,
      content: content.trim(),
      mood: selectedMood,
    });
    
    setContent('');
    setSelectedMood(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Digital Diary</h1>
        <p className="text-muted-foreground">Record your thoughts and track your mood</p>
      </div>

      {/* New Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle>Write a New Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full md:w-auto"
            />
          </div>

          {existingEntry && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                You already have an entry for this date. A new entry will be added separately.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>How are you feeling today?</Label>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.mood}
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedMood(option.mood)}
                    className={cn(
                      'gap-2 transition-all',
                      selectedMood === option.mood && option.color,
                      selectedMood === option.mood && 'ring-2 ring-offset-2 ring-primary'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">What's on your mind?</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts, reflections, or anything you'd like to remember..."
              rows={6}
            />
          </div>

          <Button onClick={handleSave} disabled={!content.trim() || !selectedMood}>
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {/* Previous Entries */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Previous Entries</h2>
        {entries.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No diary entries yet. Start writing to track your journey!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          {format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
                        </span>
                        {getMoodBadge(entry.mood)}
                      </div>
                      <p className="text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
