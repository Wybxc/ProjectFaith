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

      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-center gap-3 sm:mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm p-1 sm:btn-md sm:p-3"
          >
            <BiArrowBack className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-bold sm:text-xl">卡组管理</h1>
            <p className="text-xs text-base-content/70 sm:text-sm">
              创建、编辑或选择卡组
            </p>
          </div>
        </div>

        <div className="glass-panel flex-1 overflow-auto rounded-lg border border-base-300 p-1.5 sm:p-4">
          {deckNames.length === 0 ? (
            <div
              className="flex h-full flex-col items-center justify-center space-y-2 text-base-content/70
                sm:space-y-4"
            >
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
                className="btn btn-primary btn-xs gap-1 sm:btn-sm sm:gap-2"
              >
                <BiPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                创建第一个卡组
              </button>
            </div>
          ) : (
            <div
              className="grid h-full auto-rows-max grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-4
                md:grid-cols-3 lg:grid-cols-4"
            >
              {deckNames.map((deck) => (
                <div
                  key={deck}
                  className="card min-w-[160px] bg-base-100/20 shadow-lg transition-all hover:bg-base-100/30
                    sm:min-w-[240px]"
                >
                  <div className="card-body p-2 sm:p-4">
                    <h3 className="card-title text-xs text-primary-content sm:text-base">
                      {deck}
                    </h3>
                    <div className="card-actions mt-1.5 justify-end sm:mt-4">
                      <button
                        type="button"
                        onClick={() => setDeletingDeck(deck)}
                        className="btn btn-ghost btn-xs text-error sm:btn-sm hover:bg-error/20"
                        title="删除卡组"
                      >
                        <BiTrash className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditDeck(deck)}
                        className="btn btn-ghost btn-xs sm:btn-sm"
                        title="编辑卡组"
                      >
                        <BiEdit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePlayDeck(deck)}
                        className="btn btn-primary btn-xs gap-0.5 sm:btn-sm sm:gap-1"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <>
                            <BiPlay className="h-3 w-3 sm:h-4 sm:w-4" />
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
            <h3 className="text-lg font-bold">删除卡组</h3>
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
