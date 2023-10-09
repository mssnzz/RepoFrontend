"use client";
import { ModeToggle } from "@/components/dark-mode";
import { MainNav } from "@/components/main-nav";
import TeamSwitcher from "@/components/team-switcher";
import Image from "next/image";
import { ThemeProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CardsSection } from "@/components/sections/cards";
import HeatmapChart from "@/components/chart";
import { MembersList } from "@/components/sections/Members";
import { useState } from "react";

export type RepoInfo = {
  repo: string;
  owner: string;
};

const DEFAULT_REPOS: RepoInfo[] = [
  {
    repo: "GithubHandlerBacked",
    owner: "mssnzz",
  },
  {
    repo: "GithubHandlerFrontend",
    owner: "mssnzz",
  },
  {
    repo: "react",
    owner: "facebook",
  },
];
export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState<RepoInfo>(DEFAULT_REPOS[0]);
  const [repos, setRepos] = useState<RepoInfo[]>(DEFAULT_REPOS);

  const addRepo = (newRepo: RepoInfo) => {
    setRepos(prevRepos => [...prevRepos, newRepo]);
  };


  return (
    <ThemeProvider attribute="class">
       <div className="border-b">
        <div
          className="flex h-16 items-center"
          style={{ paddingLeft: "15%", paddingRight: "15%" }}
        >
          <TeamSwitcher 
            selectedRepo={selectedRepo} 
            setSelectedRepo={setSelectedRepo} 
            repos={repos} 
            addRepo={addRepo}
          />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Button>View on GitHub</Button>
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div
        className="flext-1 space-y-4 p-8 pt-9"
        style={{ paddingLeft: "15%", paddingRight: "15%" }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <Breadcrumbs />
          </div>
          <div className="flex items-center space-x-2">
            <Button>Download</Button>
          </div>
        </div>
        <div className="flex">
          <div className="w-9/12">
            {/* Cards */}
            <CardsSection selectedRepo={selectedRepo} />


            {/* Chart */}
            <h5 className="text-xl font-bold tracking-tight mt-8">
              Project Contributors
            </h5>
            <HeatmapChart />
            {/* Members */}
            <h5 className="text-xl font-bold tracking-tight mt-8">
              Members status
            </h5>
            <div className="border mt-6">
              <MembersList />
            </div>
          </div>
          <div className="w-3/12 p-3 mt-3">
            <div className="border rounded">
              <MembersList />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
