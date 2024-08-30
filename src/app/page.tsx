

import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import styles from './page.module.css';

import Home from "./components/Home";
import Topbar from './components/common/Topbar';
const Footer = dynamic(() => import('./components/common/Footer'));


const ContainerPage = styled.div`
padding:0px 50px;
background:#F9F6F6;
padding-top:50px;
`;

const Root = () => {

  return (
    <ContainerPage>
      <Box className={styles.container_main}>
        <Topbar />
        <Home />
        <Footer />
      </Box>
    </ContainerPage>
  );
};

export default Root;
