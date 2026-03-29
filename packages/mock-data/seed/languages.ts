/**
 * Language seed data.
 * Colors sourced from each language's official branding guidelines.
 */
export const languages = [
  {
    name: 'Python',
    slug: 'python',
    description:
      'A versatile, high-level language known for readability and a vast standard library. Used in web development, data science, AI/ML, scripting, and automation.',
    color: '#3776AB',
    order: 1,
    isPublished: true,
  },
  {
    name: 'JavaScript',
    slug: 'javascript',
    description:
      'The language of the web. Runs in browsers and on servers (Node.js). Essential for front-end interactivity, full-stack development, and increasingly for mobile and desktop apps.',
    color: '#F7DF1E',
    order: 2,
    isPublished: true,
  },
  {
    name: 'TypeScript',
    slug: 'typescript',
    description:
      'A typed superset of JavaScript that compiles to plain JS. Adds static type checking, interfaces, generics, and better tooling for large-scale applications.',
    color: '#3178C6',
    order: 3,
    isPublished: true,
  },
] as const;
