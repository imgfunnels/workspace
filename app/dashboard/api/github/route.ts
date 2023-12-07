import { Octokit } from "@octokit/rest";

export async function POST(request: Request) {
  const { accessToken } = await request.json();
  try {
    console.log("BODY", { accessToken });
    const octokit = new Octokit({ auth: accessToken });

    const branches = (await octokit.rest.repos.listBranches({
      owner: "imgfunnels",
      repo: "admin-tristarpt-com"
    })) as any[any];

    let branchCommits: any[] = [];
    let commits: any[] = [];

    for await (const branch of branches.data) {
      const _commits = await octokit.rest.repos.listCommits({
        owner: "imgfunnels",
        repo: "admin-tristarpt-com",
        sha: branch.commit.sha,
        per_page: 100
      });

      branchCommits.push({
        branch: branch.name,
        data: _commits.data
      }) as any[any];

      commits.push(..._commits.data) as any[any];
      console.log(_commits?.data?.[0].commit?.author?.date);
    }

    commits = Array.from(new Set(commits.map(JSON.stringify as any)))
      .map(JSON.parse as any)
      .sort((a: any, b: any) =>
        b.commit.author.date.localeCompare(a.commit.author.date)
      );

    let commit = await octokit.rest.repos.getCommit({
      owner: "imgfunnels",
      repo: "admin-tristarpt-com",
      ref: "d40c6b475d685a57b5de7e45cbd26e66d09c08ad" // Merge
      // ref: "d821f5885e521386901498a4cf372e17794a79dd" // Tag
      // ref: "c125eded10aca0417b2d8e0be704e6ca6ec6871b" // Unknown
    });

    let data = {
      success: true,
      branches: branches.data,
      branchCommits,
      commits,
      commit
      // org,
      // orgs,
      // commitHistory,
      // tree,
      // events,
      // pulls,
      // merges
      // content
    };
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json"
      }
    });
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 200,
        headers: {
          "content-type": "application/json"
        }
      }
    );
  }
}

// const org = await octokit.rest.orgs.get({ org: "imgfunnels" });
// const orgs = await octokit.rest.orgs.list({ per_page: 100 });
// const forks = await octokit.repos.listForks({
//   owner: "imgfunnels",
//   repo: "admin-tristarpt-com"
// });
// const events = await octokit.rest.activity.listRepoEvents({
//   owner: "imgfunnels",
//   repo: "admin-tristarpt-com",
//   per_page: 100
// });

// let commitHistory = commits.sort((a, b) =>
//   b.commit.author.date.localeCompare(a.commit.author.date)
// );

// let tree = await octokit.request(
//   "https://api.github.com/repos/imgfunnels/admin-tristarpt-com/git/trees/98cb1ce750b250fc9f484d321ec220f47fb48b2c"
// );

// let pulls = await octokit.request(
//   "GET /repos/imgfunnels/admin-tristarpt-com/pulls?state=all",
//   {
//     owner: "imgfunnels",
//     repo: "admin-tristarpt-com",
//     headers: {
//       "X-GitHub-Api-Version": "2022-11-28"
//     }
//   }
// );

// let merges = await octokit.search.commits({
//   q: "repo:imgfunnels/admin-tristarpt-com"
// });
