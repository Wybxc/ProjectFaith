import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { sessionAtom, tokenAtom } from "./auth";
import { AppTitle } from "./components/ui/AppTitle";
import { Card } from "./components/ui/Card";
import { TabButton } from "./components/ui/TabButton";
import { socketAtom } from "./socket";

interface RoomForm {
  room: string;
}

export default function MainMenu() {
  const socket = useAtomValue(socketAtom);
  const session = useAtomValue(sessionAtom);
  const setToken = useSetAtom(tokenAtom);
  const [activeTab, setActiveTab] = useState<"join" | "create">("join");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<RoomForm>({
    defaultValues: {
      room: "",
    },
  });

  if (!socket) return null;

  const onSubmit = async (data: RoomForm) => {
    if (!session?.sub) return;
    setIsSubmitting(true);

    try {
      const params =
        activeTab === "join"
          ? { username: session.sub, room: data.room }
          : { username: session.sub };

      await new Promise((resolve, reject) => {
        socket.emit(
          activeTab === "join" ? "joinRoom" : "createRoom",
          params,
          (response: { room: string }) => {
            if (response?.room) {
              navigate(`/${response.room}`);
              resolve(response);
            } else {
              reject(
                new Error(
                  activeTab === "join" ? "加入房间失败" : "创建房间失败",
                ),
              );
            }
          },
        );
      });
    } catch (err) {
      setError("room", {
        type: "manual",
        message: err instanceof Error ? err.message : "操作失败，请稍后重试",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab: "join" | "create") => {
    setActiveTab(tab);
    reset();
  };

  const handleLogout = () => {
    setToken("");
    navigate("/login");
  };

  if (!session) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 bg-[url('@static/bg.jpg')] bg-cover bg-center relative px-4">
      <div className="absolute inset-0 bg-black/60" />
      <AppTitle title="Project Faith" subtitle="在线多人游戏体验" />

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="tabs tabs-boxed bg-base-200/70 mb-6 gap-2 flex">
            <TabButton
              active={activeTab === "join"}
              label="加入房间"
              onClick={() => handleTabChange("join")}
            />
            <TabButton
              active={activeTab === "create"}
              label="创建房间"
              onClick={() => handleTabChange("create")}
            />
          </div>

          <div className="text-white text-center bg-white/10 py-3 rounded-lg flex justify-between items-center px-4">
            <span>当前用户：{session.sub}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-red-300 hover:text-red-400"
            >
              登出
            </button>
          </div>

          {activeTab === "join" && (
            <div className="form-control">
              <input
                type="text"
                placeholder="房间号"
                className="input input-bordered w-full bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-200 h-12"
                {...register("room", {
                  required: "请输入房间号",
                })}
                aria-invalid={errors.room ? "true" : "false"}
                aria-describedby={errors.room ? "room-error" : undefined}
              />
              {errors.room && (
                <div
                  id="room-error"
                  className="text-error text-sm mt-1"
                  role="alert"
                >
                  {errors.room.message}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full hover:brightness-110 transition-all duration-200 shadow-lg disabled:bg-gray-600/40 disabled:border-gray-500 disabled:cursor-not-allowed h-12 text-lg"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner" />
            ) : activeTab === "join" ? (
              "加入房间"
            ) : (
              "创建房间"
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}
