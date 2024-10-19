import { Cookie } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CookiePolicyPage() {
  return (
    <main className="py-16 px-4 container mx-auto">
      <Card className="mx-auto shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="space-y-2">
          <CardTitle className="text-4xl font-bold flex items-center">
            <Cookie className="mr-3 h-8 w-8 text-primary" />
            Cookie Policy
          </CardTitle>
          <CardDescription className="text-lg">
            Last updated: October 17, 2024
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-lg">
              This Cookie Policy explains how Quiz Master uses cookies and
              similar technologies to recognize you when you visit our website.
              It explains what these technologies are and why we use them, as
              well as your rights to control our use of them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">
              2. What are cookies?
            </h2>
            <p className="text-lg">
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. Cookies are widely used by
              website owners in order to make their websites work, or to work
              more efficiently, as well as to provide reporting information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">
              3. Why do we use cookies?
            </h2>
            <p className="text-lg mb-2">
              We use cookies for several reasons, including:
            </p>
            <ul className="list-disc pl-6 text-lg">
              <li>To enable certain functions of the website</li>
              <li>To provide analytics</li>
              <li>To store your preferences</li>
              <li>To enable ad delivery and behavioral advertising</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">
              4. Types of cookies we use
            </h2>
            <p className="text-lg mb-2">The types of cookies we use include:</p>
            <ul className="list-disc pl-6 text-lg">
              <li>Essential cookies</li>
              <li>Functionality cookies</li>
              <li>Analytics cookies</li>
              <li>Advertising cookies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">
              5. How to control cookies
            </h2>
            <p className="text-lg">
              You have the right to decide whether to accept or reject cookies.
              You can set or amend your web browser controls to accept or refuse
              cookies. If you choose to reject cookies, you may still use our
              website though your access to some functionality and areas of our
              website may be restricted.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">
              6. Changes to this policy
            </h2>
            <p className="text-lg">
              We may update this Cookie Policy from time to time in order to
              reflect, for example, changes to the cookies we use or for other
              operational, legal or regulatory reasons. Please therefore
              re-visit this Cookie Policy regularly to stay informed about our
              use of cookies and related technologies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">7. Contact us</h2>
            <p className="text-lg">
              If you have any questions about our use of cookies or other
              technologies, please contact us at:
            </p>
            <p className="text-lg mt-2">
              Email:{' '}
              <a
                href="mailto:privacy@quizmaster.com"
                className="text-primary hover:underline"
              >
                privacy@quizmaster.com
              </a>
            </p>
            <p className="text-lg">
              Address: 123 Quiz Street, Knowledge City, QZ 12345
            </p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
