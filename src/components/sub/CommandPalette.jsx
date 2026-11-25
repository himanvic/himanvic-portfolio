// File Name: CommandPalette.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaTerminal,
  FaTimes,
  FaRocket,
  FaCode,
  FaCompass,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";
import { SiCplusplus, SiPython } from "react-icons/si";
import { PROJECTS } from "@/constants/projectsData";
import { PROJECT_GALLERY } from "@/constants/projectGalleryData";
import { playCyberBlip } from "@/utils/audio";

const SHELL_COMMANDS = [
  { cmd: "algo", desc: "Open interactive live algorithm visualizer" },
  { cmd: "warp", desc: "Engage 3D starfield hyperspace warp" },
  { cmd: "whoami", desc: "Display developer identity & core stack" },
  { cmd: "ls", desc: "List live applications & experiments" },
  { cmd: "c++", desc: "Display C++ systems profile snippet" },
  { cmd: "python", desc: "Display Python algorithmic profile snippet" },
  { cmd: "projects", desc: "Open full project archive (/projects)" },
  { cmd: "about", desc: "Scroll to About section" },
  { cmd: "skills", desc: "Scroll to Languages & Tools section" },
  { cmd: "journey", desc: "Scroll to Profile & Journey section" },
  { cmd: "github", desc: "Open GitHub profile" },
  { cmd: "clear", desc: "Clear terminal history" },
  { cmd: "exit", desc: "Close shell" },
];

const ALL_GALLERY_ITEMS = (() => {
  const seen = new Set();
  const items = [];
  [...PROJECTS, ...Object.values(PROJECT_GALLERY).flat()].forEach((p) => {
    const key = p.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      items.push(p);
    }
  });
  return items;
})();

const triggerHyperspaceWarp = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hyperspace-warp"));
  }
};

export const CommandPalette = ({ onOpenVisualizer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("palette"); // "palette" | "shell"
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Shell-specific state with real history & Tab autocomplete
  const [shellInput, setShellInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyCursor, setHistoryCursor] = useState(-1);
  const [logs, setLogs] = useState([
    { type: "system", text: "himanvic@linux:~/portfolio (zsh)" },
    { type: "system", text: "Type 'help' for commands, Tab to autocomplete, or switch to Search." },
  ]);

  const searchInputRef = useRef(null);
  const shellInputRef = useRef(null);
  const terminalEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Cross-route safe smooth section jump
  const navigateToSection = useCallback(
    (sectionId) => {
      setIsOpen(false);
      if (location.pathname === "/") {
        if (!sectionId) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          window.history.replaceState(null, "", "/");
          return;
        }
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.replaceState(null, "", `/#${sectionId}`);
        }
      } else {
        navigate(sectionId ? `/#${sectionId}` : "/");
      }
    },
    [location.pathname, navigate]
  );

  // Build unified command palette entries
  const paletteItems = useMemo(() => {
    const actions = [
      {
        id: "act-algo",
        group: "Interactive Tools",
        label: "Algorithm Visualizer",
        hint: "C++ & Python QuickSort / BubbleSort workbench",
        badge: "Tool",
        icon: FaCode,
        accent: "text-amber-300",
        run: () => {
          setIsOpen(false);
          onOpenVisualizer();
        },
      },
      {
        id: "act-warp",
        group: "Interactive Tools",
        label: "Engage Hyperspace Warp",
        hint: "Accelerate 3D background starfield to 3.5c",
        badge: "3D FX",
        icon: FaRocket,
        accent: "text-cyan-300",
        run: () => {
          setIsOpen(false);
          setTimeout(triggerHyperspaceWarp, 90);
        },
      },
      {
        id: "act-shell",
        group: "Interactive Tools",
        label: "Switch to Linux Shell Mode",
        hint: "Run terminal commands (c++, python, whoami, ls)",
        badge: ">_ zsh",
        icon: FaTerminal,
        accent: "text-emerald-300",
        run: () => {
          setMode("shell");
          setQuery("");
        },
      },
    ];

    const navigation = [
      { id: "nav-hero", label: "Top / Hero Solar System", hint: "Scroll to start", idTarget: "" },
      { id: "nav-about", label: "About Me", hint: "Identity, mission & core philosophy", idTarget: "about" },
      { id: "nav-skills", label: "Languages & Tools", hint: "C++, Python, Linux, Git, VS Code", idTarget: "skills" },
      { id: "nav-projects", label: "Featured Projects Orbit", hint: "3D interactive project carousel", idTarget: "projects" },
      { id: "nav-profile", label: "Profile & Journey", hint: "Interactive particle canvas", idTarget: "profile" },
    ].map((nav) => ({
      id: nav.id,
      group: "Navigation",
      label: nav.label,
      hint: nav.hint,
      badge: "Section",
      icon: FaCompass,
      accent: "text-sky-300",
      run: () => navigateToSection(nav.idTarget),
    }));

    navigation.push({
      id: "nav-archive",
      group: "Navigation",
      label: "All Projects & Experiments Archive",
      hint: "View full /projects gallery",
      badge: "Route",
      icon: FaCompass,
      accent: "text-cyan-300",
      run: () => {
        setIsOpen(false);
        navigate("/projects");
      },
    });

    const projectEntries = ALL_GALLERY_ITEMS.map((proj) => ({
      id: `proj-${proj.name}`,
      group: "Projects",
      label: proj.name,
      hint: proj.description,
      badge: proj.link?.includes("github.com") ? "GitHub" : "Live",
      icon: FaExternalLinkAlt,
      accent: "text-cyan-200",
      run: () => {
        setIsOpen(false);
        if (proj.link) window.open(proj.link, "_blank", "noopener,noreferrer");
      },
    }));

    const profiles = [
      {
        id: "soc-gh",
        group: "Profiles",
        label: "GitHub — @himanvic",
        hint: "Repositories & source code",
        badge: "External",
        icon: FaGithub,
        accent: "text-gray-200",
        run: () => {
          setIsOpen(false);
          window.open("https://github.com/himanvic", "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "prof-cpp",
        group: "Profiles",
        label: "Inspect C++ Profile in Shell",
        hint: "View C++20 systems struct",
        badge: "C++",
        icon: SiCplusplus,
        accent: "text-sky-400",
        run: () => {
          setMode("shell");
          executeShellCommand("c++");
        },
      },
      {
        id: "prof-py",
        group: "Profiles",
        label: "Inspect Python Profile in Shell",
        hint: "View Python algorithmic focus",
        badge: "Python",
        icon: SiPython,
        accent: "text-amber-300",
        run: () => {
          setMode("shell");
          executeShellCommand("python");
        },
      },
    ];

    return [...actions, ...navigation, ...projectEntries, ...profiles];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, navigateToSection, onOpenVisualizer]);

  const filteredItems = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return paletteItems;
    return paletteItems.filter(
      (item) =>
        item.label.toLowerCase().includes(clean) ||
        item.hint.toLowerCase().includes(clean) ||
        item.group.toLowerCase().includes(clean) ||
        item.badge.toLowerCase().includes(clean)
    );
  }, [paletteItems, query]);

  // Global keyboard shortcuts (Ctrl+K / Cmd+K, custom trigger event, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenEvent);
    };
  }, []);

  // Auto-focus active input on open or mode switch
  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => {
      if (mode === "palette") searchInputRef.current?.focus();
      else shellInputRef.current?.focus();
    }, 60);
  }, [isOpen, mode]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen && mode === "shell") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isOpen, mode]);

  const executeShellCommand = (rawCmd) => {
    const cleanRaw = String(rawCmd || "").slice(0, 80);
    const cmd = cleanRaw.trim().toLowerCase();
    if (!cmd) return;

    playCyberBlip(780, 0.035);
    setCmdHistory((prev) => (prev[0] === cleanRaw.trim() ? prev : [cleanRaw.trim(), ...prev.slice(0, 24)]));
    setHistoryCursor(-1);

    const newLogs = [...logs, { type: "user", text: `$ ${cleanRaw.trim()}` }];

    switch (cmd) {
      case "help":
        newLogs.push({
          type: "output",
          text: SHELL_COMMANDS.map((c) => `  ${c.cmd.padEnd(10)} ${c.desc}`).join("\n"),
        });
        break;

      case "whoami":
        newLogs.push({
          type: "output",
          text: "himanvic — Student Systems Developer | C++ & Python | Linux & VS Code",
        });
        break;

      case "ls":
        newLogs.push({
          type: "output",
          text: ALL_GALLERY_ITEMS.map((item) => `  ${item.name.toLowerCase().replace(/\s+/g, "-")}/`).join("\n"),
        });
        break;

      case "earth":
      case "globe":
      case "world":
        window.dispatchEvent(new CustomEvent("toggle-earth-core", { detail: { active: true } }));
        setIsOpen(false);
        navigateToSection("");
        return;

      case "sun":
      case "core":
      case "singularity":
        window.dispatchEvent(new CustomEvent("toggle-earth-core", { detail: { active: false } }));
        setIsOpen(false);
        navigateToSection("");
        return;

      case "warp":
      case "lightspeed":
        setIsOpen(false);
        setTimeout(triggerHyperspaceWarp, 90);
        return;

      case "algo":
      case "visualize":
      case "sort":
        onOpenVisualizer();
        setIsOpen(false);
        return;

      case "c++":
      case "cpp":
      case "cat profile.cpp":
        newLogs.push({
          type: "cyan",
          text: `struct Developer {
    std::string name = "Himanvic";
    std::vector<std::string> stack = {"C++20", "Memory Layouts", "Algorithms"};
    void mission() { std::cout << "Engineering under the hood." << std::endl; }
};`,
        });
        break;

      case "python":
      case "py":
      case "python algo.py":
        newLogs.push({
          type: "amber",
          text: `class Himanvic:
    skills = ["Python 3.12", "Data Structures", "Simulations", "Automation"]
    focus = "Algorithmic clarity and modular architecture."`,
        });
        break;

      case "projects":
        navigate("/projects");
        setIsOpen(false);
        return;

      case "about":
        navigateToSection("about");
        return;

      case "skills":
        navigateToSection("skills");
        return;

      case "journey":
        navigateToSection("profile");
        return;

      case "github":
        window.open("https://github.com/himanvic", "_blank", "noopener,noreferrer");
        newLogs.push({ type: "success", text: "Opening https://github.com/himanvic..." });
        break;

      case "clear":
        setLogs([]);
        setShellInput("");
        return;

      case "exit":
      case "close":
      case "quit":
        setIsOpen(false);
        setShellInput("");
        return;

      default:
        newLogs.push({
          type: "error",
          text: `zsh: command not found: ${cmd}. Try 'help' or switch to Search.`,
        });
    }

    setLogs(newLogs);
    setShellInput("");
  };

  const handlePaletteKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length ? (prev + 1) % filteredItems.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredItems.length ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim().startsWith(">")) {
        const inlineCmd = query.trim().slice(1);
        setMode("shell");
        setQuery("");
        executeShellCommand(inlineCmd);
        return;
      }
      const chosen = filteredItems[selectedIndex];
      if (chosen) {
        playCyberBlip(720, 0.03);
        chosen.run();
      }
    }
  };

  const handleShellKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHistory.length) return;
      const nextCursor = Math.min(historyCursor + 1, cmdHistory.length - 1);
      setHistoryCursor(nextCursor);
      setShellInput(cmdHistory[nextCursor]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyCursor <= 0) {
        setHistoryCursor(-1);
        setShellInput("");
      } else {
        const nextCursor = historyCursor - 1;
        setHistoryCursor(nextCursor);
        setShellInput(cmdHistory[nextCursor]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const prefix = shellInput.trim().toLowerCase();
      if (!prefix) return;
      const match = SHELL_COMMANDS.find((c) => c.cmd.startsWith(prefix));
      if (match) setShellInput(match.cmd);
    }
  };

  return (
    <>
      {/* Mobile-only Floating Command Palette Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Command Palette"
        className="md:hidden fixed bottom-5 right-5 z-40 w-11 h-11 rounded-full bg-[#080d1e]/90 hover:bg-cyan-950/80 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.35)] backdrop-blur-xl transition-all hover:scale-105 cursor-pointer"
        title="Command Palette"
      >
        <FaSearch className="text-sm" />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-black/75 backdrop-blur-xl animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#060a17]/95 border border-cyan-500/35 rounded-2xl shadow-[0_20px_90px_rgba(6,182,212,0.28)] overflow-hidden flex flex-col max-h-[78vh] cursor-default"
          >
            {/* Header Bar with Search <-> Linux Shell Mode Switcher */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/50 border-b border-cyan-500/20">
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setMode("palette")}
                  className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    mode === "palette"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold"
                      : "text-gray-400 hover:text-white border border-transparent"
                  }`}
                >
                  <FaSearch className="text-[10px]" />
                  <span>Command Search</span>
                </button>
                <button
                  onClick={() => setMode("shell")}
                  className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    mode === "shell"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-semibold"
                      : "text-gray-400 hover:text-white border border-transparent"
                  }`}
                >
                  <FaTerminal className="text-[10px]" />
                  <span>Shell</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono text-gray-500 hidden sm:inline">
                  {mode === "palette" ? "↑↓ Navigate • ↵ Run • ESC" : "Tab Complete • ↑↓ History • ESC"}
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close palette"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            </div>

            {mode === "palette" ? (
              <>
                {/* Fuzzy Search Bar */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#050814]">
                  <FaSearch className="text-cyan-400 text-sm shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handlePaletteKeyDown}
                    placeholder="Jump to project, section, Algorithm Visualizer, or '>' for shell..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="text-xs font-mono text-gray-400 hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filterable Action & Project List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#040813]">
                  {filteredItems.length === 0 ? (
                    <div className="py-10 text-center text-xs font-mono text-gray-500">
                      No matching commands. Prefix with <span className="text-cyan-400">&gt;</span> to run in shell.
                    </div>
                  ) : (
                    filteredItems.map((item, idx) => {
                      const Icon = item.icon;
                      const isSelected = idx === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => {
                            playCyberBlip(720, 0.03);
                            item.run();
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 text-left transition-colors cursor-pointer border ${
                            isSelected
                              ? "bg-cyan-950/50 border-cyan-500/40 text-white"
                              : "bg-transparent border-transparent text-gray-300 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2 rounded-lg bg-white/5 border border-white/10 shrink-0 ${item.accent}`}>
                              <Icon className="text-xs" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-medium truncate">
                                {item.label}
                              </div>
                              <div className="text-[11px] text-gray-400 truncate">
                                {item.hint}
                              </div>
                            </div>
                          </div>

                          <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400">
                            {item.badge}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Clean Linux Shell Logs */}
                <div className="flex-1 p-5 overflow-y-auto font-mono text-xs space-y-2 bg-[#040813] select-text min-h-[260px]">
                  {logs.map((log, i) => (
                    <div key={i} className="leading-relaxed">
                      {log.type === "user" && <span className="text-amber-400 font-bold">{log.text}</span>}
                      {log.type === "system" && <span className="text-gray-400">{log.text}</span>}
                      {log.type === "output" && (
                        <pre className="text-cyan-200 whitespace-pre-wrap">{log.text}</pre>
                      )}
                      {log.type === "cyan" && (
                        <pre className="text-sky-300 whitespace-pre-wrap bg-sky-950/30 p-2.5 rounded-xl border border-sky-500/20">
                          {log.text}
                        </pre>
                      )}
                      {log.type === "amber" && (
                        <pre className="text-amber-300 whitespace-pre-wrap bg-yellow-950/30 p-2.5 rounded-xl border border-yellow-500/20">
                          {log.text}
                        </pre>
                      )}
                      {log.type === "success" && <span className="text-emerald-400">{log.text}</span>}
                      {log.type === "error" && <span className="text-rose-400">{log.text}</span>}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>

                {/* Real Interactive Shell Prompt (Tab Autocomplete + ↑↓ History) */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeShellCommand(shellInput);
                  }}
                  className="flex items-center gap-2 px-5 py-3 border-t border-cyan-500/20 bg-black/60"
                >
                  <span className="font-mono text-emerald-400 text-xs font-bold select-none">
                    himanvic@linux:~$
                  </span>
                  <input
                    ref={shellInputRef}
                    type="text"
                    value={shellInput}
                    onChange={(e) => setShellInput(e.target.value)}
                    onKeyDown={handleShellKeyDown}
                    placeholder="type 'help', 'whoami', 'algo', 'warp'..."
                    className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-all cursor-pointer"
                  >
                    RUN
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CommandPalette;
