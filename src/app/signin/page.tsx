import React, { Suspense } from "react";

import Login from "./mainPage";
import Loader from "../components/common/Loader";

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Login />
    </Suspense>
  );
}
