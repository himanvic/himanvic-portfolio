import React from "react";

const ProjectCardGallery = ({ name, description, link, tech, image }) => {
  const isGithub = link && link.includes("github.com");

  return (
    <div className="bg-[#1c1c2b] rounded-xl shadow-md overflow-hidden w-[300px] sm:w-[340px] hover:scale-[1.03] transition-transform duration-300 border border-purple-500/20 flex flex-col justify-between">
      <div>
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover object-top"
        />

        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 text-white">{name}</h3>
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">{description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {tech?.map((item, i) => (
              <span
                key={i}
                className="text-xs bg-purple-800/30 px-2 py-1 rounded-full text-purple-300 border border-purple-500/20"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {link && (
        <div className="px-5 pb-5">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isGithub
                ? "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600/50"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {isGithub ? "View Code (GitHub)" : "View Live App"}
          </a>
        </div>
      )}
    </div>
  );
};

export default ProjectCardGallery;
