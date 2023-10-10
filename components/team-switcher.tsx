"use client";
import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { fetchRepoData } from "@/services/api";
import { ClipLoader } from "react-spinners";
import { RepoInfo } from "../app/page"; // Ajusta la importación al archivo correcto

interface TeamSwitcherProps {
  className?: string;
  selectedRepo: RepoInfo;
  setSelectedRepo: (repo: RepoInfo) => void;
  repos: RepoInfo[];
  addRepo: (newRepo: RepoInfo) => void;
}
const extract_github_info = (url: string): Partial<RepoInfo> => {
  const pattern = /https?:\/\/github\.com\/([^/]+)\/([^/]+)/;
  const match = url.match(pattern);
  if (match) {
    return { owner: match[1], repo: match[2] };
  }
  return {};
};

const TeamSwitcher: React.FC<TeamSwitcherProps> = ({
  className,
  selectedRepo,
  setSelectedRepo,
  repos,
  addRepo,
}) => {
  const [open, setOpen] = React.useState(false);

  const [showAddRepoDialog, setShowAddRepoDialog] = React.useState(false);
  const [repoUrl, setRepoUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRepoSelect = async (repoInfo: RepoInfo) => {
    setIsLoading(true);
    try {
      const repoData = await fetchRepoData(repoInfo.owner, repoInfo.repo);
      console.log(repoData);
      setSelectedRepo(repoInfo);
      setOpen(false);
    } catch (error) {
      console.error("Error selecting repo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRepo = () => {
    const { owner, repo } = extract_github_info(repoUrl);
    if (owner && repo) {
      addRepo({ owner, repo });
      setShowAddRepoDialog(false);
      setRepoUrl("");
    } else {
      console.error("Invalid GitHub URL");
    }
  };

  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <ClipLoader color="#000" />
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a repository"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedRepo.owner}.png`}
                alt={selectedRepo.repo}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "calc(100% - 60px)", // Ajusta este valor según necesidades
              }}
            >
              {selectedRepo.owner}/{selectedRepo.repo}
            </span>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search repositories..." />
              <CommandEmpty>No repository found.</CommandEmpty>
              {repos.map((repoInfo) => (
                <CommandItem
                  key={`${repoInfo.owner}-${repoInfo.repo}`} // Combinación de owner y repo
                  onSelect={() => handleRepoSelect(repoInfo)}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${repoInfo.owner}.png`}
                      alt={repoInfo.repo}
                      className="grayscale"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "calc(100% - 60px)",
                    }}
                  >
                    {repoInfo.owner}/{repoInfo.repo}
                  </span>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedRepo.owner === repoInfo.owner &&
                        selectedRepo.repo === repoInfo.repo
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setShowAddRepoDialog(true);
                  }}
                >
                  <PlusCircledIcon className="mr-2 h-5 w-5" />
                  Add Repository
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={showAddRepoDialog} onOpenChange={setShowAddRepoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Repository</DialogTitle>
            <DialogDescription>
              Enter the GitHub repository URL.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="repoUrl">Repository URL</Label>
              <Input
                id="repoUrl"
                placeholder="https://github.com/owner/repo"
                value={repoUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRepoUrl(e.target.value)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddRepoDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddRepo}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeamSwitcher;
