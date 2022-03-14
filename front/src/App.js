import { BrowserRouter, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import NavBar from "./components/Navbar.js";
import { Container, Flex } from "@chakra-ui/react";
import DashBoard from "./pages/DashBoard";
import MyPoint from "./pages/MyPoint";
import Transaction from "./pages/Transaction";
import Login from "./pages/Login";
import { useWeb3React } from "@web3-react/core";

const AppWrap = styled.div`
  font-size: 12px;
  font-family: "Poppins", sans-serif;
`;

function App() {
  const { active } = useWeb3React();
  return (
    <AppWrap>
      <Container maxW="full" bg="#E5E5E5" p={0}>
        <Flex minH="100vh" h="full">
          <BrowserRouter>
            {active ? <Redirect to="/dashboard" /> : <Redirect to="/" />}
            {active ? <NavBar /> : <></>}
            <Route exact path="/" component={Login} />
            <Route exact path="/dashboard" component={DashBoard} />
            <Route exact path="/my-point" component={MyPoint} />
            <Route exact path="/check-transactions" component={Transaction} />
          </BrowserRouter>
        </Flex>
      </Container>
    </AppWrap>
  );
}

export default App;