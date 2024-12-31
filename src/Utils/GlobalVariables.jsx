export const NYUAD = "nyuad";

export const NUMBER_OF_CHARTS_TO_LOAD_INITIALLY = 2;

export const CITIESair = "CITIESair";

export const CITIESair_HOST_NAME = "citiesair.com";

export const CITIESair_URL = "https://citiesair.com";

export const API_CITIESair_URL = process.env.REACT_APP_ENV === 'local-backend' ? 'http://localhost:3001' : 'https://api.citiesair.com';

export const BLOG_CITIESair_URL = "https://blog.citiesair.com";

// For Hyvor Talk's comment section
export const HYVOR_WEBSITE_ID = 9021; // Hyvor Talk's website ID
export const HYVOR_AIR_QUALITY_PAGE_ID = 64327358; // Air Quality page ID in Hyvor Talk
export const HYVOR_PAGE_NAME = 'air-quality';
export const HYVOR_API_URL = `https://talk.hyvor.com/api/data/v1/pages?website_id=${HYVOR_WEBSITE_ID}&id=${HYVOR_AIR_QUALITY_PAGE_ID}`;
export const EMPTY_USER_DATA = {
    allowedSchools: [],
    username: null,
    email: null,
    is_verified: false
};

