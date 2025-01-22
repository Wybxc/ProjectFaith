import { useState } from "react";
import { useNavigate } from "react-router";
import { socket } from "./socket.ts";
import { useLocalStorage } from "react-use";

export default function MainMenu() {
  const [username, setUsername] = useLocalStorage("project_faith_username", "");
  const [room, setRoom] = useState("");
  const [activeTab, setActiveTab] = useState("join");
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (username && room) {
      socket.emit("joinRoom", { username, room }, () => {
        navigate(`/${room}`);
      });
    }
  };

  const handleCreateRoom = () => {
    if (username) {
      socket.emit("createRoom", undefined, (response) => {
        navigate(`/${response.room}`);
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 bg-[url('@static/bg.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/60" />
      <div className="z-10 text-center mb-8">
        <h1 className="text-5xl font-bold mb-3 text-white tracking-wide drop-shadow-lg">
          Project Faith
        </h1>
        <p className="text-gray-200 text-lg drop-shadow">在线多人游戏体验</p>
      </div>
      <div className="card w-96 bg-white/20 backdrop-blur-md shadow-2xl z-10 border border-white/30">
        <div className="card-body">
          <div className="tabs tabs-boxed bg-base-200/70 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("join")}
              className={`tab flex-1 transition-all duration-200 ${
                activeTab === "join"
                  ? "tab-active bg-primary text-white shadow-md"
                  : "text-white"
              }`}
            >
              加入房间
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className={`tab flex-1 transition-all duration-200 ${
                activeTab === "create"
                  ? "tab-active bg-primary text-white shadow-md"
                  : "text-white"
              }`}
            >
              创建房间
            </button>
          </div>

          {activeTab === "join" ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-200"
              />
              <input
                type="text"
                placeholder="房间号"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="input input-bordered w-full bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-200"
              />
              <button
                type="button"
                onClick={handleJoinRoom}
                className="btn btn-primary w-full hover:brightness-110 transition-all duration-200 shadow-lg 
                disabled:bg-gray-600/40 disabled:border-gray-500 disabled:cursor-not-allowed 
                disabled:hover:brightness-100 disabled:shadow-none disabled:border-2 
                disabled:backdrop-blur-none disabled:hover:scale-100
                disabled:text-white disabled:font-medium disabled:drop-shadow"
                disabled={!username || !room}
              >
                {!username || !room ? "请填写完整信息" : "加入房间"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-200"
              />
              <button
                type="button"
                onClick={handleCreateRoom}
                className="btn btn-primary w-full hover:brightness-110 transition-all duration-200 shadow-lg 
                disabled:bg-gray-600/40 disabled:border-gray-500 disabled:cursor-not-allowed 
                disabled:hover:brightness-100 disabled:shadow-none disabled:border-2 
                disabled:backdrop-blur-none disabled:hover:scale-100
                disabled:text-white disabled:font-medium disabled:drop-shadow"
                disabled={!username}
              >
                {!username ? "请输入用户名" : "创建房间"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
