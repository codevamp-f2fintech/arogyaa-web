import React, { Suspense } from "react";

import Signup from "./mainPage";
import Loader from "../components/common/Loader";

export default function SignupPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Signup />
    </Suspense>
  );
}
