import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, CheckCircle, Shield } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Multiple Content Types</CardTitle>
            </CardHeader>
            <CardContent>Generate quizzes from text, video links, audio links, and PDF files.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CheckCircle className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>AI-Powered Questions</CardTitle>
            </CardHeader>
            <CardContent>Our advanced AI generates relevant and challenging questions from your content.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>Your content is processed securely and never stored without your permission.</CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
