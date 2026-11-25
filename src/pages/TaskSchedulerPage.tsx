import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskPriority, TaskCategory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-green-500/10 text-green-600 border-green-200',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  high: 'bg-red-500/10 text-red-600 border-red-200',
};

const categoryColors: Record<TaskCategory, string> = {
  work: 'bg-blue-500/10 text-blue-600',
  study: 'bg-purple-500/10 text-purple-600',
  personal: 'bg-pink-500/10 text-pink-600',
  general: 'bg-gray-500/10 text-gray-600',
};

export default function TaskSchedulerPage() {
  const { tasks, addTask, deleteTask, toggleTaskStatus } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    priority: 'medium' as TaskPriority,
    category: 'general' as TaskCategory,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addTask(formData);
    setFormData({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      priority: 'medium',
      category: 'general',
    });
    setShowForm(false);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Task Scheduler</h1>
          <p className="text-muted-foreground">
            Plan and manage your daily tasks
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter task title"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter task description (optional)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: TaskPriority) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: TaskCategory) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="study">Study</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Task</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No tasks yet. Create your first task to get started!
            </p>
          </Card>
        ) : (
          sortedTasks.map((task) => (
            <Card
              key={task.id}
              className={cn(
                'transition-all duration-200',
                task.status === 'completed' && 'opacity-60'
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={cn(
                          'font-semibold',
                          task.status === 'completed' &&
                            'line-through text-muted-foreground'
                        )}
                      >
                        {task.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={priorityColors[task.priority]}
                      >
                        {task.priority}
                      </Badge>
                      <Badge className={categoryColors[task.category]}>
                        {task.category}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(task.date), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {task.time}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
