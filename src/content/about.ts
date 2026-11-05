import { type LucideIcon, ClipboardCheck, Compass, Layers } from 'lucide-react'

/*
 * About-page copy. Only facts that are in `src/config/site.ts` or `src/content/services.ts` are stated
 * as facts: Delhi base, delivery across India, the five services.
 * TODO(business): add the founding story, team, workshop/equipment and certifications once confirmed.
 * Do not add years in business, client names, machine counts or team sizes without confirmation.
 */

export type AboutPrinciple = { title: string; description: string; icon: LucideIcon }

export const aboutContent = {
  seo: {
    title: 'About',
    description:
      'Kapi Forge is a Delhi-based 3D printing, digital printing, offset printing, prototyping and bulk printing service delivering across India.',
  },
  hero: {
    eyebrow: 'About',
    title: 'Prototyping and printing, from Delhi to all of India.',
    lead: 'Kapi Forge brings 3D printing, custom prototyping and commercial printing together, so an idea can move from first model to full print run with one team.',
  },
  intro: {
    title: 'Ideas take shape. We make them real.',
    paragraphs: [
      'Kapi Forge works with people who have something to make: a part to test, a product to launch, a run of printed material to deliver.',
      'We offer five services: 3D printing, digital printing, offset printing, prototyping and bulk printing. You can use one of them or combine them as your project grows.',
    ],
  },
  principles: [
    {
      icon: ClipboardCheck,
      title: 'Clear specifications',
      description:
        'The quote form asks for the details that matter for each service, so we can respond with a quote that reflects your job.',
    },
    {
      icon: Compass,
      title: 'Honest guidance',
      description:
        'If you are unsure about a material, paper or finish, tell us. We will explain the options and what each is suited to.',
    },
    {
      icon: Layers,
      title: 'Prototype to production',
      description:
        'Start small with a prototype, then scale into digital, offset or bulk printing without starting again with a new supplier.',
    },
  ] satisfies AboutPrinciple[],
  location: {
    title: 'Based in Delhi. Serving customers across India.',
    description:
      'We work from Delhi and deliver to addresses across the country. Tell us your delivery city in your quote request.',
  },
}
