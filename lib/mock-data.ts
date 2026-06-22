// Shared mock data store
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'JOB_SEEKER' | 'EMPLOYER';
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  website: string;
  isVerified: boolean;
  description: string;
  rating: number;
  reviews: number;
  ownerId: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  jobSeekerId: string;
  jobSeekerName: string;
  coverLetter: string;
  cvUrl: string;
  status: 'PENDING' | 'SHORTLISTED' | 'INTERVIEWED' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  salary: string;
  jobType: string;
  expLevel: string;
  isRemote: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  deadline: string;
  postedAt: string;
  category: string;
  tags: string[];
  description: string;
  requirements: string;
  benefits: string;
  applicantsCount: number;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Abebe Bekele',
    email: 'test@example.com',
    password: 'password123',
    role: 'JOB_SEEKER',
  },
  {
    id: '2',
    name: 'Ethio Telecom',
    email: 'employer@example.com',
    password: 'password123',
    role: 'EMPLOYER',
  },
];

export const mockCompanies: Company[] = [
  {
    id: '2',
    name: 'Ethio Telecom',
    industry: 'Telecommunications',
    location: 'Addis Ababa',
    size: '10,000+ employees',
    website: 'https://ethiotelecom.et',
    isVerified: true,
    description: 'Ethiopia\'s leading telecommunications company providing mobile, internet and fixed-line services.',
    rating: 4.5,
    reviews: 128,
    ownerId: '2'
  }
];

export let mockJobs: Job[] = [];

export let mockApplications: Application[] = [];

export function addJob(
  job: Omit<Job, 'id' | 'company' | 'postedAt' | 'isVerified' | 'applicantsCount'>,
  employerId: string
) {
  const company = mockCompanies.find(c => c.ownerId === employerId) || mockCompanies[0];

  const newJob: Job = {
    ...job,
    id: String(mockJobs.length + 1),
    company,
    postedAt: new Date().toISOString().split('T')[0],
    isVerified: true,
    applicantsCount: 0,
  };
  mockJobs.unshift(newJob);
  return newJob;
}

export function addApplication(
  app: Omit<Application, 'id' | 'status' | 'appliedAt'>
) {
  const newApp: Application = {
    ...app,
    id: String(mockApplications.length + 1),
    status: 'PENDING',
    appliedAt: new Date().toISOString().split('T')[0],
  };
  mockApplications.push(newApp);
  
  // Increment applicants count on job
  const job = mockJobs.find(j => j.id === app.jobId);
  if (job) {
    job.applicantsCount += 1;
  }
  return newApp;
}
