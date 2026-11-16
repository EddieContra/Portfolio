import { EMAIL } from './socials';

// Contact section copy and rows. `href` is optional (plain rows have none).
export const CONTACT_INTRO =
  'Have a project in mind, want to collaborate, or just want to say hi? The fastest way to reach me is email or WhatsApp.';

export const CONTACTS = [
  { icon: 'mail',          label: 'Email',    value: EMAIL,              href: `mailto:${EMAIL}` },
  { icon: 'smartphone',    label: 'Phone',    value: '+255 742 165 407', href: 'tel:+255742165407' },
  { icon: 'messageCircle', label: 'WhatsApp', value: '+255 745 225 985', href: 'https://wa.me/255745225985' },
  { icon: 'mapPin',        label: 'Location', value: 'Arusha, Tanzania' },
];
