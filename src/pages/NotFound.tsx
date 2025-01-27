import { Card } from "@/components/ui/Card";
import { root } from "@/routes";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <>
      <title>404 - 页面不存在</title>
      <Card className="animate-fade-in w-full max-w-md">
        <div className="space-y-4 text-center">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <div className="space-y-2">
            <p className="text-xl font-bold text-white">啊哦，页面不见了</p>
            <p className="text-sm text-gray-300">
              看起来你访问的页面已经离开了这个世界
            </p>
          </div>
          <Link to={root.$buildPath({})} className="btn-game">
            返回主页
          </Link>
        </div>
      </Card>
    </>
  );
}
