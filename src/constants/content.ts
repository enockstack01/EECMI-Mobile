/**
 * Static ministry content, ported from the EECMI website so the app can render
 * the core screens without a backend round trip. Form submissions still go to
 * the live API (see `src/lib/api.ts`).
 */

import { Brand } from '@/constants/theme';

export const Org = {
  name: 'Ecclessia Eden Commission Ministries International',
  shortName: 'EECMI',
  tagline: 'Restoring Lives. Rebuilding Families. Transforming Communities Through Christ.',
  location: 'Kampala, Uganda',
  email: 'admin@eecmi.org',
  phone: '+250 722 439 327',
  phoneDial: '+250722439327',
  whatsapp: 'https://wa.me/250722439327',
  website: 'https://eecmi-platform.onrender.com',
  intro:
    'Ecclessia Eden Commission Ministries International is a Christ centered ministry committed to restoring lives, rebuilding families, empowering vulnerable people, and transforming communities through holistic ministry, discipleship, compassion, and sustainable development.',
};

export const Vision = {
  vision:
    "A society where lives are transformed through Christ, families are restored, and communities reflect God's design of wholeness.",
  mission:
    'To transform lives and restore communities through Christ centered outreach, discipleship, and holistic empowerment.',
};

export const Values: { name: string; desc: string; color: string }[] = [
  { name: 'Christ Centeredness', desc: 'Jesus is the foundation of all we do.', color: Brand.forest },
  { name: 'Restoration', desc: "Every life can be made new through God's grace.", color: Brand.gold },
  { name: 'Compassion', desc: 'We serve with the heart of Christ.', color: Brand.earth },
  { name: 'Empowerment', desc: 'We equip people to lead sustainable change.', color: Brand.navy },
  { name: 'Holistic Transformation', desc: 'Spiritual, social, economic renewal together.', color: '#7C3AED' },
  { name: 'Integrity', desc: 'Transparent and accountable in all we do.', color: '#0891B2' },
  { name: 'Partnership', desc: 'We achieve more together through collaboration.', color: Brand.forestMid },
  { name: 'Dignity', desc: 'Every person bears the image of God.', color: Brand.earthLight },
];

export const AboutFacts: { label: string; value: string }[] = [
  { label: 'Founded', value: 'Kampala, Uganda' },
  { label: 'Focus', value: 'Prison Ministry & Community Development' },
  { label: 'Status', value: 'Non Profit Christian Ministry' },
  { label: 'Programs', value: '6 Core Ministry Programs' },
  { label: 'Beneficiaries', value: 'Prisoners, Youth, Women, Children' },
];

export type Program = {
  id: string;
  icon: string; // Ionicons name
  title: string;
  tagline: string;
  color: string;
  description: string;
  activities: string[];
  impact: string;
};

export const Programs: Program[] = [
  {
    id: 'prison',
    icon: 'lock-closed',
    title: 'Prison Outreach & Restoration',
    tagline: 'Bringing hope behind prison walls',
    color: Brand.forest,
    description:
      'Evangelism, discipleship, counseling, reintegration, pre release preparation, and mentorship for incarcerated individuals and those returning to their communities.',
    activities: [
      'Evangelism and Gospel proclamation',
      'Bible discipleship and spiritual mentorship',
      'Professional counseling and trauma therapy',
      'Pre release life skills preparation',
      'Post release reintegration support',
      'Family reconciliation facilitation',
      'Mentorship and accountability partnerships',
    ],
    impact: 'Thousands of lives transformed behind bars',
  },
  {
    id: 'women',
    icon: 'heart',
    title: 'Women Empowerment',
    tagline: 'Building strong, self sufficient women',
    color: Brand.earth,
    description:
      'Vocational skills, entrepreneurship, parenting support, mentorship, and savings groups for single mothers and vulnerable women.',
    activities: [
      'Vocational skills training and certification',
      'Entrepreneurship and business development',
      'Parenting support and family coaching',
      'Mentorship from successful women leaders',
      'Savings groups and micro finance linkages',
      'Legal rights awareness',
      'Spiritual formation and discipleship',
    ],
    impact: 'Hundreds of women now running sustainable businesses',
  },
  {
    id: 'children',
    icon: 'happy',
    title: 'Children Support',
    tagline: 'Every child deserves a future',
    color: Brand.navy,
    description:
      'Education assistance, child protection, mentoring, holiday programs, and spiritual nurture for vulnerable children and those born in prison.',
    activities: [
      'Education assistance and school fees support',
      'Child protection and safety programs',
      'After school mentoring programs',
      'Holiday and enrichment programs',
      'Spiritual formation and character building',
      'Nutritional support and healthcare access',
      'Trauma informed counseling',
    ],
    impact: 'Hundreds of children supported in education',
  },
  {
    id: 'youth',
    icon: 'trending-up',
    title: 'Youth Empowerment',
    tagline: 'Equipping the leaders of tomorrow',
    color: '#7C3AED',
    description:
      'Skills training, entrepreneurship, leadership development, career guidance, and innovation programs for unemployed and at risk youth.',
    activities: [
      'Practical vocational skills training',
      'Entrepreneurship incubation and mentorship',
      'Leadership development programs',
      'Career guidance and professional coaching',
      'Innovation and technology exposure',
      'Sports and arts based programs',
      'Christian character and values formation',
    ],
    impact: 'Youth transformed into community leaders and entrepreneurs',
  },
  {
    id: 'family',
    icon: 'home',
    title: 'Family Strengthening',
    tagline: 'Strong families build strong communities',
    color: '#0891B2',
    description:
      'Marriage enrichment, parenting workshops, reconciliation, and counseling for families seeking restoration and strength.',
    activities: [
      'Marriage enrichment retreats and workshops',
      'Parenting skills development programs',
      'Family conflict resolution and mediation',
      'Professional counseling for couples',
      'Pre marital preparation programs',
      'Father presence initiatives',
      'Single parent household support',
    ],
    impact: 'Families restored and marriages saved',
  },
  {
    id: 'community',
    icon: 'globe',
    title: 'Community Outreach',
    tagline: 'Transforming entire neighborhoods for God',
    color: '#B45309',
    description:
      'Evangelism, relief assistance, health awareness, and community development initiatives reaching underserved neighborhoods across Uganda.',
    activities: [
      'Community evangelism and crusades',
      'Relief assistance for crisis situations',
      'Health awareness and hygiene programs',
      'Community development projects',
      'School outreach and youth programs',
      'Neighborhood prayer networks',
      'Civic engagement and peacebuilding',
    ],
    impact: 'Communities transformed across Uganda',
  },
];

export type NewsArticle = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  featured?: boolean;
};

export const NewsArticles: NewsArticle[] = [
  {
    id: 1,
    category: 'Prison Ministry',
    title: 'EECMI Reaches New Prison Facility in Northern Uganda',
    excerpt:
      'Our prison outreach team conducted a powerful evangelism crusade reaching over 200 inmates in a newly opened facility. Lives were transformed, and 45 men committed their lives to Christ.',
    date: 'June 2024',
    readTime: '3 min read',
    featured: true,
  },
  {
    id: 2,
    category: 'Women Empowerment',
    title: '30 Women Graduate from Vocational Skills Training Program',
    excerpt:
      'A graduation ceremony marked the completion of a 3 month intensive vocational training program. Graduates received certificates in tailoring, baking, and soap making.',
    date: 'May 2024',
    readTime: '2 min read',
  },
  {
    id: 3,
    category: 'Youth',
    title: 'Youth Innovation Camp Empowers 50 Young Entrepreneurs',
    excerpt:
      'EECMI hosted a week long innovation camp for unemployed youth. Participants received training in entrepreneurship, business planning, and leadership skills.',
    date: 'April 2024',
    readTime: '3 min read',
  },
  {
    id: 4,
    category: 'Partnership',
    title: 'New Partnership with 15 Churches Across Kampala Diocese',
    excerpt:
      'EECMI signs memoranda of understanding with 15 churches to collaborate on community outreach, prison ministry, and youth empowerment programs.',
    date: 'March 2024',
    readTime: '2 min read',
  },
  {
    id: 5,
    category: 'Children',
    title: 'Back to School Drive: 150 Children Receive School Supplies',
    excerpt:
      'Thanks to generous donors, EECMI distributed school bags, books, and stationery to 150 vulnerable children before the start of the new school term.',
    date: 'February 2024',
    readTime: '2 min read',
  },
  {
    id: 6,
    category: 'Community Outreach',
    title: 'Community Health Fair Serves 500 Families in Kawempe',
    excerpt:
      'A joint outreach with local health workers brought free medical screening, nutrition education, and spiritual care to 500 families in the Kawempe community.',
    date: 'January 2024',
    readTime: '4 min read',
  },
  {
    id: 7,
    category: 'Family',
    title: 'Annual Marriage Retreat Restores 20 Couples',
    excerpt:
      'The 2023 family restoration retreat witnessed powerful breakthroughs as 20 couples experienced healing, reconciliation, and renewed commitment to their marriages.',
    date: 'December 2023',
    readTime: '3 min read',
  },
  {
    id: 8,
    category: 'Fundraising',
    title: 'Annual Gala Raises Funds for Prison Ministry Expansion',
    excerpt:
      "EECMI's annual fundraising gala raised significant resources to expand prison ministry to three additional facilities in 2024.",
    date: 'November 2023',
    readTime: '2 min read',
  },
];

export const CategoryColors: Record<string, string> = {
  'Prison Ministry': Brand.forest,
  'Women Empowerment': Brand.earth,
  Youth: '#7C3AED',
  Children: Brand.navy,
  Family: '#0891B2',
  'Community Outreach': '#B45309',
  Partnership: Brand.gold,
  Fundraising: '#DC2626',
};

export const Leadership = {
  founder: {
    name: 'Founder & Executive Director',
    title: 'Ecclessia Eden Commission Ministries International',
    initials: 'FD',
    bio: 'Visionary leader and founder of EECMI, called by God to serve the marginalized and forgotten. With a deep passion for prison ministry and community transformation, the Founder has built an organization that touches thousands of lives across Uganda through holistic, Christ centered outreach.',
    responsibilities: [
      'Strategic vision and ministry direction',
      'Prison ministry leadership',
      'Partnership development',
      'Community engagement',
      'Organizational governance',
    ],
  },
  advisory: [
    { role: 'Spiritual Oversight', initials: 'AB' },
    { role: 'Financial Stewardship', initials: 'AB' },
    { role: 'Community Development', initials: 'AB' },
    { role: 'Legal & Governance', initials: 'AB' },
  ],
};

/** Options offered on the Get Involved / Volunteer form. */
export const VolunteerAreas = [
  'Prison Ministry',
  'Women Empowerment',
  'Children Support',
  'Youth Empowerment',
  'Family Strengthening',
  'Community Outreach',
  'Administration',
  'Counseling',
];

export const PartnerTypes = ['Church', 'Organization', 'Business', 'Individual', 'Foundation'];
