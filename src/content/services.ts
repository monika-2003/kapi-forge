import { Box, Boxes, Layers, type LucideIcon, PencilRuler, Printer } from 'lucide-react'
import { type AppPath, paths } from '@/config/paths'

/*
 * The service catalogue. Navigation, the services overview, the shared service page and the
 * quote wizard all read from this list. Copy describes capabilities in general terms only;
 * anything marked TODO(business) must be confirmed before launch (see CURSOR.md §16).
 */

export type ServiceSlug =
  '3d-printing' | 'digital-printing' | 'offset-printing' | 'prototyping' | 'bulk-printing'

type Titled = { title: string; description: string }

export type ServiceContent = {
  slug: ServiceSlug
  name: string
  path: AppPath
  icon: LucideIcon
  /** Card text on the home page and /services. */
  summary: string
  seo: { title: string; description: string }
  hero: { eyebrow: string; headline: string; intro: string }
  highlights: Titled[]
  /** Types of work the service typically covers. */
  offerings: { title: string; items: string[] }
  process: Titled[]
  fileGuidance?: { title: string; formats: string[]; notes: string[] }
  faqs: { question: string; answer: string }[]
}

const quoteProcess = (build: string): Titled[] => [
  {
    title: 'Tell us what you need',
    description:
      'Share your requirements through the quote form: what you want made, quantities, sizes and when you need it.',
  },
  {
    title: 'We review your enquiry',
    description:
      'We look at the details, ask questions if something is unclear, and come back to you with a quote.',
  },
  {
    title: build,
    description:
      'Once you are happy with the quote and the details, your order goes into production.',
  },
  {
    title: 'Delivered across India',
    description: 'Finished work is packed and delivered to your address anywhere in India.',
  },
]

export const services: readonly ServiceContent[] = [
  {
    slug: '3d-printing',
    name: '3D Printing',
    path: paths.threeDPrinting,
    icon: Box,
    summary:
      'Parts, models and prototypes printed from your 3D files, for design checks, fit tests and small production runs.',
    seo: {
      title: '3D Printing in Delhi, delivered across India',
      description:
        'Custom 3D printing for prototypes, models and parts. Share your 3D design and get a quote from Kapi Forge, Delhi. Delivery across India.',
    },
    hero: {
      eyebrow: '3D Printing',
      headline: 'From digital model to physical part.',
      intro:
        'Send us your 3D design and we will help you choose a material, finish and approach that suits how the part will be used.',
    },
    highlights: [
      {
        title: 'Prototype or production',
        description:
          'A single test piece or a repeat batch. Tell us the purpose and the quantity and we will advise on the right approach.',
      },
      {
        title: 'Material guidance',
        description:
          'Not sure which material to choose? Describe how the part will be used and we will recommend options when we review your enquiry.',
      },
      {
        title: 'Finish to suit the part',
        description:
          'Let us know whether the part is for testing, display or end use, and we will discuss the finish that fits.',
      },
    ],
    offerings: {
      title: 'What you can bring us',
      items: [
        'Design prototypes and concept models',
        'Fit and function test parts',
        'Display and presentation models',
        'Custom one-off components',
        'Small batches of repeat parts',
      ],
    },
    process: quoteProcess('We print your parts'),
    fileGuidance: {
      title: 'Preparing your 3D files',
      // TODO(business): confirm accepted formats.
      formats: ['STL', 'OBJ', 'STEP', '3MF'],
      notes: [
        'Include units and key dimensions if your model might not be to scale.',
        'Point out any fit-critical features, such as holes, threads or mating surfaces.',
        'Files are not uploaded through this website yet. After you start your enquiry, attach them to the email or WhatsApp message.',
      ],
    },
    faqs: [
      {
        question: 'Which file formats can I send?',
        answer:
          'STL, OBJ, STEP and 3MF files are the most common. If you have another format, mention it in your enquiry and we will let you know.',
      },
      {
        question: 'I do not have a 3D model yet. Can you help?',
        answer:
          'Describe your idea and include any sketches or reference photos with your enquiry. You can also look at our Custom Prototyping service, and we will tell you how we can help.',
      },
      {
        question: 'How long will my order take?',
        answer:
          'It depends on the size, quantity and finish. Add the date you need it by to your enquiry and we will confirm what is possible.',
      },
      {
        question: 'Do you deliver outside Delhi?',
        answer: 'Yes. We are based in Delhi and serve customers across India.',
      },
    ],
  },
  {
    slug: 'digital-printing',
    name: 'Digital Printing',
    path: paths.digitalPrinting,
    icon: Printer,
    summary:
      'Print on demand for documents, marketing material and stationery, in quantities that suit you.',
    seo: {
      title: 'Digital Printing in Delhi, delivered across India',
      description:
        'Digital printing for brochures, flyers, cards, posters and stationery in flexible quantities. Request a quote from Kapi Forge, Delhi.',
    },
    hero: {
      eyebrow: 'Digital Printing',
      headline: 'Print what you need, in the quantity you need.',
      intro:
        'Digital printing suits shorter runs and quick turnarounds. Tell us the product, paper and finish and we will put together a quote.',
    },
    highlights: [
      {
        title: 'Flexible quantities',
        description:
          'Digital printing does not need printing plates, which makes smaller runs practical.',
      },
      {
        title: 'Paper, size and finish',
        description:
          'Choose the paper size and weight, single or double-sided printing, colour and finishing for your job.',
      },
      {
        title: 'Delivered across India',
        description: 'We are based in Delhi and deliver finished work to addresses across India.',
      },
    ],
    offerings: {
      // TODO(business): confirm the product list.
      title: 'Typical products',
      items: [
        'Flyers and leaflets',
        'Brochures and booklets',
        'Business cards and stationery',
        'Posters and signage',
        'Labels and stickers',
      ],
    },
    process: quoteProcess('We print your job'),
    fileGuidance: {
      title: 'Preparing your artwork',
      // TODO(business): confirm accepted formats and prepress requirements.
      formats: ['PDF', 'AI', 'EPS', 'PSD', 'JPG', 'PNG', 'TIFF'],
      notes: [
        'A print-ready PDF with fonts embedded gives the most predictable result.',
        'Add bleed if your design runs to the edge, and keep important text away from the trim.',
        'Files are not uploaded through this website yet. After you start your enquiry, attach them to the email or WhatsApp message.',
      ],
    },
    faqs: [
      {
        question: 'What is the difference between digital and offset printing?',
        answer:
          'Digital printing is well suited to smaller runs. Offset printing is generally chosen for larger volumes. If you are unsure, enter your quantity in the quote form and we will recommend one.',
      },
      {
        question: 'Can you help if my artwork is not print-ready?',
        answer:
          'Send what you have with your enquiry and tell us what is missing. We will let you know what is needed.',
      },
      {
        question: 'Can I request a specific paper?',
        answer:
          'Yes. Choose the size and paper weight in the quote form, or describe what you have in mind in the notes.',
      },
      {
        question: 'Do you deliver outside Delhi?',
        answer: 'Yes. We serve customers across India.',
      },
    ],
  },
  {
    slug: 'offset-printing',
    name: 'Offset Printing',
    path: paths.offsetPrinting,
    icon: Layers,
    summary:
      'Larger print runs with consistent results: brochures, catalogues, books and stationery.',
    seo: {
      title: 'Offset Printing in Delhi, delivered across India',
      description:
        'Offset printing for catalogues, books, brochures and stationery, with paper, binding and finishing options. Request a quote from Kapi Forge, Delhi.',
    },
    hero: {
      eyebrow: 'Offset Printing',
      headline: 'Consistent quality at volume.',
      intro:
        'Offset printing is the usual choice for larger runs. Tell us about your paper, colours, binding and finishing and we will quote it.',
    },
    highlights: [
      {
        title: 'Built for volume',
        description:
          'Offset printing is generally chosen for large runs, where the cost per piece falls as quantity rises.',
      },
      {
        title: 'Paper and finishing',
        description:
          'Specify the paper, number of colours and finishing, and we will confirm what suits the job.',
      },
      {
        title: 'Binding options',
        description:
          'For booklets, catalogues and books, tell us how the finished piece should be bound.',
      },
    ],
    offerings: {
      // TODO(business): confirm the product list.
      title: 'Typical products',
      items: [
        'Catalogues and brochures',
        'Books and booklets',
        'Letterheads and stationery',
        'Folders and inserts',
        'Large-quantity marketing material',
      ],
    },
    process: quoteProcess('We print your run'),
    fileGuidance: {
      title: 'Preparing your artwork',
      // TODO(business): confirm accepted formats and prepress requirements.
      formats: ['PDF', 'AI', 'EPS', 'INDD', 'PSD', 'TIFF'],
      notes: [
        'A print-ready PDF with fonts embedded and images included is preferred.',
        'Add bleed and crop marks if your design runs to the edge.',
        'Files are not uploaded through this website yet. After you start your enquiry, attach them to the email or WhatsApp message.',
      ],
    },
    faqs: [
      {
        question: 'When should I choose offset over digital?',
        answer:
          'Usually for larger quantities. Share your quantity and product in the quote form and we will advise on the better option.',
      },
      {
        question: 'Can you advise on paper and binding?',
        answer:
          'Yes. If you are not sure what to choose, say so in your enquiry and describe how the piece will be used.',
      },
      {
        question: 'Can you deliver to more than one address?',
        answer:
          'Mention all delivery locations in your enquiry notes and we will confirm what is possible.',
      },
      {
        question: 'Do you deliver outside Delhi?',
        answer: 'Yes. We serve customers across India.',
      },
    ],
  },
  {
    slug: 'prototyping',
    name: 'Custom Prototyping',
    path: paths.prototyping,
    icon: PencilRuler,
    summary:
      'Turn concepts into physical models you can hold, test and refine before committing to production.',
    seo: {
      title: 'Custom Prototyping in Delhi, delivered across India',
      description:
        'Custom prototyping to turn product ideas into physical models for testing and review. Describe your project and get a quote from Kapi Forge, Delhi.',
    },
    hero: {
      eyebrow: 'Custom Prototyping',
      headline: 'Hold the idea in your hands.',
      intro:
        'A prototype shows what drawings cannot. Describe your concept and we will talk through the best way to make it real.',
    },
    highlights: [
      {
        title: 'Concept to model',
        description:
          'Start from a sketch, a drawing or a 3D file. Tell us where you are and what you want to learn from the prototype.',
      },
      {
        title: 'Room to iterate',
        description:
          'Early prototypes rarely end up as the final version. Ask about refining the design after your first round.',
      },
      {
        title: 'Guidance on the approach',
        description:
          'We will discuss which process and materials suit your prototype when we review your enquiry.',
      },
    ],
    offerings: {
      // TODO(business): confirm the prototype types offered.
      title: 'What you can bring us',
      items: [
        'Concept and look-and-feel models',
        'Fit and function prototypes',
        'Presentation models',
        'Print and packaging mock-ups',
        'Revisions of an existing prototype',
      ],
    },
    process: [
      {
        title: 'Describe your idea',
        description:
          'Tell us what you are building, what the prototype needs to show, and any sizes, materials or deadlines.',
      },
      {
        title: 'We review and advise',
        description:
          'We look at your brief, ask what we need to know, and recommend an approach with a quote.',
      },
      {
        title: 'We build your prototype',
        description: 'After you approve the quote and details, we make the prototype.',
      },
      {
        title: 'Review and refine',
        description:
          'Look over the result, share feedback, and discuss next steps, whether that is a revision or a larger run.',
      },
    ],
    fileGuidance: {
      title: 'What to share',
      formats: ['Sketches', 'Technical drawings', 'Reference photos', 'CAD or 3D files'],
      notes: [
        'Include dimensions or a sense of scale, even if approximate.',
        'Say what the prototype must demonstrate: look, fit, movement or strength.',
        'Files are not uploaded through this website yet. After you start your enquiry, attach them to the email or WhatsApp message.',
      ],
    },
    faqs: [
      {
        question: 'Do I need a finished design?',
        answer:
          'No. A sketch and a clear description is a good start. Tell us what stage you are at.',
      },
      {
        question: 'Can you keep my design confidential?',
        answer:
          'If confidentiality matters for your project, say so in your enquiry and we will discuss it with you before you share anything sensitive.',
      },
      {
        question: 'Can I order more of the same prototype later?',
        answer:
          'Ask about it in your enquiry. If you plan to move to larger quantities, we can discuss our printing services too.',
      },
      {
        question: 'Do you deliver outside Delhi?',
        answer: 'Yes. We serve customers across India.',
      },
    ],
  },
  {
    slug: 'bulk-printing',
    name: 'Bulk Printing',
    path: paths.bulkPrinting,
    icon: Boxes,
    summary:
      'Large-volume print orders, planned and delivered across India for campaigns, businesses and events.',
    seo: {
      title: 'Bulk Printing in Delhi, delivered across India',
      description:
        'Bulk printing for businesses, campaigns and events with delivery across India. Tell us your quantity and get a quote from Kapi Forge, Delhi.',
    },
    hero: {
      eyebrow: 'Bulk Printing',
      headline: 'Large orders, handled with care.',
      intro:
        'When quantities are big, planning matters. Share what you need, how many, and where it has to go, and we will quote it.',
    },
    highlights: [
      {
        title: 'Planned for volume',
        description:
          'Tell us the quantity and your deadline so we can plan the job and confirm what is realistic.',
      },
      {
        title: 'Consistent output',
        description:
          'Large runs should look the same from the first piece to the last. Ask us how we approach that for your job.',
      },
      {
        title: 'Delivery across India',
        description:
          'One order can be delivered to your address anywhere in India. Mention multiple destinations in your enquiry.',
      },
    ],
    offerings: {
      // TODO(business): confirm the product list.
      title: 'Typical orders',
      items: [
        'Corporate stationery in volume',
        'Campaign and marketing collateral',
        'Catalogues and brochures',
        'Event materials',
        'Labels, forms and printed packs',
      ],
    },
    process: quoteProcess('We plan and print your order'),
    fileGuidance: {
      title: 'Preparing your artwork',
      // TODO(business): confirm accepted formats.
      formats: ['PDF', 'AI', 'EPS', 'PSD', 'TIFF'],
      notes: [
        'Print-ready PDFs with fonts embedded are preferred for large runs.',
        'Tell us if the order has several versions or languages.',
        'Files are not uploaded through this website yet. After you start your enquiry, attach them to the email or WhatsApp message.',
      ],
    },
    faqs: [
      {
        question: 'What counts as a bulk order?',
        answer:
          'There is no fixed threshold on this page. Tell us your quantity and product and we will advise whether digital or offset printing suits the job.',
      },
      {
        question: 'Can I get a quote before sending artwork?',
        answer:
          'Yes. Describe the product, size, paper and quantity in the quote form. You can send artwork afterwards.',
      },
      {
        question: 'Can one order go to several cities?',
        answer:
          'Mention every delivery location in your enquiry notes and we will confirm what is possible.',
      },
      {
        question: 'Do you deliver outside Delhi?',
        answer: 'Yes. We serve customers across India.',
      },
    ],
  },
]

export const serviceSlugs = services.map((service) => service.slug) as [
  ServiceSlug,
  ...ServiceSlug[],
]

export function isServiceSlug(value: unknown): value is ServiceSlug {
  return typeof value === 'string' && serviceSlugs.some((slug) => slug === value)
}

export function getServiceBySlug(slug: string): ServiceContent | undefined {
  return services.find((service) => service.slug === slug)
}

export function getServiceByPath(pathname: string): ServiceContent | undefined {
  const normalised = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
  return services.find((service) => service.path === normalised)
}
