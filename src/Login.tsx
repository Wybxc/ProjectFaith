import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Outlet, useNavigate } from "react-router";
import { tokenAtom } from "./auth";
import { AppTitle } from "./components/ui/AppTitle";
import { Card } from "./components/ui/Card";
import { TabButton } from "./components/ui/TabButton";

interface LoginForm {
  username: string;
  password: string;
  confirmPassword?: string;
}

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const setToken = useSetAtom(tokenAtom);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setError,
  } = useForm<LoginForm>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);

    try {
      if (activeTab === "register" && data.password !== data.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "两次输入的密码不一致",
        });
        return;
      }

      const response = await fetch(
        activeTab === "login" ? "/api/login" : "/api/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            user_id: data.username,
            password: data.password,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "用户名或密码错误"
            : response.status === 409
              ? "用户名已存在"
              : activeTab === "login"
                ? "登录失败，请稍后重试"
                : "注册失败，请稍后重试",
        );
      }

      const result = await response.json();
      setToken(result.token);
      navigate("/");
    } catch (err: unknown) {
      setError("username", {
        type: "manual",
        message: err instanceof Error ? err.message : "操作失败，请稍后重试",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
    reset();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 bg-[url('@static/bg.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/60" />
      <AppTitle title="Project Faith" subtitle="登录或注册以开始游戏" />

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="tabs tabs-boxed bg-base-200/70 mb-6">
            <TabButton
              active={activeTab === "login"}
              label="登录"
              onClick={() => handleTabChange("login")}
            />
            <TabButton
              active={activeTab === "register"}
              label="注册"
              onClick={() => handleTabChange("register")}
            />
          </div>

          <div className="form-control">
            <label htmlFor="username" className="label">
              <span className="label-text text-white">用户名</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="用户名"
              className="input input-bordered w-full bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-200"
              {...register("username", { required: "请输入用户名" })}
            />
            {errors.username && (
              <div className="label-text-alt text-error mt-1">
                {errors.username.message}
              </div>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="password" className="label">
              <span className="label-text text-white">密码</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="密码"
              className="input input-bordered w-full bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-200"
              {...register("password", { required: "请输入密码" })}
            />
            {errors.password && (
              <div className="label-text-alt text-error mt-1">
                {errors.password.message}
              </div>
            )}
          </div>

          {activeTab === "register" && (
            <div className="form-control">
              <label htmlFor="confirmPassword" className="label">
                <span className="label-text text-white">确认密码</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="确认密码"
                className="input input-bordered w-full bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-200"
                {...register("confirmPassword", {
                  required: "请确认密码",
                  validate: (value) =>
                    value === watch("password") || "两次输入的密码不一致",
                })}
              />
              {errors.confirmPassword && (
                <div className="label-text-alt text-error mt-1">
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full hover:brightness-110 transition-all duration-200 shadow-lg disabled:bg-gray-600/40 disabled:border-gray-500 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner" />
            ) : activeTab === "login" ? (
              "登录"
            ) : (
              "注册"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() =>
                handleTabChange(activeTab === "login" ? "register" : "login")
              }
              className="text-white hover:text-primary transition-colors"
            >
              {activeTab === "login"
                ? "还没有账号？点击注册"
                : "已有账号？点击登录"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export function SessionGuard() {
  const [token] = useAtom(tokenAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  return <Outlet />;
}
