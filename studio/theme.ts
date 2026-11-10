import { buildLegacyTheme } from "sanity";
import { brand } from "./brand";

export const theme = buildLegacyTheme({
  "--black": brand.ink,
  "--white": brand.paper,
  "--gray": brand.ink3,
  "--gray-base": brand.ink3,
  "--component-bg": brand.paper,
  "--component-text-color": brand.ink,
  "--brand-primary": brand.coral,
  "--default-button-color": brand.ink3,
  "--default-button-primary-color": brand.coral,
  "--default-button-success-color": "#2f8f5b",
  "--default-button-warning-color": "#c98a00",
  "--default-button-danger-color": brand.coralDeep,
  "--state-info-color": brand.coral,
  "--state-success-color": "#2f8f5b",
  "--state-warning-color": "#c98a00",
  "--state-danger-color": brand.coralDeep,
  "--main-navigation-color": brand.ink,
  "--main-navigation-color--inverted": brand.paper,
  "--focus-color": brand.coral,
  "--font-family-base": brand.body,
});
