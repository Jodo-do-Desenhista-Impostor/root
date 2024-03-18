import { LifeCycles, registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();

registerApplication({
  name: "systudo-home-frontend",
  app: async () => (await System.import("//localhost:4200/main.js")).default,
  activeWhen: (location) => location.pathname.startsWith("/home"),
});

registerApplication({
  name: "systudo-sidenav-frontend",
  app: async () => (await System.import("//localhost:4201/main.js")).default,
  activeWhen: (location) => location.pathname.startsWith("/sidenav"),
});

start();
