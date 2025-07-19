export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="bg-muted py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                    How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                            1
                        </div>
                        <h3 className="font-semibold mb-2">
                            Input Your Content
                        </h3>
                        <p>
                            Paste text, upload a PDF, or provide a link to video
                            or audio content.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                            2
                        </div>
                        <h3 className="font-semibold mb-2">
                            AI Processes Content
                        </h3>
                        <p>
                            Our advanced AI analyzes the content and generates
                            relevant questions.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                            3
                        </div>
                        <h3 className="font-semibold mb-2">Get Your Quiz</h3>
                        <p>
                            Receive a set of questions based on your content,
                            ready to use or customize.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
