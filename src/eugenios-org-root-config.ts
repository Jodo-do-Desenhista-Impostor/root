import { LifeCycles, registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
import * as singleSpa from "single-spa"

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

window.addEventListener('single-spa:before-routing-event', evt => {
  // redireciona para login quando nao logado
  if(!window.localStorage.getItem("systudo-token") && window.location.pathname != '/login') {
    singleSpa.navigateToUrl('/login')
  }

  // redireciona para pagina nao encontrada
  const appNames = singleSpa.getAppNames();
  let app = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
  let index = 0
  appNames.forEach(name => {
    if (!(name.includes(app)))
      index++
  })
  if(index == appNames.length)
    singleSpa.navigateToUrl('/pagenotfound')
});

registerApplication({
  name: "systudo-home-frontend",
  app: async () => (await System.import("//localhost:4200/main.js")).default,
  activeWhen: (location) => location.pathname.startsWith("/home"),
});

registerApplication({
  name: "systudo-login-frontend",
  app: async () => (await System.import("//localhost:4201/main.js")).default,
  activeWhen: (location) => location.pathname.startsWith("/login"),
});

start();
