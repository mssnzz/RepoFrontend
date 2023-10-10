import { RepoInfo } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { fetchRepoData } from "@/services/api";
import { ClipLoader } from "react-spinners";
type RepoData = {
  commits: any[];
  repoInfo: {
    forks: number;
    watchers: number;
    open_issues: number;
    // ... otros campos según la respuesta de tu API
  };
};

interface CardsSectionProps {
  selectedRepo: RepoInfo;
}
export const CardsSection: React.FC<CardsSectionProps> = ({ selectedRepo }) => {
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchRepoData(selectedRepo.owner, selectedRepo.repo);
        setRepoData(data);
      } catch (error) {
        console.error("Error fetching repo data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRepo]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <ClipLoader color="#000" />
      </div>
    );
  }

  if (!repoData) {
    return null; // o puedes mostrar algún mensaje de error o placeholder.
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Commits</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 640 512"
            fill="darkgray"
            className=" text-muted-foreground"
          >
            <path d="M320 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm156.8-48C462 361 397.4 416 320 416s-142-55-156.8-128H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H163.2C178 151 242.6 96 320 96s142 55 156.8 128H608c17.7 0 32 14.3 32 32s-14.3 32-32 32H476.8z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{repoData.commits.length}</div>

        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Forks</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className=" text-muted-foreground"
            height="1em"
            viewBox="0 0 448 512"
            fill="darkgray"
          >
            <path d="M80 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm80-24c0 32.8-19.7 61-48 73.3V192c0 17.7 14.3 32 32 32H304c17.7 0 32-14.3 32-32V153.3C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V192c0 53-43 96-96 96H256v70.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V288H144c-53 0-96-43-96-96V153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm208 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM248 432a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {repoData.repoInfo.forks || 0}
          </div>

        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Watchers</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 576 512"
            fill="darkgray"
            className=" text-muted-foreground"
          >
            <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{repoData.repoInfo.watchers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            fill="darkgray"
            className=" text-muted-foreground"
          >
            <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {repoData.repoInfo.open_issues}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
