import { createBrowserRouter } from "react-router";
import Root from "./Root";
import PortalSelector from "./pages/PortalSelector";
import PrefeituraApp from "./pages/PrefeituraApp";
import EscolaApp from "./pages/EscolaApp";
import ResponsavelApp from "./pages/ResponsavelApp";
import MapaApp from "./pages/MapaApp";
import MunicipioApp, { MunicipioDashboardPage } from "./pages/MunicipioApp";
import CentralApp from "./pages/CentralApp";
import SiveAdminApp from "./pages/SiveAdminApp";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      // Entrada: login do município
      { index: true, Component: MunicipioApp },
      // Portal SIVE completo (após login)
      { path: "portal", Component: PortalSelector },
      // 4 módulos principais
      { path: "prefeitura", Component: PrefeituraApp },
      { path: "escola/*", Component: EscolaApp },
      { path: "responsavel", Component: ResponsavelApp },
      { path: "mapa", Component: MapaApp },
      // Dashboard municipal de métricas
      { path: "municipio-dashboard", Component: MunicipioDashboardPage },
      { path: "central", Component: CentralApp },
      { path: "sive-admin", Component: SiveAdminApp },
    ],
  },
]);
