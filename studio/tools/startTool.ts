import type { Tool } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";
import { StartPage } from "./StartPage";

export const startTool: Tool = {
  name: "start",
  title: "Start",
  icon: HomeIcon,
  component: StartPage,
};
