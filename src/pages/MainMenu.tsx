import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AppTitle } from "@/components/ui/AppTitle";
import { Card } from "@/components/ui/Card";
import { TabButton } from "@/components/ui/TabButton";
import { Background } from "@/components/ui/Background";

interface DeckForm {
  deck: string;
}

export default function MainMenu() {
  const [activeTab, setActiveTab] = useState<"select" | "edit">("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<DeckForm>({
    defaultValues: {
      deck: "",
    },
  });

  const onSubmit = async (data: DeckForm) => {
    setIsSubmitting(true);
    try {
      if (activeTab === "select") {
        // 处理选择卡组逻辑
        navigate(`/game/${data.deck}`);
      } else {
        // 处理编辑卡组逻辑
        navigate(`/deck-editor/${data.deck}`);
      }
    } catch (error) {
      setError("deck", { message: "操作失败，请重试" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab: "select" | "edit") => {
    setActiveTab(tab);
    reset();
  };

  return (
    <Background className="flex flex-col items-center justify-center p-2 sm:p-4">
      <AppTitle title="Project Faith" subtitle="卡牌对战游戏" />
      <Card className="max-w-md landscape:max-w-[460px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4"
        >
          <div className="tabs tabs-boxed bg-base-200/70 mb-2 sm:mb-4 gap-1 sm:gap-2 flex">
            <TabButton
              active={activeTab === "select"}
              label="选择卡组"
              onClick={() => handleTabChange("select")}
            />
            <TabButton
              active={activeTab === "edit"}
              label="编辑卡组"
              onClick={() => handleTabChange("edit")}
            />
          </div>

          <div className="form-control">
            <input
              type="text"
              placeholder={
                activeTab === "select" ? "输入卡组名称" : "创建或选择卡组"
              }
              className="input input-bordered w-full bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-200 h-9 sm:h-10 md:h-12 min-h-0 text-sm sm:text-base"
              {...register("deck", { required: "请输入卡组名称" })}
              aria-invalid={errors.deck ? "true" : "false"}
              aria-describedby={errors.deck ? "deck-error" : undefined}
            />
            {errors.deck && (
              <div
                id="deck-error"
                className="text-error text-xs sm:text-sm mt-0.5"
                role="alert"
              >
                {errors.deck.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full h-9 sm:h-10 md:h-12 min-h-0 text-sm sm:text-base md:text-lg hover:brightness-110 transition-all duration-200 shadow-lg disabled:bg-gray-600/40 disabled:border-gray-500"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner" />
            ) : activeTab === "select" ? (
              "进入游戏"
            ) : (
              "进入编辑器"
            )}
          </button>
        </form>
      </Card>
    </Background>
  );
}
