import React, { Suspense } from "react";

import DoctorListing from "./mainPage";
import Loader from "../components/common/Loader";

export default function DoctorListingPage() {
  return (
    <Suspense fallback={<Loader />}>
      <DoctorListing />
    </Suspense>
  );
}
