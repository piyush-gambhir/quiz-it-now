import { Mail, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ContactUsPage = () => {
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Contact Us
                    </h1>
                    <p className="mt-3 text-muted-foreground">
                        We are available for questions, feedback, or
                        collaboration opportunities.
                    </p>

                    <div className="mt-10 space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="flex size-9 items-center justify-center rounded border border-border bg-muted/50">
                                <Phone className="size-4 text-muted-foreground" />
                            </div>
                            <span>(123) 34567890</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="flex size-9 items-center justify-center rounded border border-border bg-muted/50">
                                <Mail className="size-4 text-muted-foreground" />
                            </div>
                            <a
                                href="mailto:your-email@example.com"
                                className="underline underline-offset-4"
                            >
                                your-email@example.com
                            </a>
                        </div>
                    </div>
                </div>

                <div className="rounded-md border border-border p-5 sm:p-6 md:p-8">
                    <div className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="firstname" className="text-sm">
                                    First Name
                                </Label>
                                <Input
                                    type="text"
                                    id="firstname"
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="lastname" className="text-sm">
                                    Last Name
                                </Label>
                                <Input
                                    type="text"
                                    id="lastname"
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm">
                                Email
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Email"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="subject" className="text-sm">
                                Subject
                            </Label>
                            <Input
                                type="text"
                                id="subject"
                                placeholder="Subject"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="message" className="text-sm">
                                Message
                            </Label>
                            <Textarea
                                placeholder="Type your message here."
                                id="message"
                                className="min-h-[120px]"
                            />
                        </div>
                        <Button className="w-full">Send Message</Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUsPage;
