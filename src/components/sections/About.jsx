import React from "react";

const About = () => {
  return (
    <section
      id="about"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 text-white z-10 flex flex-col items-center justify-center"
    >
      <div className="max-w-4xl w-full mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 mb-3 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium tracking-wide">
            GET TO KNOW ME
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
            About Me
          </h2>
        </div>

        {/* Content Card */}
        <div className="bg-[#121224]/80 border border-purple-500/20 rounded-2xl p-6 sm:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
            <p className="text-xl sm:text-2xl font-semibold text-white">
              Hey, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">himanvic</span> 👋
            </p>

            <p>
              I'm a student developer who enjoys turning ideas into digital experiences. I build and experiment with software projects, developer tools, and creative experiments, bringing ideas to life one project at a time.
            </p>

            <p>
              I'm currently focused on <span className="text-white font-medium">C++ and Python</span>, strengthening my programming fundamentals, problem solving, and software design.
            </p>

            <p>
              I believe in learning by building, improving through experimentation, and creating things that people can actually use.
            </p>

            {/* Quote Pill */}
            <div className="mt-8 pt-6 border-t border-purple-500/20 text-center sm:text-left">
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 font-semibold text-base sm:text-lg">
                "Curious by nature. Building by passion. Learning every day."
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
