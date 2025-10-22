/**
 * Data mapper to transform API company data to template format
 */

export const mapApiCompanyToTemplate = (apiCompany) => {
  if (!apiCompany) return null;

  return {
    id: apiCompany.id,
    name: apiCompany.name,
    slug: apiCompany.slug,
    logo: apiCompany.logo || '/images/default-company.png',
    description: apiCompany.description || '',
    website: apiCompany.website || '',
    location: apiCompany.location || '',
    industry: apiCompany.industry || '',
    size: apiCompany.size || '',
    founded: apiCompany.founded_year || '',
    verified: apiCompany.is_verified || false,
    jobsCount: apiCompany.jobs_count || 0,
    rating: apiCompany.average_rating || 0,
    reviewsCount: apiCompany.reviews_count || 0,
    socialLinks: apiCompany.social_links || {},
    benefits: apiCompany.benefits || [],
    culture: apiCompany.culture || '',
    createdAt: apiCompany.created_at,
  };
};

export const mapApiCompaniesToTemplate = (apiCompanies) => {
  if (!Array.isArray(apiCompanies)) return [];
  return apiCompanies.map(mapApiCompanyToTemplate);
};

export default {
  mapApiCompanyToTemplate,
  mapApiCompaniesToTemplate,
};
