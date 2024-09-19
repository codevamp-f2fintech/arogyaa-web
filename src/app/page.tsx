import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import styles from "./page.module.css";

import Home from "./components/Home";
import Topbar from "./components/common/Topbar";

const Footer = dynamic(() => import("./components/common/Footer"));

const Root = () => {
  return (
    <div
      style={{
        padding: "0px 50px",
        background: "#F9F6F6",
        paddingTop: "50px",
      }}
    >
      <Box className={styles.container_main}>
        <Topbar />
        <Home />
        <Footer />
      </Box>
    </div>
  );
};

export default Root;
