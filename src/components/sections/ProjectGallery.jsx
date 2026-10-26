// File Name: ProjectGallery.jsx
import React, { useState, useEffect } from "react";
import { PROJECT_GALLERY } from "@/constants/projectGalleryData";
import ProjectGalleryCard from "../sub/ProjectGalleryCard";
import { fetchGitHubRepos, formatRepoForCard } from "@/utils/githubSync";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaGithub } from "react-icons/fa";

const ProjectGallery = () => {
  const [galleryData, setGalleryData] = useState(PROJECT_GALLERY);
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function syncRepos() {
      const repos = await fetchGitHubRepos();
      if (!repos || !Array.isArray(repos) || !isMounted) return;

      // Extract existing repo names from baseline to prevent duplicates
      const baselineExperiments = PROJECT_GALLERY["Open Source & Systems Experiments"] || [];
      const existingNames = new Set(
        baselineExperiments.map((p) => p.name.toLowerCase().replace(".sys", ""))
      );

      // Known featured web apps to avoid duplicate listing in experiments
      const featuredNames = new Set(
        (PROJECT_GALLERY["Featured Web Applications"] || []).map((p) =>
          p.name.toLowerCase().replace(/\s+/g, "-")
        )
      );

      // Find any newly published repositories on GitHub
      const newExperiments = [];
      for (const repo of repos) {
        const cleanName = repo.name.toLowerCase().replace(".sys", "");
        if (!existingNames.has(cleanName) && !featuredNames.has(cleanName)) {
          newExperiments.push(formatRepoForCard(repo));
        }
      }

      if (newExperiments.length > 0 && isMounted) {
        setGalleryData({
          ...PROJECT_GALLERY,
          "Open Source & Systems Experiments": [
            ...baselineExperiments,
            ...newExperiments,
          ],
        });
        setIsLiveSynced(true);
      }
    }

    syncRepos();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="project-gallery"
      className="w-full min-h-screen py-24 sm:py-32 px-4 sm:px-8 md:px-16 lg:px-24 text-white relative z-10"
    >
      {/* Top Navigation & Breadcrumbs */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-950/40 text-gray-300 hover:text-white transition-all text-xs sm:text-sm font-medium backdrop-blur-md shadow-sm group cursor-pointer"
        >
          <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-2">
          {isLiveSynced && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Synced</span>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>All Creations &amp; Experiments</span>
          </div>
        </div>
      </div>

      {/* Main Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 text-transparent bg-clip-text pb-2 tracking-tight">
          Project Archive
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
          A comprehensive showcase of live web applications, C++ systems experiments, and Python algorithmic explorations.
        </p>
      </div>

      {/* Gallery Sections */}
      <div className="max-w-6xl mx-auto space-y-20">
        {Object.entries(galleryData).map(([category, data]) => (
          <div key={category} className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                {category}
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-8">
              {data.map((project) => (
                <ProjectGalleryCard key={project.id} {...project} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectGallery;
