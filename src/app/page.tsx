import React, { Suspense } from "react";

import Box from "@mui/material/Box";

import styles from "./page.module.css";
import Home from "./components/Home";
import Loader from "./components/common/Loader";

const Root = () => {
  return (
    <div className={styles.root}>
      <Box className={styles.container_main}>
        <Suspense fallback={<Loader />}>
          <Home />
        </Suspense>
      </Box>
    </div>
  );
};

export default Root;
