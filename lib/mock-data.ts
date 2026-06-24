// Shared mock data store
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'JOB_SEEKER' | 'EMPLOYER';
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

export const mockUsers: User[] = [];

export const mockCompanies: Company[] = [];

export let mockJobs: Job[] = [];

export let mockApplications: Application[] = [];

export function addJob(
  job: Omit<Job, 'id' | 'company' | 'postedAt' | 'isVerified' | 'applicantsCount'>,
  employerId: string
) {
  const company = (mockCompanies.find(c => c.ownerId === employerId) || mockCompanies[0]) as Company;

  const newJob: Job = {
    ...job,
    id: String(mockJobs.length + 1),
    company,
    postedAt: (new Date().toISOString().split('T')[0]) as string,
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
    appliedAt: (new Date().toISOString().split('T')[0]) as string,
  };
  mockApplications.push(newApp);
  
  // Increment applicants count on job
  const job = mockJobs.find(j => j.id === app.jobId);
  if (job) {
    job.applicantsCount += 1;
  }
  return newApp;
}
