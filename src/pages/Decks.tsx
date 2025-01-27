import { useState, useCallback, useEffect } from "react";

import { useDeckStore } from "@/store/deck";
import { BiPlus, BiTrash, BiEdit, BiPlay, BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router";
import { root } from "@/routes";

export default function Decks() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [deletingDeck, setDeletingDeck] = useState<string | null>(null);

  const { deckNames, loadDecks, deleteDeck } = useDeckStore();

  // 加载卡组列表
  useEffect(() => {
    loadDecks();
  }, [loadDecks]);

  const handlePlayDeck = useCallback(
    (deckName: string) => {
      if (!deckName) return;
      setIsLoading(true);
      try {
        navigate(root.game.$buildPath({ params: { room: deckName } }));
      } catch (error) {
        console.error("进入游戏失败", error);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  const handleEditDeck = useCallback(
    (deckName: string) => {
      if (!deckName) return;
      navigate(root.deck.edit.$buildPath({ params: { deckName } }));
    },
    [navigate],
  );

  const handleDeleteDeck = useCallback(
    (deckName: string) => {
      if (!deckName) return;
      deleteDeck(deckName);
      setDeletingDeck(null);
      navigate(root.deck.$buildPath({}));
    },
    [navigate, deleteDeck],
  );

  return (
    <>
      <title>卡组管理</title>

      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-2 sm:mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm sm:btn-md p-1 sm:p-3"
          >
            <BiArrowBack className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-xl font-bold">卡组管理</h1>
            <p className="text-xs sm:text-sm text-base-content/70">
              创建、编辑或选择卡组
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-auto glass-panel border border-base-300 rounded-lg p-1.5 sm:p-4">
          {deckNames.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-2 sm:space-y-4 text-base-content/70">
              <span className="text-sm sm:text-lg">还没有创建任何卡组</span>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    root.deck.edit.$buildPath({
                      params: { deckName: "新卡组" },
                    }),
                  )
                }
                className="btn btn-primary btn-xs sm:btn-sm gap-1 sm:gap-2"
              >
                <BiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                创建第一个卡组
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-max gap-1.5 sm:gap-4 h-full">
              {deckNames.map((deck) => (
                <div
                  key={deck}
                  className="card bg-base-100/20 hover:bg-base-100/30 transition-all shadow-lg min-w-[160px] sm:min-w-[240px]"
                >
                  <div className="card-body p-2 sm:p-4">
                    <h3 className="card-title text-xs sm:text-base text-primary-content">
                      {deck}
                    </h3>
                    <div className="card-actions justify-end mt-1.5 sm:mt-4">
                      <button
                        type="button"
                        onClick={() => setDeletingDeck(deck)}
                        className="btn btn-xs sm:btn-sm btn-ghost text-error hover:bg-error/20"
                        title="删除卡组"
                      >
                        <BiTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditDeck(deck)}
                        className="btn btn-xs sm:btn-sm btn-ghost"
                        title="编辑卡组"
                      >
                        <BiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePlayDeck(deck)}
                        className="btn btn-xs sm:btn-sm btn-primary gap-0.5 sm:gap-1"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <>
                            <BiPlay className="w-3 h-3 sm:w-4 sm:h-4" />
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
      </div>

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
    </>
  );
}
