// File Name: githubSync.js
const GITHUB_USERNAME = "himanvic";
const CACHE_KEY = "himanvic_github_repos_v3";
const CACHE_EXPIRY_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 6000;

const REPO_IMAGES = Object.freeze({
  "mausam-india": "/assets/images/projects/mausam-india.webp",
  "naradnow": "/assets/images/projects/naradnow.webp",
  "rail-route": "/assets/images/projects/rail-route.webp",
  "rail-route-website": "/assets/images/projects/rail-route.webp",
  "bottelneck.sys": "/assets/images/projects/bottelneck.webp",
  "bottelneck": "/assets/images/projects/bottelneck.webp",
  "sanskode": "/assets/images/projects/sanskode.webp",
  "quantum-gravity-shift": "/assets/images/projects/quantum-gravity-shift.png",
});

const isValidHttpsUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const sanitizeSafeText = (str, maxLen = 300) => {
  if (!str || typeof str !== "string") return "";
  return str
    .slice(0, maxLen)
    .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, "")
    .trim();
};

const hasForbiddenKeys = (obj) =>
  !obj ||
  typeof obj !== "object" ||
  Object.prototype.hasOwnProperty.call(obj, "__proto__") ||
  Object.prototype.hasOwnProperty.call(obj, "constructor");

const normalizeCachedRepo = (repo) => {
  if (hasForbiddenKeys(repo) || typeof repo.name !== "string") return null;
  return {
    id: typeof repo.id === "number" || typeof repo.id === "string" ? repo.id : repo.name,
    name: sanitizeSafeText(repo.name, 80),
    description: sanitizeSafeText(repo.description, 280),
    language: sanitizeSafeText(repo.language, 32),
    topics: Array.isArray(repo.topics)
      ? repo.topics.filter((t) => typeof t === "string").map((t) => sanitizeSafeText(t, 32))
      : [],
    homepage: isValidHttpsUrl(repo.homepage) ? repo.homepage.trim() : "",
    html_url: isValidHttpsUrl(repo.html_url)
      ? repo.html_url.trim()
      : `https://github.com/${GITHUB_USERNAME}/${encodeURIComponent(repo.name)}`,
    stargazers_count: Number.isFinite(repo.stargazers_count) ? repo.stargazers_count : 0,
    fork: Boolean(repo.fork),
    private: Boolean(repo.private),
  };
};

/**
 * Fetch public repositories from GitHub with strict schema validation,
 * abort timeout, and isolated localStorage cache.
 */
export async function fetchGitHubRepos() {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached && cached.length < 250_000) {
      try {
        const parsed = JSON.parse(cached);
        if (
          parsed &&
          !hasForbiddenKeys(parsed) &&
          typeof parsed.timestamp === "number" &&
          Date.now() - parsed.timestamp < CACHE_EXPIRY_MS &&
          Array.isArray(parsed.data)
        ) {
          return parsed.data.map(normalizeCachedRepo).filter(Boolean);
        }
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`,
        {
          headers: { Accept: "application/vnd.github.v3+json" },
          credentials: "omit",
          referrerPolicy: "no-referrer",
          signal: controller.signal,
        }
      );
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) return null;

    const repos = await response.json();
    if (!Array.isArray(repos)) return null;

    const filteredRepos = repos
      .map(normalizeCachedRepo)
      .filter(
        (repo) =>
          repo &&
          repo.name !== "himanvic-portfolio" &&
          repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase() &&
          !repo.fork &&
          !repo.private
      );

    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), data: filteredRepos })
      );
    } catch {
      // Storage quota or private mode error
    }

    return filteredRepos;
  } catch {
    return null;
  }
}

/**
 * Transforms a sanitized GitHub repository object into the portfolio card format
 */
export function formatRepoForCard(repo) {
  const safeName = sanitizeSafeText(repo?.name, 60);
  const language =
    sanitizeSafeText(repo?.language, 24) ||
    (repo?.topics?.includes("cpp")
      ? "C++"
      : repo?.topics?.includes("python")
      ? "Python"
      : "Code");

  const cleanNameLower = safeName.toLowerCase();

  const DEFAULT_DESCRIPTIONS = {
    "quantum-gravity-shift":
      "Interactive 2D orbital gravity & quantum physics simulation built with HTML5 Canvas and dynamic particle physics.",
  };

  const DEFAULT_TOPICS = {
    "quantum-gravity-shift": ["Physics Simulation", "HTML5 Canvas", "Orbital Gravity"],
  };

  const fallbackTopics = DEFAULT_TOPICS[cleanNameLower] || [];
  const rawTopics = [
    language,
    ...(repo?.topics || []).filter(
      (t) => t.toLowerCase() !== language.toLowerCase() && t !== "featured"
    ),
  ];

  const topics = (rawTopics.length > 1 ? rawTopics : [...rawTopics, ...fallbackTopics]).slice(0, 4);

  const localImage =
    REPO_IMAGES[safeName] ||
    REPO_IMAGES[cleanNameLower] ||
    REPO_IMAGES[cleanNameLower.replace(".sys", "")];

  const fallbackImage = `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${encodeURIComponent(safeName)}`;

  const safeLink = isValidHttpsUrl(repo?.homepage)
    ? repo.homepage.trim()
    : isValidHttpsUrl(repo?.html_url)
    ? repo.html_url.trim()
    : `https://github.com/${GITHUB_USERNAME}`;

  const rawDescription =
    repo?.description ||
    DEFAULT_DESCRIPTIONS[cleanNameLower] ||
    "Systems, algorithmic, and experimental software engineering repository on GitHub.";

  return {
    id: `gh-${repo.id}`,
    name: safeName,
    description: sanitizeSafeText(rawDescription, 280),
    tech: topics.length > 0 ? topics : [language, "GitHub"],
    link: safeLink,
    image: localImage || fallbackImage,
    stars: Number.isFinite(repo?.stargazers_count) ? repo.stargazers_count : 0,
    isFeatured: (repo?.topics || []).includes("featured"),
    language,
    accent: language === "C++" ? "#38bdf8" : language === "Python" ? "#facc15" : "#00f0ff",
    tag: (repo?.topics || []).includes("featured") ? "Featured Project" : `${language} Project`,
  };
}
