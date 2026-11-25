import { useState, useCallback } from 'react';
import { ExtractedSkill, JobPreferences } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, Search, ExternalLink, Briefcase, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Common technical skills to extract from resume text
const skillKeywords = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP', 'Swift', 'Kotlin',
  'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
  'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap', 'Material UI',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'Supabase',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'GitLab',
  'REST', 'GraphQL', 'API', 'Microservices', 'CI/CD', 'DevOps', 'Agile', 'Scrum',
  'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
  'Communication', 'Leadership', 'Team Management', 'Problem Solving', 'Project Management',
  'Microsoft Office', 'Excel', 'PowerPoint', 'Photoshop', 'Figma', 'Adobe XD',
];

const jobPortals = [
  { name: 'LinkedIn', baseUrl: 'https://www.linkedin.com/jobs/search/', icon: '💼' },
  { name: 'Indeed', baseUrl: 'https://www.indeed.com/jobs?', icon: '🔍' },
  { name: 'Glassdoor', baseUrl: 'https://www.glassdoor.com/Job/jobs.htm?', icon: '🏢' },
  { name: 'Google Jobs', baseUrl: 'https://www.google.com/search?q=', icon: '🌐' },
];

export default function CareerPage() {
  const { toast } = useToast();
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [skills, setSkills] = useState<ExtractedSkill[]>([]);
  const [preferences, setPreferences] = useState<JobPreferences>({ role: '', location: '' });
  const [isExtracting, setIsExtracting] = useState(false);
  const [step, setStep] = useState<'upload' | 'skills' | 'search'>('upload');

  const extractSkillsFromText = (text: string): ExtractedSkill[] => {
    const foundSkills: ExtractedSkill[] = [];
    const lowerText = text.toLowerCase();
    
    skillKeywords.forEach((skill) => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push({
          id: crypto.randomUUID(),
          name: skill,
        });
      }
    });
    
    return foundSkills;
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['text/plain', 'application/pdf'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.txt')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF or TXT file.',
        variant: 'destructive',
      });
      return;
    }

    setIsExtracting(true);
    setResumeFileName(file.name);

    try {
      let text = '';
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      } else if (file.type === 'application/pdf') {
        // For PDF, we'll extract text on the client side
        // Note: Full PDF parsing would require a library; for demo, we'll prompt manual entry
        toast({
          title: 'PDF Detected',
          description: 'For best results with PDF, please also add any key skills manually below.',
        });
        text = file.name; // Use filename as placeholder
      }

      setResumeText(text);
      const extractedSkills = extractSkillsFromText(text);
      setSkills(extractedSkills);
      setStep('skills');
      
      toast({
        title: 'Resume uploaded!',
        description: `Found ${extractedSkills.length} skills from your resume.`,
      });
    } catch (error) {
      toast({
        title: 'Error reading file',
        description: 'Please try again or use a different file.',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
    }
  }, [toast]);

  const removeSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const addManualSkill = (skillName: string) => {
    if (!skillName.trim()) return;
    const exists = skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase());
    if (exists) {
      toast({ title: 'Skill already exists', variant: 'destructive' });
      return;
    }
    setSkills((prev) => [...prev, { id: crypto.randomUUID(), name: skillName.trim() }]);
  };

  const generateJobUrl = (portal: typeof jobPortals[0]) => {
    const query = `${preferences.role} ${preferences.location}`.trim();
    const encodedQuery = encodeURIComponent(query);
    
    switch (portal.name) {
      case 'LinkedIn':
        return `${portal.baseUrl}?keywords=${encodedQuery}`;
      case 'Indeed':
        return `${portal.baseUrl}q=${encodeURIComponent(preferences.role)}&l=${encodeURIComponent(preferences.location)}`;
      case 'Glassdoor':
        return `${portal.baseUrl}sc.keyword=${encodedQuery}`;
      case 'Google Jobs':
        return `${portal.baseUrl}${encodedQuery} jobs`;
      default:
        return portal.baseUrl;
    }
  };

  const handleFindJobs = () => {
    if (!preferences.role.trim()) {
      toast({
        title: 'Job role required',
        description: 'Please enter your preferred job role.',
        variant: 'destructive',
      });
      return;
    }
    setStep('search');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Career Development</h1>
        <p className="text-muted-foreground">Upload your resume and discover job opportunities</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {['upload', 'skills', 'search'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step === s
                  ? 'bg-primary text-primary-foreground'
                  : ['upload', 'skills', 'search'].indexOf(step) > i
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
            {i < 2 && <div className="w-12 h-0.5 bg-muted mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1: Resume Upload */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Your Resume
            </CardTitle>
            <CardDescription>
              Upload your resume in PDF or TXT format to extract your skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept=".pdf,.txt,text/plain,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                {isExtracting ? (
                  <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
                ) : (
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                )}
                <p className="text-lg font-medium">
                  {isExtracting ? 'Extracting skills...' : 'Click to upload resume'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports PDF and TXT files
                </p>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Skills Review */}
      {step === 'skills' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Skills
            </CardTitle>
            <CardDescription>
              Review extracted skills from <strong>{resumeFileName}</strong>. You can add or remove skills.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {skills.length === 0 ? (
                <p className="text-muted-foreground">No skills extracted. Add some manually below.</p>
              ) : (
                skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="gap-1 px-3 py-1">
                    {skill.name}
                    <button onClick={() => removeSkill(skill.id)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a skill manually..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addManualSkill((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={(e) => {
                  const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                  addManualSkill(input.value);
                  input.value = '';
                }}
              >
                Add
              </Button>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">Job Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Preferred Job Role
                  </Label>
                  <Input
                    id="role"
                    placeholder="e.g., Frontend Developer, Data Analyst"
                    value={preferences.role}
                    onChange={(e) => setPreferences((p) => ({ ...p, role: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Preferred Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., New York, Remote"
                    value={preferences.location}
                    onChange={(e) => setPreferences((p) => ({ ...p, location: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button onClick={handleFindJobs} className="gap-2">
                <Search className="w-4 h-4" />
                Find Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Job Search Results */}
      {step === 'search' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Job Search Results
            </CardTitle>
            <CardDescription>
              Search for <strong>{preferences.role}</strong>
              {preferences.location && ` in ${preferences.location}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobPortals.map((portal) => (
                <a
                  key={portal.name}
                  href={generateJobUrl(portal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-4">
                      <span className="text-3xl">{portal.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold">{portal.name}</h3>
                        <p className="text-sm text-muted-foreground">Search jobs on {portal.name}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setStep('skills')}>
                Edit Preferences
              </Button>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Upload New Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
