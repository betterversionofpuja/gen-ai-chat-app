import { useEffect, useState } from "react";
import { HiOutlinePlus, HiOutlineX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import ProjectCard from "../components/ProjectCard";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setFetchingProjects(true);

      const response = await axiosInstance.get("/projects/all");

      setProjects(response.data.projects);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingProjects(false);
    }
  };

  const handleCreateProject = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/register");
      return;
    }

    if (!projectName.trim()) return;

    setLoading(true);

    try {
      await axiosInstance.post("/projects/create", {
        name: projectName,
      });

      await fetchProjects();

      setProjectName("");
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-6 py-10">
      {/* Background Glow */}
      <div className="absolute bottom-[-180px] left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[170px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-5xl font-extralight text-white">
              Projects
            </h1>

            <p className="mt-2 text-gray-400">
              Create and manage all your projects with AI assistance.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            <HiOutlinePlus className="text-xl" />
            Create Project
          </button>
        </div>

        {/* Projects */}
        {fetchingProjects ? (
          <div className="py-20 text-center text-gray-400">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-700 py-24 text-center text-gray-500">
            No projects yet.
            <br />
            Create your first project.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-blue-500/20 bg-[#151515] p-8 shadow-[0_0_60px_rgba(37,99,235,0.2)]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-gray-400 transition hover:text-white"
            >
              <HiOutlineX size={24} />
            </button>

            <h2 className="text-3xl font-light text-white">
              Create Project
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Give your project a meaningful name.
            </p>

            <input
              type="text"
              placeholder="e.g. AI Code Reviewer"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-8 h-12 w-full rounded-xl border border-gray-700 bg-[#202020] px-4 text-white outline-none transition focus:border-blue-500"
            />

            <button
              onClick={handleCreateProject}
              disabled={loading}
              className="mt-8 h-12 w-full rounded-xl bg-blue-600 text-lg font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;