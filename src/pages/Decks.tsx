import { useState, useMemo, useCallback } from "react";
import { AppTitle } from "@/components/ui/AppTitle";
import { Card } from "@/components/ui/Card";
import { Background } from "@/components/ui/Background";
import { Router } from "@/routes";
import { BiPlus, BiTrash, BiEdit, BiPlay } from "react-icons/bi";

// 获取所有卡组名称
const getDeckList = () => {
  const decks: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("deck:")) {
      decks.push(key.slice(5));
    }
  }
  return decks;
};

export default function Decks() {
  const [isLoading, setIsLoading] = useState(false);
  const [deletingDeck, setDeletingDeck] = useState<string | null>(null);
  const deckList = useMemo(() => getDeckList(), []);

  const handlePlayDeck = useCallback((deckName: string) => {
    if (!deckName) return;
    setIsLoading(true);
    try {
      Router.push("Game", { room: deckName });
    } catch (error) {
      console.error("进入游戏失败", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEditDeck = useCallback((deckName: string) => {
    Router.push("DeckEditor", { deckName });
  }, []);

  const handleDeleteDeck = useCallback((deckName: string) => {
    if (!deckName) return;
    localStorage.removeItem(`deck:${deckName}`);
    setDeletingDeck(null);
    // 强制重新渲染列表
    Router.replace("Decks");
  }, []);

  return (
    <Background className="h-screen">
      <title>卡组管理</title>
      <Card>
        <div className="flex flex-col h-full max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <AppTitle title="卡组管理" subtitle="创建、编辑或选择卡组" />
            <button
              type="button"
              onClick={() => Router.push("DeckEditor", { deckName: "" })}
              className="btn btn-primary gap-2"
            >
              <BiPlus className="w-5 h-5" />
              新建卡组
            </button>
          </div>

          <div className="flex-1 overflow-auto glass-panel border border-base-300 rounded-lg p-4">
            {deckList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-base-content/70">
                <span className="text-lg">还没有创建任何卡组</span>
                <button
                  type="button"
                  onClick={() => Router.push("DeckEditor", { deckName: "" })}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <BiPlus className="w-4 h-4" />
                  创建第一个卡组
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {deckList.map((deck) => (
                  <div
                    key={deck}
                    className="card bg-base-100/20 hover:bg-base-100/30 transition-all shadow-lg"
                  >
                    <div className="card-body">
                      <h3 className="card-title text-primary-content">
                        {deck}
                      </h3>
                      <div className="card-actions justify-end mt-4">
                        <button
                          type="button"
                          onClick={() => setDeletingDeck(deck)}
                          className="btn btn-sm btn-ghost text-error hover:bg-error/20"
                          title="删除卡组"
                        >
                          <BiTrash className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditDeck(deck)}
                          className="btn btn-sm btn-ghost"
                          title="编辑卡组"
                        >
                          <BiEdit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePlayDeck(deck)}
                          className="btn btn-sm btn-primary gap-1"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            <>
                              <BiPlay className="w-4 h-4" />
                              开始
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => Router.push("MainMenu")}
              className="btn w-full glass bg-base-100/20 text-base-content"
            >
              返回主菜单
            </button>
          </div>
        </div>
      </Card>

      {deletingDeck && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">删除卡组</h3>
            <p className="py-4">
              确定要删除卡组 "{deletingDeck}" 吗？此操作无法撤销。
            </p>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setDeletingDeck(null)}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={() => handleDeleteDeck(deletingDeck)}
              >
                删除
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setDeletingDeck(null)}
            onKeyDown={(e) => e.key === "Escape" && setDeletingDeck(null)}
            role="button"
            tabIndex={0}
          />
        </div>
      )}
    </Background>
  );
}
