import { auth, login, logout } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  IconDatabase,
  IconGitBranch,
  IconBolt,
  IconArrowRight,
} from "@tabler/icons-react";

export default async function Home() {
  const subject = await auth();

  return (
    <div className="min-h-screen bg-dot-pattern relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold relative group">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
              Chainhook
            </span>
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-primary group-hover:w-full transition-all duration-300" />
          </Link>
          <div className="flex items-center gap-6">
            {subject ? (
              <>
                <Badge
                  variant="secondary"
                  className="hidden sm:inline-flex animate-fade-in px-4 py-2 bg-white/10 backdrop-blur-sm"
                >
                  {subject.properties.username}
                </Badge>
                <Link href="/dashboard">
                  <Button className="relative overflow-hidden group px-6 py-2 bg-primary hover:bg-primary/90">
                    <span className="relative z-10">Go to Dashboard</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
                <form action={logout}>
                  <Button
                    variant="ghost"
                    className="hover:bg-red-500/10 hover:text-red-500 transition-colors duration-300"
                  >
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <form action={login}>
                <Button className="relative overflow-hidden group px-6 py-2 bg-primary hover:bg-primary/90">
                  <span className="relative z-10 flex items-center gap-2">
                    Login with GitHub
                    <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="container mx-auto px-6 py-32">
          {/* Hero Section */}
          <div className="flex flex-col items-center space-y-10 text-center relative">
            <Badge
              variant="secondary"
              className="animate-fade-in px-6 py-2 bg-white/10 backdrop-blur-sm"
            >
              Blockchain Indexing Made Simple
            </Badge>
            <h1 className="text-7xl font-bold tracking-tight animate-fade-in relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
                Index Solana Data
              </span>
              <br />
              <span className="text-6xl">with Unmatched Ease</span>
              <div className="absolute -right-12 top-0 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl animate-fade-in-up leading-relaxed">
              Connect your database and start indexing Solana blockchain data in
              minutes. Experience the future of blockchain indexing.
            </p>
            {!subject && (
              <form action={login} className="animate-fade-in-up">
                <Button
                  size="lg"
                  className="relative overflow-hidden group px-8 py-6 bg-primary hover:bg-primary/90 text-lg"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started with GitHub
                    <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </form>
            )}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto mt-32">
            {[
              {
                icon: IconDatabase,
                title: "Database Integration",
                description: "Connect your existing Postgres database",
                content:
                  "Seamlessly integrate with your existing database infrastructure. No need to set up new databases.",
              },
              {
                icon: IconGitBranch,
                title: "Custom Indexing",
                description: "Choose what data to index",
                content:
                  "Select from various index types like NFT mints, sales, transfers, and more. Customize your indexing needs.",
              },
              {
                icon: IconBolt,
                title: "Real-time Updates",
                description: "Get instant blockchain updates",
                content:
                  "Receive real-time updates as events happen on the Solana blockchain. Stay up-to-date with your data.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Getting Started Steps */}
          <div className="w-full max-w-4xl mx-auto mt-32 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
            <h2 className="text-4xl font-bold mb-16 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
                Getting Started
              </span>
            </h2>
            <div className="space-y-16 relative">
              {[
                {
                  step: "01",
                  title: "Connect Your Database",
                  description:
                    "Add your Postgres database connection details to get started.",
                },
                {
                  step: "02",
                  title: "Choose Index Type",
                  description:
                    "Select the type of blockchain data you want to index.",
                },
                {
                  step: "03",
                  title: "Start Indexing",
                  description:
                    "Your data will be automatically indexed and updated in real-time.",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-8 group relative"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-sm text-primary flex items-center justify-center text-2xl font-bold group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
