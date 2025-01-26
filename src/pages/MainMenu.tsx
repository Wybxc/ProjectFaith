import { Card } from "@/components/ui/Card";
import { root } from "@/routes";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

export default function MainMenu() {
  return (
    <>
      <title>信念计划</title>
      <div className="text-center m-3">
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
            "tracking-wide font-medium",
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
            className="btn btn-primary bg-primary/90 backdrop-blur text-primary-content shadow-lg shadow-primary/20 border-primary/50 hover:bg-primary hover:border-primary hover:shadow-primary/40 w-full"
          >
            开始游戏
          </Link>
          <button
            type="button"
            className="btn glass bg-base-100/20 text-base-content border-base-content/20 hover:bg-base-100/30 hover:border-base-content/30 hover:text-base-content/90 w-full"
          >
            游戏说明
          </button>
          <button
            type="button"
            className="btn glass bg-base-100/20 text-base-content border-base-content/20 hover:bg-base-100/30 hover:border-base-content/30 hover:text-base-content/90 w-full"
          >
            设置
          </button>
        </div>
      </Card>
    </>
  );
}
