import { HiOutlineUserGroup } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/project/${project._id}`)}
      className="cursor-pointer rounded-3xl border border-blue-500/20 bg-[#121212] p-6 shadow-[0_0_30px_rgba(37,99,235,0.08)] transition hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(37,99,235,0.18)]"
    >
      <h2 className="truncate text-xl font-semibold text-white">
        {project.name}
      </h2>

      <div className="mt-5 flex items-center gap-2 text-gray-400">
        <HiOutlineUserGroup />
        <span>
          {project.users.length}{" "}
          {project.users.length === 1
            ? "Collaborator"
            : "Collaborators"}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;