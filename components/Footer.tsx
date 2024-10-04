import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-muted py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">QuizGenius</h3>
            <p className="text-sm text-muted-foreground">Transform your content into engaging quizzes with the power of AI.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-sm text-muted-foreground hover:underline">Features</Link></li>
              <li><Link href="#how-it-works" className="text-sm text-muted-foreground hover:underline">How It Works</Link></li>
              <li><Link href="#pricing" className="text-sm text-muted-foreground hover:underline">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Twitter</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:underline">LinkedIn</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:underline">Facebook</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-muted-foreground/20 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} QuizGenius. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
