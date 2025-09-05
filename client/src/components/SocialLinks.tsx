import { Card, CardContent } from "@/components/ui/card";
import { Share2, MessageCircle, Newspaper, Globe, FileText } from "lucide-react";

export default function SocialLinks() {
  const links = [
    {
      icon: MessageCircle,
      title: "Telegram Groups",
      description: "Join community",
      url: "https://t.me/bitnestfinance",
      color: "text-primary"
    },
    {
      icon: Newspaper,
      title: "Telegram News",
      description: "Latest updates",
      url: "https://t.me/bitnestnews",
      color: "text-secondary"
    },
    {
      icon: Globe,
      title: "Official Website",
      description: "bitnest.finance",
      url: "https://bitnest.finance",
      color: "text-accent"
    },
    {
      icon: FileText,
      title: "WhitePaper",
      description: "Learn more",
      url: "https://bitnest.finance",
      color: "text-primary"
    }
  ];

  return (
    <Card className="mt-8 bg-card border-border" data-testid="card-social-links">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Share2 className="mr-3 text-primary" />
          Connect with BitNest
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {links.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <a 
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-muted/80 rounded-lg p-4 text-center transition-colors cursor-pointer"
                data-testid={`link-${link.title.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <IconComponent className={`${link.color} text-2xl mb-2 mx-auto`} />
                <div className="font-medium">{link.title}</div>
                <div className="text-sm text-muted-foreground">{link.description}</div>
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
