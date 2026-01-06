import React, { Suspense } from "react";

import PatientProfile from "./mainPage";
import Loader from "../components/common/Loader";

export default function PatientProfilePage() {
  return (
    <Suspense fallback={<Loader />}>
      <PatientProfile />
    </Suspense>
  );
}
