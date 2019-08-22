import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import ReceiptIcon from '@material-ui/icons/Receipt';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import ListingComponent from "./component/ListingComponent";
import { BrowserRouter, HashRouter, Route, Switch, Link } from "react-router-dom"
import ProductComponent from "./component/ProductComponent";
import BasketComponent from "./component/BasketComponent";
import CheckoutComponent from "./component/CheckoutComponent";
import OrdersComponent from "./component/OrdersComponent";
import PaymentComponent from "./component/PaymentComponent";
import ShopApiService from "./service/shop.api.service";
import BasketToolbarComponent from "./component/BasketToolbarComponent";
import {connect} from "react-redux";
import PaymentIcon from '@material-ui/icons/Payment';
import { formatMoney } from './service/localeFormat';
import CONFIG from './config';
import CategoriesListComponent from "./component/CategoriesListComponent";
import CustomTheme from "./theme";
import ShopTitleBarComponent from "./component/ShopTitleBarComponent";
import ContactComponent from "./component/ContactComponent";
import PagesListComponent from "./component/PagesListComponent";
import PageComponent from "./component/PageComponent";
import Analytics from "react-router-ga";

require('./less/style.less');

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    overflowX: 'auto',
  },
  logo: {
    width: '100%',
    padding: theme.spacing(3),
  }
});

class Shop extends Component {
  constructor(props) {
    super(props);

    this.classes = props.classes;

    this.api = new ShopApiService();

    this.state = {
      mobileOpen: false,
      basketCount: props.basketStorage.count,
      basketTotal: props.basketStorage.total,
      basketProducts: props.basketStorage.products,
    };

    this.props = props;

    this.rootAtts = this.props.root;

    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.renderAppBar = this.renderAppBar.bind(this);
    this.renderDrawer = this.renderDrawer.bind(this);
    this.renderRoutes = this.renderRoutes.bind(this);
  }

  componentDidUpdate() {
    if (this.state.basketCount !== this.props.basketStorage.count) {
      this.setState({
        ...this.state,
        basketCount: this.props.basketStorage.count,
        basketTotal: this.props.basketStorage.total,
        basketProducts: this.props.basketStorage.products,
      });
    }
  }

  handleDrawerToggle() {
    this.setState({
      ...this.state,
      mobileOpen: !this.state.mobileOpen,
    });
  }

  renderDrawer() {
    return (
        <React.Fragment>
          <div className={this.classes.toolbar}>
            <Link to="/">
              <img src={CONFIG.logoUrl} className={this.classes.logo} />
            </Link>
          </div>

          <Divider />

          <CategoriesListComponent api={this.api} />

          <Divider />

          <List>
            <Link to="/basket">
              <ListItem button key="basket">
                <ListItemIcon>
                  <Badge badgeContent={this.state.basketCount} color="secondary">
                    <ShoppingBasketIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Basket" />
              </ListItem>
            </Link>

            {this.state.basketCount ? (
                <Link to="/checkout">
                  <ListItem button key="checkout">
                    <ListItemIcon>
                      <PaymentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Checkout" secondary={"Total: " + formatMoney(this.state.basketTotal)} />
                  </ListItem>
                </Link>
            ) : (
                <React.Fragment/>
            )}

            <Link to="/orders">
              <ListItem button key="orders">
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="My orders" />
              </ListItem>
            </Link>
          </List>

          <Divider />

          <PagesListComponent api={this.api} />

        </React.Fragment>
    );
  }

  renderRoutes() {
    let gaParams = {
      id: this.rootAtts['data-ga-tracking-id'] || '',
    };

    if (CONFIG.isDev) {
      gaParams.debug = true;
    }

    return (
        <Analytics {...gaParams}>
          <Switch>
            <Route exact path="/" render={(props) => <ListingComponent {...props} api={this.api} />} />
            <Route exact path="/category/:id" render={(props) => <ListingComponent {...props} api={this.api} />} />
            <Route exact path="/product/:id" render={(props) => <ProductComponent {...props} api={this.api} />} />
            <Route exact path="/basket" render={(props) => <BasketComponent {...props} />} />
            <Route exact path="/checkout/:paymentReturn/:orderNumber" render={(props) => <CheckoutComponent {...props} />} />
            <Route exact path="/checkout/:paymentReturn" render={(props) => <CheckoutComponent {...props} />} />
            <Route exact path="/checkout" render={(props) => <CheckoutComponent {...props} />} />
            <Route exact path="/orders" render={(props) => <OrdersComponent {...props} api={this.api} />} />
            <Route exact path="/orders/:accessCode" render={(props) => <OrdersComponent {...props} api={this.api} />} />
            <Route exact path="/payment" render={(props) => <PaymentComponent {...props} api={this.api} />} />
            <Route exact path="/contact" render={(props) => <ContactComponent {...props} api={this.api} />} />
            <Route exact path="/page/:id" render={(props) => <PageComponent {...props} api={this.api} />} />
          </Switch>
        </Analytics>
    );
  }

  renderAppBar() {
    return (
        <AppBar position="fixed" className={this.classes.appBar}>
          <Toolbar>
            <IconButton
                color="inherit"
                aria-label="Open drawer"
                edge="start"
                onClick={this.handleDrawerToggle}
                className={this.classes.menuButton}
            >
              <MenuIcon />
            </IconButton>

            <ShopTitleBarComponent />

            <BasketToolbarComponent />
          </Toolbar>
        </AppBar>
    );
  }

  render() {
    const Router = CONFIG.isProd ? BrowserRouter : HashRouter;

    return (
        <MuiThemeProvider theme={CustomTheme}>
          <div className={this.classes.root}>
            <CssBaseline />

            <Router>
              {this.renderAppBar()}

              <nav className={this.classes.drawer} aria-label="manu">
                <Hidden smUp implementation="css">
                  <Drawer
                      variant="temporary"
                      open={this.state.mobileOpen}
                      onClose={this.handleDrawerToggle}
                      classes={{
                        paper: this.classes.drawerPaper,
                      }}
                      ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                      }}
                  >
                    {this.renderDrawer()}
                  </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                  <Drawer
                      classes={{
                        paper: this.classes.drawerPaper,
                      }}
                      variant="permanent"
                      open
                  >
                    {this.renderDrawer()}
                  </Drawer>
                </Hidden>
              </nav>

              <main className={this.classes.content}>
                <div className={this.classes.toolbar} />

                {this.renderRoutes()}

              </main>

            </Router>
          </div>
        </MuiThemeProvider>
    );
  }
}

Shop.propTypes = {
  name: PropTypes.string,
  classes: PropTypes.object.isRequired,
  basketStorage: PropTypes.shape({
    count: PropTypes.number,
    total: PropTypes.number,
    products: PropTypes.array,
  })
};

const mapStateToProps = (state) => {
  let products = [];

  for (let id in state.basket.products) {
    if (state.basket.products.hasOwnProperty(id)) {
      products.push(state.basket.products[id]);
    }
  }

  return {
    basketStorage: {
      count: state.basket.count,
      total: state.basket.total,
      products: products,
    }
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Shop));
