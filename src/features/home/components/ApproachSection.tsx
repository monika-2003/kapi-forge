import { Compass, MapPin, Workflow } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { FeatureGrid } from '@/components/shared/FeatureGrid'
import { ProcessSteps } from '@/components/shared/ProcessSteps'
import { SectionHeading } from '@/components/shared/SectionHeading'

// TODO(business): confirm the order process before launch.
const steps = [
  {
    title: 'Tell us what you need',
    description: 'Use the quote form to describe the job: the product, sizes, quantity and timing.',
  },
  {
    title: 'We review and respond',
    description: 'We check the details, ask questions if needed, and come back with a quote.',
  },
  {
    title: 'We produce your order',
    description: 'After you confirm, we print or build it to the agreed specification.',
  },
  {
    title: 'Delivered across India',
    description: 'Your order is delivered to an address anywhere in the country.',
  },
]

const strengths = [
  {
    icon: Workflow,
    title: 'One partner, idea to volume',
    description:
      'Start with a prototype, then move into digital, offset or bulk printing without changing supplier.',
  },
  {
    icon: Compass,
    title: 'Advice along the way',
    description:
      'Unsure about material, paper or finish? Say so in your enquiry and we will recommend options.',
  },
  {
    icon: MapPin,
    title: 'Delhi based, India wide',
    description: 'We work from Delhi and deliver to addresses across the country.',
  },
]

export function ApproachSection() {
  return (
    <>
      <Section aria-labelledby="home-process-heading">
        <SectionHeading
          id="home-process-heading"
          eyebrow="How it works"
          title="From first message to delivery."
        />
        <div className="mt-14">
          <ProcessSteps steps={steps} />
        </div>
      </Section>

      <Section aria-labelledby="home-strengths-heading" tone="muted">
        <SectionHeading
          id="home-strengths-heading"
          eyebrow="Why Kapi Forge"
          title="Made to be easy to work with."
        />
        <div className="mt-14">
          <FeatureGrid features={strengths} />
        </div>
      </Section>
    </>
  )
}
