import {
  FaApple,
  FaDiscord,
  FaRedditAlien,
  FaTelegramPlane,
  FaTwitter,
} from 'react-icons/fa';

import { Separator } from '@/components/ui/separator';

const sections = [
  {
    title: 'Product',
    links: [
      { name: 'Overview', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Quiz Templates', href: '#' },
      { name: 'Features', href: '#' },
      { name: 'AI Quiz Generator', href: '#' },
      { name: 'Integrations', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '#' },
      { name: 'Team', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'API Documentation', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  },
];

const Footer = () => {
  return (
    <section className="py-24 px-8">
      <div className="container mx-auto">
        <footer>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <p className="text-lg font-medium text-primary">
                Take your learning experience to the next level.
              </p>
            </div>
          </div>
          <Separator className="my-14" />
          <div className="grid gap-8 grid-cols-2 lg:grid-cols-4">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-primary">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="mb-4 mt-8 font-bold text-primary">Social</h3>
              <ul className="flex items-center space-x-6 text-muted-foreground">
                <li className="font-medium hover:text-primary">
                  <a href="#">
                    <FaDiscord className="size-6" />
                  </a>
                </li>
                <li className="font-medium hover:text-primary">
                  <a href="#">
                    <FaRedditAlien className="size-6" />
                  </a>
                </li>
                <li className="font-medium hover:text-primary">
                  <a href="#">
                    <FaTwitter className="size-6" />
                  </a>
                </li>
                <li className="font-medium hover:text-primary">
                  <a href="#">
                    <FaTelegramPlane className="size-6" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-14" />
          <p className="text-sm text-muted-foreground text-center">
            © 2024 QuizMaster Pro. All rights reserved.
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
