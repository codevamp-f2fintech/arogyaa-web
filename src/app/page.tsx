import Box from '@mui/material/Box';

import styles from './page.module.css';
import Home from "./components/Home";

const Root = () => {
  return (
    <div className={styles.root}>
      <Box className={styles.container_main}>
        <Home />
      </Box>
    </div>
  );
};

export default Root;
