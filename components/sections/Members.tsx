import { RepoInfo } from "@/app/page";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchRepoData } from "@/services/api";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CommitAuthor {
  avatar_url: string;
  login: string;
}

interface Commit {
  author: CommitAuthor;
}

export function MembersList({ selectedRepo }: { selectedRepo: RepoInfo }) {
  const [members, setMembers] = useState<
    {
      name: string;
      avatarUrl: string;
      commits: number;
      contributionRate: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepoData(selectedRepo.owner, selectedRepo.repo).then((data) => {
      const memberStats: {
        [key: string]: { commits: number; avatarUrl: string };
      } = {};

      data.commits.forEach((commit: Commit) => {
        if (memberStats[commit.author.login]) {
          memberStats[commit.author.login].commits += 1;
        } else {
          memberStats[commit.author.login] = {
            commits: 1,
            avatarUrl: commit.author.avatar_url,
          };
        }
        console.log(commit.author.avatar_url);
      });

      const totalCommits = data.commits.length;
      const membersArray = Object.keys(memberStats).map((login) => ({
        name: login,
        avatarUrl: memberStats[login].avatarUrl,
        commits: memberStats[login].commits,
        contributionRate: (memberStats[login].commits / totalCommits) * 100,
      }));

      setMembers(membersArray.slice(0, 8));
      setLoading(false);
    });
  }, [selectedRepo]);

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>{" "}
          {/* Alineación al centro */}
          <TableHead className="text-center">Commits</TableHead>{" "}
          {/* Alineación al centro */}
          <TableHead className="text-right">Contribution rate</TableHead>{" "}
          {/* Alineación al centro */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={member.avatarUrl} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>{member.name}</span>
            </TableCell>
            <TableCell className="text-center">{member.commits} Commit</TableCell>
            <TableCell className="text-right">
              {member.contributionRate.toFixed(2)}% (Work on this repo)
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
