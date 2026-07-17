import { SEO } from "@/components/seo";
import { DashboardLayout } from "@/components/layout";
import { useListChatbots } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Bot, CircleDot, Briefcase, Smile, TrendingUp, Code2, Crown } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

const personalityIcons = {
  professional: { icon: Briefcase, color: "text-blue-500" },
  friendly: { icon: Smile, color: "text-green-500" },
  sales: { icon: TrendingUp, color: "text-orange-500" },
  technical: { icon: Code2, color: "text-purple-500" },
  luxury: { icon: Crown, color: "text-yellow-500" },
};

const statusColors = {
  draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  training: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  ready: "bg-green-500/20 text-green-400 border-green-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function Chatbots() {
  const { data: chatbots, isLoading } = useListChatbots();

  return (
    <DashboardLayout>
      <SEO title="Agents" description="Manage your AI support agents." />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground mt-1">Configure and train your AI workforce.</p>
        </div>
        <Link href="/chatbots/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Agent
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24"></CardHeader>
              <CardContent className="h-32"></CardContent>
            </Card>
          ))}
        </div>
      ) : chatbots?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card border border-border rounded-xl">
          <Bot className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No agents deployed yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first AI support agent, train it on your knowledge base, and embed it on your website in minutes.
          </p>
          <Link href="/chatbots/new">
            <Button size="lg">Create First Agent</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots?.map(bot => {
            const Icon = personalityIcons[bot.personality as keyof typeof personalityIcons]?.icon || Bot;
            const iconColor = personalityIcons[bot.personality as keyof typeof personalityIcons]?.color || "text-primary";
            
            return (
              <Card key={bot.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-black/20 border border-white/5`}>
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <CardTitle className="text-lg">{bot.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className={statusColors[bot.status as keyof typeof statusColors]}>
                    <CircleDot className="w-3 h-3 mr-1" />
                    {bot.status}
                  </Badge>
                </CardHeader>
                <CardContent className="flex-1 mt-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {bot.description || "No description provided."}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Training Score</span>
                    <span className="font-medium">{bot.trainingScore !== null ? `${bot.trainingScore}%` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Conversations</span>
                    <span className="font-medium">{bot.totalConversations}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border">
                  <Link href={`/chatbots/${bot.id}`} className="w-full">
                    <Button variant="secondary" className="w-full">Configure</Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
