import { useTasks } from '@/hooks/useTasks';
import { useDiary } from '@/hooks/useDiary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, ListTodo, Smile, Meh, Frown, Battery, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const moodColors = {
  happy: '#22c55e',
  neutral: '#3b82f6',
  stressed: '#ef4444',
  tired: '#f59e0b',
};

const moodIcons = {
  happy: Smile,
  neutral: Meh,
  stressed: Frown,
  tired: Battery,
};

export default function DashboardPage() {
  const { tasks, getTaskStats } = useTasks();
  const { entries, getMoodStats, getRecentEntries } = useDiary();
  
  const taskStats = getTaskStats();
  const moodStats = getMoodStats();
  const recentEntries = getRecentEntries(7);

  const taskChartData = [
    { name: 'Completed', value: taskStats.completed, color: '#22c55e' },
    { name: 'Pending', value: taskStats.pending, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const moodChartData = Object.entries(moodStats)
    .filter(([_, count]) => count > 0)
    .map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count,
      color: moodColors[mood as keyof typeof moodColors],
    }));

  const completionRate = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Your productivity at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <ListTodo className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{taskStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{taskStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{taskStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {taskChartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taskChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6">
                  {taskChartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No tasks yet. Create some tasks to see the distribution.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Tracker */}
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {moodChartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodChartData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {moodChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No diary entries yet. Start writing to track your mood.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Diary Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.map((entry) => {
                const MoodIcon = moodIcons[entry.mood];
                return (
                  <div key={entry.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${moodColors[entry.mood]}20` }}
                    >
                      <MoodIcon className="w-5 h-5" style={{ color: moodColors[entry.mood] }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{entry.date}</p>
                      <p className="text-sm text-muted-foreground truncate">{entry.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No diary entries yet. Start writing to see your recent activity.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
