// File Name: githubSync.js
const GITHUB_USERNAME = "himanvic";
const CACHE_KEY = "himanvic_github_repos_v2";
const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes cache

// Curated image mappings for known repositories
const REPO_IMAGES = {
  "mausam-india": "/assets/images/projects/mausam-india.png",
  "naradnow": "/assets/images/projects/naradnow.png",
  "rail-route": "/assets/images/projects/rail-route.png",
  "rail-route-website": "/assets/images/projects/rail-route.png",
  "bottelneck.sys": "/assets/images/projects/bottelneck.png",
  "bottelneck": "/assets/images/projects/bottelneck.png",
  "sanskode": "/assets/images/projects/sanskode.png",
};

/**
 * Fetch public repositories from GitHub with in-memory & localStorage caching
 */
export async function fetchGitHubRepos() {
  if (typeof window === "undefined") return null;

  try {
    // Check localStorage cache first to prevent rate-limiting
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS && Array.isArray(data)) {
          return data;
        }
      } catch (e) {
        // Cache read error, continue to fetch
      }
    }

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const repos = await response.json();
    if (!Array.isArray(repos)) return null;

    // Filter out the portfolio repository itself and forks
    const filteredRepos = repos.filter(
      (repo) =>
        repo.name !== "himanvic-portfolio" &&
        !repo.fork &&
        !repo.private
    );

    // Save to cache
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), data: filteredRepos })
      );
    } catch (e) {
      // Storage quota or private mode error
    }

    return filteredRepos;
  } catch (err) {
    return null;
  }
}

/**
 * Transforms a raw GitHub repository object into the portfolio card format
 */
export function formatRepoForCard(repo) {
  const language =
    repo.language ||
    (repo.topics?.includes("cpp")
      ? "C++"
      : repo.topics?.includes("python")
      ? "Python"
      : "Code");

  const topics = [
    language,
    ...(repo.topics || []).filter(
      (t) => t.toLowerCase() !== language.toLowerCase() && t !== "featured"
    ),
  ].slice(0, 4);

  const localImage =
    REPO_IMAGES[repo.name] ||
    REPO_IMAGES[repo.name.toLowerCase()] ||
    REPO_IMAGES[repo.name.replace(".sys", "")];

  // GitHub provides automatic dynamic open graph preview images for every public repo
  const fallbackImage = `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`;

  return {
    id: `gh-${repo.id}`,
    name: repo.name,
    description:
      repo.description ||
      "Systems, algorithmic, and experimental software engineering repository on GitHub.",
    tech: topics.length > 0 ? topics : [language, "GitHub"],
    link: repo.homepage || repo.html_url,
    image: localImage || fallbackImage,
    stars: repo.stargazers_count || 0,
    isFeatured: (repo.topics || []).includes("featured"),
    language,
    accent: language === "C++" ? "#38bdf8" : language === "Python" ? "#facc15" : "#00f0ff",
    tag: (repo.topics || []).includes("featured") ? "Featured Project" : `${language} Project`,
  };
}
