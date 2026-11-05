import { paths } from './paths'

/** Top-level links shown after the Services menu in the header and footer. */
export const companyLinks = [
  { label: 'About', href: paths.about },
  { label: 'Contact', href: paths.contact },
] as const
