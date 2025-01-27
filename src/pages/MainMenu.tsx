import { Card } from "@/components/ui/Card";
import { root } from "@/routes";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

export default function MainMenu() {
  return (
    <>
      <title>信念计划</title>
      <div className="m-3 text-center">
        <h1
          className={cn(
            "text-lg font-bold",
            "mb-0.5 sm:mb-2 md:mb-3",
            "text-transparent text-white",
            "tracking-wide drop-shadow-lg",
          )}
        >
          信念计划
        </h1>
        <p
          className={cn(
            "text-2xs sm:text-sm md:text-lg",
            "text-gray-200/90 drop-shadow",
            "font-medium tracking-wide",
          )}
        >
          卡牌对战游戏
        </p>
        )
      </div>
      <Card>
        <div className="flex flex-col gap-3">
          <Link
            to={root.deck.$buildPath({})}
            className="btn btn-primary w-full border-primary/50 bg-primary/90 text-primary-content
              shadow-lg shadow-primary/20 backdrop-blur hover:border-primary hover:bg-primary
              hover:shadow-primary/40"
          >
            开始游戏
          </Link>
          <button
            type="button"
            className="btn glass w-full border-base-content/20 bg-base-100/20 text-base-content
              hover:border-base-content/30 hover:bg-base-100/30 hover:text-base-content/90"
          >
            游戏说明
          </button>
          <button
            type="button"
            className="btn glass w-full border-base-content/20 bg-base-100/20 text-base-content
              hover:border-base-content/30 hover:bg-base-100/30 hover:text-base-content/90"
          >
            设置
          </button>
        </div>
      </Card>
    </>
  );
}
