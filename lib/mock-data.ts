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

// In-memory stores
export const mockUsers: User[] = [];
export const mockCompanies: Company[] = [];
export let mockJobs: Job[] = [];
export let mockApplications: Application[] = [];

/**
 * Add Job
 */
export function addJob(
  job: Omit<Job, 'id' | 'company' | 'postedAt' | 'isVerified' | 'applicantsCount'>,
  employerId: string,
  companyName?: string
) {
  // Find existing company for this employer
  let company = mockCompanies.find(c => c.ownerId === employerId);

  // If not found, create new company
  if (!company) {
    company = {
      id: crypto.randomUUID(),
      name: companyName || 'My Company',
      industry: job.category || 'General',
      location: job.location || 'Ethiopia',
      size: 'Unknown',
      website: '',
      isVerified: false,
      description: '',
      rating: 0,
      reviews: 0,
      ownerId: employerId,
    };

    mockCompanies.push(company);
  }

  const newJob: Job = {
    ...job,
    id: crypto.randomUUID(),
    company,
    postedAt: new Date().toISOString(),
    isVerified: true,
    applicantsCount: 0,
  };

  mockJobs.unshift(newJob);
  return newJob;
}

/**
 * Add Application
 */
export function addApplication(
  app: Omit<Application, 'id' | 'status' | 'appliedAt'>
) {
  const newApp: Application = {
    ...app,
    id: crypto.randomUUID(),
    status: 'PENDING',
    appliedAt: new Date().toISOString(),
  };

  mockApplications.push(newApp);

  // Update job applicant count safely
  const job = mockJobs.find(j => j.id === app.jobId);
  if (job) {
    job.applicantsCount = (job.applicantsCount || 0) + 1;
  }

  return newApp;
}