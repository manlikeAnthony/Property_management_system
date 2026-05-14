import { Mail, MapPin, Phone } from "lucide-react";
import { SiteLayout } from "@/components/layouts/site-layout";
import { SectionTitle } from "@/components/common/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const ContactPage = () => (
  <SiteLayout>
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Contact"
          title="Talk to the Homify team"
          description="Need help with onboarding, landlord approvals, or integration details?"
        />
        <div className="space-y-3">
          {[
            { icon: Mail, title: "Email", value: "support@homify.app" },
            { icon: Phone, title: "Phone", value: "+234 901 000 0000" },
            { icon: MapPin, title: "Office", value: "Lagos, Nigeria" },
          ].map((item) => (
            <Card key={item.title} className="border-border/60 bg-card/80">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-border/60 bg-card/90 shadow-soft">
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Name" />
            <Input placeholder="Email" type="email" />
          </div>
          <Input placeholder="Subject" />
          <Textarea placeholder="How can we help?" />
          <Button className="w-full">Send message</Button>
        </CardContent>
      </Card>
    </div>
  </SiteLayout>
);

export default ContactPage;
