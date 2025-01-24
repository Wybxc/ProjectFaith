import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { jwtDecode } from "jwt-decode";
import typia from "typia";
import type { Claims } from "../server/bindings/types";

export const tokenAtom = atomWithStorage<string | null>(
  "auth_token",
  null,
  createJSONStorage(),
  { getOnInit: true },
);
export const sessionAtom = atom((get) => {
  const token = get(tokenAtom);
  if (!token) return null;

  const claims = typia.assert<Claims>(jwtDecode(token));

  return claims;
});
