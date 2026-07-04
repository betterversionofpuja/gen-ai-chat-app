import { useState } from "react";
import { HiOutlinePlus, HiOutlineX } from "react-icons/hi";
import axiosInstance from "../config/axios";
import { useNavigate } from "react-router-dom";


const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateProject = async () => {
        
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/register");
            return;
        }

        if (!projectName.trim()) return;

        setLoading(true);

        try {
            const response = await axiosInstance.post("/projects/create", {
                name: projectName,
            });

            console.log(response.data);

            setProjectName("");
            setIsModalOpen(false);
        } catch (error) {
            console.log(error.response.data);

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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4">
            {/* Background Glow */}
            <div className="absolute bottom-[-180px] h-[420px] w-[700px] rounded-full bg-blue-600/20 blur-[170px]" />

            {/* Main Card */}
            <div className="relative w-full max-w-xl rounded-[30px] border border-blue-500/20 bg-[#121212]/95 p-10 shadow-[0_0_60px_rgba(37,99,235,0.15)] backdrop-blur-xl">
                <h1 className="text-center text-5xl font-extralight text-white">
                    Projects
                </h1>

                <p className="mt-3 text-center text-gray-400">
                    Create your first AI project.
                </p>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-12 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-blue-600 text-lg font-medium text-white transition hover:bg-blue-700"
                >
                    <HiOutlinePlus className="text-2xl" />
                    Create Project
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <>
                    {/* Overlay */}
                    <div
                        onClick={() => setIsModalOpen(false)}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal */}
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