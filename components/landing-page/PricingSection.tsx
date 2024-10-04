import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-muted py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader><CardTitle>Basic</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">$9.99<span className="text-sm font-normal">/month</span></p>
              <ul className="space-y-2">
                <li>Generate 50 quizzes/month</li>
                <li>Text and PDF support</li>
                <li>Email support</li>
              </ul>
              <Button className="w-full mt-6">Choose Plan</Button>
            </CardContent>
          </Card>
          <Card className="border-primary">
            <CardHeader><CardTitle>Pro</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">$24.99<span className="text-sm font-normal">/month</span></p>
              <ul className="space-y-2">
                <li>Generate 200 quizzes/month</li>
                <li>All content types supported</li>
                <li>Priority email support</li>
                <li>Custom branding</li>
              </ul>
              <Button className="w-full mt-6">Choose Plan</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Enterprise</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">Custom</p>
              <ul className="space-y-2">
                <li>Unlimited quizzes</li>
                <li>All features included</li>
                <li>24/7 phone support</li>
                <li>Custom integrations</li>
              </ul>
              <Button className="w-full mt-6">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
