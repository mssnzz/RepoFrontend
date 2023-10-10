import { RepoInfo } from "@/app/page";
import { fetchRepoData } from "@/services/api";
import React, { useEffect, useState } from "react";
import { HeatMapGrid } from "react-grid-heatmap";

const yLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CommitAuthor {
  avatar_url: string;
  login: string;
}

interface Committer {
  date: string;
}

interface CommitData {
  author: CommitAuthor;
  message: string;
  committer: Committer;
}

interface FullCommit {
  commit: CommitData;
  author: CommitAuthor;
}

interface DialogData {
  day: number;
  weekday: string;
  commits: FullCommit[];
}

function CommitDialog({ data, onClose }: { data: DialogData; onClose: () => void }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md w-2/3">
        <h2 className="text-xl mb-2">{`Contributions on ${data.weekday}, Day ${data.day}`}</h2>
        <ul>
          {data.commits.map((commit, index) => (
            <li key={index}>
              {commit.author.login}: {commit.commit.message}
            </li>
          ))}
        </ul>
        <button className="mt-4" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export function HeatmapChart({ selectedRepo }: { selectedRepo: RepoInfo }) {
  const [commitsData, setCommitsData] = useState<number[][]>([]);
  const [allCommits, setAllCommits] = useState<FullCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogData, setDialogData] = useState<DialogData | null>(null);

  useEffect(() => {
    fetchRepoData(selectedRepo.owner, selectedRepo.repo).then((data) => {
      const commits = data.commits;
      const dataMatrix = processCommitsData(commits);
      setCommitsData(dataMatrix);
      setAllCommits(commits);
      setLoading(false);
    });
  }, [selectedRepo]);

  const processCommitsData = (commits: FullCommit[]) => {
    let matrix = new Array(7).fill(0).map(() => new Array(29).fill(0));

    commits.forEach(commit => {
      const date = new Date(commit.commit.committer.date);
      const dayOfWeek = date.getUTCDay();
      const dayOfMonth = date.getUTCDate() - 1;

      matrix[dayOfWeek][dayOfMonth]++;
    });

    return matrix;
  };

  const openCommitDialog = (x: number, y: number) => {


    const dayCommits = allCommits.filter(commit => {
      const date = new Date(commit.commit.committer.date);
      return date.getUTCDay() === y && date.getUTCDate() - 1 === x;
    });


    setDialogData({
      day: x + 1,
      weekday: yLabels[y],
      commits: dayCommits,
    });

  };

  const closeCommitDialog = () => {
    setDialogData(null);
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div style={{ width: "100%", fontFamily: "sans-serif" }}>
      <HeatMapGrid
        data={commitsData}
        xLabels={new Array(29).fill(0).map((_, i) => `${i + 1}`)}
        yLabels={yLabels}
        cellRender={(x, y, value) => {
          if (value > 0) {
            return (
              <div
                title={`Day(${x + 1}), ${yLabels[y]} = ${value}`}
                onClick={() => openCommitDialog(x, y)}
              ></div>
            );
          }
          return <div></div>;
        }}
        xLabelsStyle={(index) => ({
          color: index % 2 ? "transparent" : "#777",
          fontSize: ".65rem",
        })}
        yLabelsStyle={() => ({
          fontSize: ".65rem",
          textTransform: "uppercase",
          color: "#777",
        })}
        cellStyle={(_x, _y, ratio) => ({
          background: `rgb(12, 160, 44, ${ratio})`,
          fontSize: ".7rem",
          color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
        })}
        cellHeight="1.5rem"
        xLabelsPos="bottom"
      />
      {dialogData && <CommitDialog data={dialogData} onClose={closeCommitDialog} />}
    </div>
  );
}
