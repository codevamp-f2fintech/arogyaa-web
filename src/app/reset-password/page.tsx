import React, { Suspense } from "react";

import ResetPasswordPage from "./mainPage";
import Loader from "../components/common/Loader";

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordPage/>
    </Suspense>
  );
}
