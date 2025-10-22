/**
 * Data mapper to transform API job data to template format
 */

export const mapApiJobToTemplate = (apiJob) => {
  if (!apiJob) return null;

  return {
    id: apiJob.id,
    title: apiJob.title,
    slug: apiJob.slug,
    company: apiJob.company?.name || '',
    companyId: apiJob.company?.id,
    companyLogo: apiJob.company?.logo || '/images/default-company.png',
    location: apiJob.location,
    type: formatJobType(apiJob.job_type),
    experience: formatExperienceLevel(apiJob.experience_level),
    salary: formatSalary(apiJob.salary_min, apiJob.salary_max, apiJob.salary_period),
    description: apiJob.description,
    requirements: apiJob.requirements || '',
    responsibilities: apiJob.responsibilities || '',
    benefits: apiJob.benefits || '',
    skills: apiJob.skills_required || [],
    tags: apiJob.tags || [],
    category: apiJob.category?.name || '',
    categoryId: apiJob.job_category_id,
    featured: apiJob.is_featured || false,
    urgent: apiJob.is_urgent || false,
    deadline: apiJob.apply_deadline,
    postedAt: apiJob.created_at,
    views: apiJob.views_count || 0,
    applicationsCount: apiJob.applications_count || 0,
    status: apiJob.status,
  };
};

export const mapApiJobsToTemplate = (apiJobs) => {
  if (!Array.isArray(apiJobs)) return [];
  return apiJobs.map(mapApiJobToTemplate);
};

const formatJobType = (type) => {
  const typeMap = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'contract': 'Contract',
    'freelance': 'Freelance',
    'internship': 'Internship',
  };
  return typeMap[type] || type;
};

const formatExperienceLevel = (level) => {
  const levelMap = {
    'entry': 'Entry Level',
    'mid': 'Mid Level',
    'senior': 'Senior Level',
    'executive': 'Executive',
  };
  return levelMap[level] || level;
};

const formatSalary = (min, max, period) => {
  if (!min && !max) return 'Negotiable';
  
  const periodMap = {
    'hour': '/hr',
    'day': '/day',
    'week': '/week',
    'month': '/month',
    'year': '/year',
  };
  
  const periodSuffix = periodMap[period] || '';
  
  if (min && max) {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}${periodSuffix}`;
  }
  
  if (min) {
    return `From $${min.toLocaleString()}${periodSuffix}`;
  }
  
  return `Up to $${max.toLocaleString()}${periodSuffix}`;
};

export default {
  mapApiJobToTemplate,
  mapApiJobsToTemplate,
};
