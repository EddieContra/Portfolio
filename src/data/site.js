// Site-wide copy that is not a list of items: identity, navigation, hero and
// about text, section headings. Edit wording here, not in the components.
//
// Emphasis: wrap a phrase in [[double brackets]] to render it in the primary
// text colour inside otherwise muted copy.

export const SITE = {
  name: 'Eddie',
  owner: 'Emmanuel Edmund',
  url: 'https://eddiecontra.github.io/Portfolio/',
  tagline: 'CS · Design · Education',
  cv: { file: 'cv.pdf', downloadName: 'Eddie-CV.pdf' },
};

// Desktop nav + scroll-spy. `id` must match a section id.
export const NAV_LINKS = [
  { id: 'about',      label: 'About' },
  { id: 'experience', label: 'Work' },
  { id: 'projects',   label: 'Projects' },
  { id: 'gallery',    label: 'Gallery' },
  { id: 'contact',    label: 'Contact' },
];

export const HERO = {
  status: 'Available for opportunities · Arusha, Tanzania',
  intro:
    'AI & automation developer, programming instructor, and designer building production AI agents and creative learning experiences from [[Arusha, Tanzania]].',
  actions: { work: 'View work', cv: 'Download CV', contact: 'Get in touch' },
};

export const ABOUT = {
  portrait: { src: 'me.jpg', alt: 'Eddie', width: 640, height: 640 },
  // First paragraph is the large lead statement; the rest are body copy.
  paragraphs: [
    "I'm [[Eddie]], a Computer Science graduate sitting at the intersection of [[technology, design, and education]]. I build production software, craft compelling visuals, and teach the next generation of coders.",
    "I work as a [[Programming Instructor and AI Curriculum Developer]] at [[E3Empower]] in Tanzania, where I've built two full AI courses and design bilingual learning materials, alongside brand and design work for clients.",
    "I also founded an [[agentic-AI consultancy]], building lead-response and booking automation on the [[Anthropic API]], and I'm open to [[full-time roles or freelance projects]] where I can apply that at scale.",
  ],
  stats: [
    { value: '2',   label: 'AI courses built' },
    { value: '3+',  label: 'Years experience' },
    { value: '12+', label: 'Tools mastered' },
  ],
};

// Eyebrow label + heading for each section, in page order.
export const SECTIONS = {
  about:        { label: 'About',                  title: 'A bit about me' },
  currently:    { label: 'Right now',              title: 'Currently' },
  experience:   { label: 'Experience & education', title: "Where I've worked" },
  projects:     { label: 'Selected work',          title: 'Projects' },
  skills:       { label: 'What I work with',       title: 'Skills & tools' },
  gallery:      { label: 'Creative work',          title: 'Gallery' },
  testimonials: { label: 'Kind words',             title: 'Testimonials' },
  contact:      { label: 'Get in touch',           title: "Let's work together" },
};
