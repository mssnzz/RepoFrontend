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
import { Badge } from "../ui/badge";

interface CommitAuthor {
  avatar_url: string;
  login: string;
}

interface Committer {
  date: string;
}

interface CommitData {
  verification: any;
  author: CommitAuthor;
  message: string;
  committer: Committer;
}

interface FullCommit {
  commit: CommitData;
  author: CommitAuthor;
}

function CommitDialog({ commit, onClose }: { commit: FullCommit; onClose: () => void }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md w-2/3">
        <h2 className="text-xl mb-2">{commit.author.login}</h2>
        <p>{commit.commit.message}</p>
        <button className="mt-4" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export function CommitsList({ selectedRepo }: { selectedRepo: RepoInfo }) {
  const [commits, setCommits] = useState<FullCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommit, setSelectedCommit] = useState<FullCommit | null>(null);

  useEffect(() => {
    fetchRepoData(selectedRepo.owner, selectedRepo.repo).then((data) => {
      setCommits(data.commits.slice(0, 7));
      setLoading(false);
    });
  }, [selectedRepo]);

  const openCommitDialog = (commit: FullCommit) => {
    setSelectedCommit(commit);
  };

  const closeCommitDialog = () => {
    setSelectedCommit(null);
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <>
    <Table style={{ width: "100%", overflowX: "auto" }}>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Latest commit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {commits.map((commit, index) => (
          <TableRow key={index}>
            <TableCell
              className={`font-medium flex flex-col space-y-2`}
              style={{ wordBreak: "break-all" }}
              onClick={() => openCommitDialog(commit)}
            >
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={commit.author.avatar_url} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{commit.author.login}</span>
              </div>
              <div
                className="text-sm text-gray-600 commitMessage"
              >
                {commit.commit.message}
              </div>
              <div>
                {commit.commit.verification.verified ? (
                  <Badge className="success">Approved</Badge>
                ) : (
                  <Badge className="danger">Not Approved</Badge>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {selectedCommit && (
      <CommitDialog commit={selectedCommit} onClose={closeCommitDialog} />
    )}
  </>
  );
}


