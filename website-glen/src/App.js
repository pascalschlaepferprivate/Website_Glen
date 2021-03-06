import React from 'react';
import './App.css';
import 'fontsource-roboto';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, IconButton, Toolbar, Typography, Button } from '@material-ui/core';
import {spacing} from '@material-ui/system';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import { ViewPDF } from './components/ViewPDF';
import { Footer } from './components/Footer';

import Home from './components/Home';
import About from './components/About';
import ProtPlot from './components/ProtPlot';
import MotifX from './components/MotifX';
import ProtPlotDEV from './components/ProtPlotDev';

import { ReactComponent as DomainVizIcon } from './components/svg/domainviz.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    width: 90,
    height: 90,
    // backgroundColor: '#7F7F7F' 
  },
  title: {
    flexGrow: 1,
    fontFamily: `"Raleway"`,
    fontSize: 40,
  },
  linkButton: {
    fontFamily: `"Raleway"`,
    fontSize: 20,
    fontStyle: "bold",
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbar: theme.mixins.toolbar,

}));

function App() {
  const classes = useStyles();
  // const theme = {
  //   spacing: 10,
  // }
  return (
    <div className="App">
      <BrowserRouter>
        <AppBar postion='fixed' className={classes.appBar}>
          <Toolbar>
            {/* TODO: replace with svg icon from devang */}
            <IconButton disabled edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <DomainVizIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Uhrig Lab
            </Typography>
            {/* <Link to='/'>
              <Button color='inherit'>Home</Button>
            </Link> */}
            {/* <Link to='/domainvis'> */}
            <Link to='/'>
              <Button color='inherit' className={classes.linkButton}>DomainViz</Button>
            </Link>
            {/* <Link to='/motif-x'>
              <Button color='inherit'>MotifX</Button>
            </Link> */}
            <Link to='/about'>
              <Button color='inherit' className={classes.linkButton}>About Us</Button>
            </Link>
            <Link to='/help'>
              <Button color='inherit' className={classes.linkButton}>Help</Button>
            </Link>
            <a>
              <Button target="_blank" color='inherit' href="https://www.uhriglab.com/" className={classes.linkButton}>Lab Website</Button>
            </a>

          </Toolbar>
        </AppBar>

        <Switch>
          {/* <Route path="/" exact component={Home} /> TODO TEMP: this should be enabled, and the following line should be disabled in final product*/}
          <Route path="/" exact component={ProtPlot} /> 
          <Route path="/about" component={About} />
          <Route path="/view-results/" component={ViewPDF} />
          {/* <Route path="/domainviz" component={ProtPlot} /> */}
          <Route path="/protplotDEVcc8ff46b-6306-0197-20b8-53961a20dd76" component={ProtPlotDEV} />
          {/* <Route path="/motif-x" component={MotifX} /> */}
        </Switch>
      </BrowserRouter>

      <Footer></Footer>

    </div>

  );
}

export default App;
