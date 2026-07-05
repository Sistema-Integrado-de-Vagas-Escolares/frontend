import { Outlet } from "react-router";
import { SchoolsProvider } from "./context/SchoolsContext";

export default function Root() {
  return (
    <SchoolsProvider>
      <Outlet />
    </SchoolsProvider>
  );
}
