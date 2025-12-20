import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star, Zap, HeadphonesIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const earlyAccessPerks = [
  { icon: Star, text: "Founding member pricing" },
  { icon: Zap, text: "Priority feature requests" },
  { icon: HeadphonesIcon, text: "Direct founder access" },
];

interface WaitlistSectionProps {
  formRef?: React.RefObject<HTMLDivElement>;
}

export default function WaitlistSection({ formRef }: WaitlistSectionProps) {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    role: "",
    companySize: "",
    isPilotPartner: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const formDataToSubmit = new FormData(form);

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formDataToSubmit as any).toString(),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "You're on the list!",
          description: "We'll be in touch soon with early access details.",
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="waitlist" className="py-16 lg:py-24 bg-primary/5" ref={formRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="text-waitlist-success">
              Welcome to StabiliMetric Pro!
            </h2>
            <p className="text-lg text-muted-foreground">
              We've added you to our early access list. Keep an eye on your inbox for updates and exclusive invites.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-16 lg:py-24 bg-primary/5" ref={formRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4" data-testid="text-waitlist-headline">
              Get Early Access
            </h2>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-waitlist-subheadline">
              Be among the first to revolutionize your formulation workflow. Early members receive exclusive benefits.
            </p>
            
            <div className="space-y-4">
              {earlyAccessPerks.map((perk, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <perk.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg">{perk.text}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-xl">
            <CardContent className="p-6 lg:p-8">
              <form 
                name="waitlist" 
                method="POST" 
                data-netlify="true" 
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit} 
                className="space-y-5"
              >
                <input type="hidden" name="form-name" value="waitlist" />
                <input type="hidden" name="bot-field" />
                
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Your company"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    data-testid="input-company"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role</Label>
                    <input type="hidden" name="role" value={formData.role} />
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger id="role" data-testid="select-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="founder">Founder / CEO</SelectItem>
                        <SelectItem value="formulator">Formulator / Chemist</SelectItem>
                        <SelectItem value="rd">R&D Manager</SelectItem>
                        <SelectItem value="regulatory">Regulatory Affairs</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <input type="hidden" name="companySize" value={formData.companySize} />
                    <Select
                      value={formData.companySize}
                      onValueChange={(value) => setFormData({ ...formData, companySize: value })}
                    >
                      <SelectTrigger id="companySize" data-testid="select-size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input 
                    type="hidden" 
                    name="isPilotPartner" 
                    value={formData.isPilotPartner ? "on" : ""} 
                  />
                  <Checkbox
                    id="pilot"
                    checked={formData.isPilotPartner}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPilotPartner: checked as boolean })
                    }
                    data-testid="checkbox-pilot"
                  />
                  <Label htmlFor="pilot" className="text-sm leading-relaxed cursor-pointer">
                    I'm interested in becoming a pilot partner and providing feedback on early features.
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="button-submit-waitlist"
                >
                  {isSubmitting ? "Joining..." : "Get Early Access"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
