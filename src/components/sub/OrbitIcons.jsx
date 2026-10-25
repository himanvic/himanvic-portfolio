import {
  SiCplusplus,
  SiPython,
  SiGit,
  SiLinux,
  SiGithub,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

const icons = [
  { icon: <SiCplusplus className="text-blue-400" />, delay: "0s" },
  { icon: <SiPython className="text-yellow-400" />, delay: "0.1s" },
  { icon: <SiGit className="text-orange-500" />, delay: "0.2s" },
  { icon: <SiLinux className="text-yellow-200" />, delay: "0.3s" },
  { icon: <VscCode className="text-cyan-400" />, delay: "0.4s" },
  { icon: <SiGithub className="text-purple-300" />, delay: "0.5s" },
];

const OrbitIcons = () => {
  return (
    <div className="relative w-48 h-48">
      <div className="absolute w-full h-full animate-spin-slow">
        {icons.map((item, index) => {
          const angle = (360 / icons.length) * index;
          const transform = `rotate(${angle}deg) translate(7rem) rotate(-${angle}deg)`;
          return (
            <div
              key={index}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ transform }}
            >
              <div className="text-5xl">{item.icon}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrbitIcons;
