
import { Router } from "expo-router";

let _router: Router | null = null;

export const setGlobalRouter = (routerInstance: Router) => {
  _router = routerInstance;
};

export const navigate = (path: string) => {
  if (!_router) throw new Error("Router not set");
  _router.navigate(path as any);
};
