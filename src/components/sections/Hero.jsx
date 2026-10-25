import { StarsCanvas } from "../GlobalStarfield";
import OrbitIcons from "../sub/OrbitIcons";
import RotatingTitles from "../sub/RotatingTitles";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden px-4 pt-24 sm:pt-28"
    >
      {/* Blackhole video */}
      <video
        className="absolute top-[-300px] left-0 w-full h-full object-cover z-[-1] rotate-180 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] [clip-path:inset(5%_0_5%_0)]"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/assets/videos/blackhole.webm" type="video/webm" />
      </video>

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-20">
        {/* LEFT: TEXT */}
        <div className="flex-1 text-center lg:text-left px-2">
          <div className="inline-block px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-sm font-semibold">
            Student Developer &amp; Builder
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Turning{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
              Curiosity
            </span>{" "}
            into Code, <br />
            and Ideas into Experiences.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
            Student developer exploring C++ and Python, building creative projects, and learning through experimentation. Explore my work and creations.
          </p>

          <a
            href="#projects"
            className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-md font-medium hover:opacity-90 transition"
          >
            Explore Projects
          </a>
        </div>

        {/* RIGHT: Orbit Icons + Rotating Titles */}
        <div className="flex-1 flex flex-col items-center justify-center relative px-4">
          <OrbitIcons />

          {/* Titles under orbit icons */}
          <div className="mt-16">
            <RotatingTitles />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
