"use client";
import { ModeToggle } from "@/components/dark-mode";
import { MainNav } from "@/components/main-nav";
import TeamSwitcher from "@/components/repo-switcher";
import Image from "next/image";
import { ThemeProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CardsSection } from "@/components/sections/cards";
import { HeatmapChart } from "@/components/chart";
import { MembersList } from "@/components/sections/Members";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { fetchRepoData } from "@/services/api";
import { CommitsList } from "@/components/sections/Commits";
import { ReloadIcon } from "@radix-ui/react-icons";
import RepoSwitcher from "@/components/repo-switcher";

export type RepoInfo = {
  repo: string;
  owner: string;
};

const DEFAULT_REPOS: RepoInfo[] = [
  {
    repo: "RepoBackend",
    owner: "mssnzz",
  },
  {
    repo: "RepoFrontend",
    owner: "mssnzz",
  },
  {
    repo: "react",
    owner: "facebook",
  },
  {
    repo: "next.js",
    owner: "vercel",
  },
  {
    repo: "nest",
    owner: "nestjs",
  },
];

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState<RepoInfo>(DEFAULT_REPOS[0]);
  const [repos, setRepos] = useState<RepoInfo[]>(DEFAULT_REPOS);
  const [loading, setLoading] = useState(true);

  const addRepo = (newRepo: RepoInfo) => {
    setRepos((prevRepos) => [...prevRepos, newRepo]);
  };

  useEffect(() => {
    setLoading(true);
    fetchRepoData(selectedRepo.owner, selectedRepo.repo).then(() => {
      setLoading(false);
    });
  }, [selectedRepo]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <ClipLoader color="#000" />
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
          <RepoSwitcher
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

      <div className="flext-1 space-y-4 p-6 sm:p-6 md:p-8 lg:px-24 xl:px-40 sm:ml-3 sm:pt-2">
        <div className="flex flex-col sm:flex-row items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <Breadcrumbs selectedRepo={selectedRepo} />
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <ReloadIcon />
              &nbsp;Refresh repository
            </Button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-8/12">
            <CardsSection selectedRepo={selectedRepo} />
            <h5 className="text-xl font-bold tracking-tight mt-8">
              Project Contributors
            </h5>
            <div className="mt-7">
              <HeatmapChart selectedRepo={selectedRepo} />
            </div>

            <h5 className="text-xl font-bold tracking-tight mt-8">
              Members status
            </h5>
            <div className="border mt-6 w-full">
              <MembersList selectedRepo={selectedRepo} />
            </div>
          </div>
          <div className="w-full lg:w-4/12 lg:p-3 sm:p-0  mt-3 lg:mt-3">
            <div className="border rounded w-full">
              <CommitsList selectedRepo={selectedRepo} />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
