import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ListTodo, BookHeart, Briefcase, LayoutDashboard, Gamepad2 } from 'lucide-react';

const modules = [
  {
    title: 'Task Scheduler',
    description: 'Plan and manage your daily tasks with priorities and categories',
    icon: ListTodo,
    path: '/tasks',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Digital Diary',
    description: 'Record your thoughts and track your mood over time',
    icon: BookHeart,
    path: '/diary',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    title: 'Career Development',
    description: 'Upload your resume and discover job opportunities',
    icon: Briefcase,
    path: '/career',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    title: 'Dashboard',
    description: 'View your productivity insights and activity summary',
    icon: LayoutDashboard,
    path: '/dashboard',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Relaxation',
    description: 'Take a break with quotes, breathing exercises, and games',
    icon: Gamepad2,
    path: '/relaxation',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl font-bold text-primary tracking-tight">
          AUTOAIDE
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          <span className="text-foreground">AUTO</span>mated{' '}
          <span className="text-foreground">A</span>ssistant for{' '}
          <span className="text-foreground">I</span>ntegrated{' '}
          <span className="text-foreground">D</span>aily{' '}
          <span className="text-foreground">E</span>mpowerment
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your unified personal productivity and career guidance companion. 
          Manage tasks, journal your thoughts, explore career opportunities, 
          and maintain work-life balance — all in one place.
        </p>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.path} to={module.path}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${module.bgColor} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${module.color}`} />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {module.title}
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats Preview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ Create tasks in the <strong>Task Scheduler</strong> to organize your day</p>
          <p>✓ Write reflections in your <strong>Digital Diary</strong> and track your mood</p>
          <p>✓ Upload your resume in <strong>Career Development</strong> to find matching jobs</p>
          <p>✓ Monitor your progress in the <strong>Dashboard</strong></p>
          <p>✓ Take breaks in the <strong>Relaxation</strong> zone with games and breathing exercises</p>
        </CardContent>
      </Card>
    </div>
  );
}
