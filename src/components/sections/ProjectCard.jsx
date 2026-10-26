import React from "react";

const ProjectCard = ({ name, image, description, link }) => {
  return (
    <div className="w-full sm:w-[360px] bg-[#090d1f]/90 border border-cyan-500/25 hover:border-cyan-400/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-xl">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img
          src={image}
          alt={name}
          className="w-full h-56 object-cover object-top"
        />
        <div className="p-5">
          <h3 className="text-white text-xl font-bold mb-2">{name}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
        </div>
      </a>
    </div>
  );
};

export default ProjectCard;
