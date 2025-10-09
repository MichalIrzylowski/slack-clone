import { Routes as LibRoutes, Route } from "react-router";
import { Home } from "./home/main";

export const Routes = () => {
  return (
    <LibRoutes>
      <Route path="/" element={<Home />} />
    </LibRoutes>
  );
};
