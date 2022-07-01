import { React } from 'react';
import{
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
//import logo from './logo.svg';

//shared
import WithoutGuestNav from './Frontend/shared/WithoutGuestNav';
import WithGuestNav from './Frontend/shared/WithGuestNav';
import ProtectRoute from './Frontend/shared/ProtectRoute';
import WithDashboardNav from './Frontend/shared/WithDashboardNav';
import WithDasboardNavNoFooter from './Frontend/shared/WithDashboardNavNoFooter';

//pages
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Frontend/Home/pages/Home';
import Login from './Frontend/Login/Pages/Login';
import ForgotPassword from './Frontend/Login/Pages/ForgotPassword';
import Register from './Frontend/Register/pages/Register';
import RegisterSuccess from './Frontend/Success/pages/RegisterSuccess'
import AuthHome from './Frontend/AuthHome/pages/AuthHome'
import ItemsByCategory from './Frontend/ItemsByCategory/pages/ItemsByCategory'
import ProductListing from './Frontend/ProductListing/pages/ProductListing';
// import TestComponent from './Frontend/TESTING COMPONENT/TestComponent'
import ItemDetail from './Frontend/ItemDetail/pages/ItemDetail';
import SearchedItems from './Frontend/SearchedItems/pages/SearchedItems';
import CreateNewPassword from './Frontend/Login/Pages/CreateNewPassword';
import Cart from './Frontend/Cart/pages/Cart';
import WishList from './Frontend/WishList/WishList';
import PaymentNotification from './Frontend/PaymentNotification/PaymentNotification';
import OrderHistory from './Frontend/OrderHistory/Pages/OrderHistory';
import MyItems from './Frontend/MyItems/pages/MyItems';
import Profile from './Frontend/Profile/pages/Profile';
import EditItem from './Frontend/MyItems/pages/EditItem';
//import { useSelector, useDispatch } from 'react-redux'
import './customGeneralStyle.css'
import 'antd/dist/antd.min.css'

const App = () => {


  console.log('inside App.js')
  console.log('=====================================================================================================')

  return(
      <Router>
          <Routes>
            <Route element={<WithoutGuestNav />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register-success" element={<RegisterSuccess />} />
              <Route path="/reset-password" element={<ForgotPassword />} />
              <Route path="/reset-password/create-new-password/:resetToken" element={<CreateNewPassword />} />
            </Route>
            <Route element={<WithGuestNav />}>
              <Route path="/" element={<Home />} />
              <Route path="/search/:searchKeyword" element={<SearchedItems />} />
              <Route path="/category" element={<ItemsByCategory />} />
              <Route path="/item/:itemId" element={<ItemDetail />} />
            </Route>
            <Route element={<WithDashboardNav />}>
              <Route path="/home" element={
                  <ProtectRoute>
                    <AuthHome />
                  </ProtectRoute>
              }>
              </Route>
              <Route path="/home/category" element={
                  <ItemsByCategory />
              } 
              /> 
              <Route path="/product-listing" element={
                <ProtectRoute>
                  <ProductListing />
                </ProtectRoute>
              }
              />
              <Route path="/home/item/:itemId" element={
                <ItemDetail />
              }
              />
              <Route path="/home/search/:searchKeyword" element={
                <SearchedItems />
              }
              />
              <Route path="/payment-notification" element={
                <PaymentNotification />
              } />
              <Route path="/my-items/edit/:itemId" element={
                <ProtectRoute>
                  <EditItem />
                </ProtectRoute>
              } />
              
              {/* <Route path="/test-component" element={<TestComponent />} /> */}
            </Route> 
            <Route element= {<WithDasboardNavNoFooter />}>
              <Route path="/profile" element={
                <ProtectRoute>
                  <Profile />
                </ProtectRoute>
              }/>
               <Route path="/my-items" element={
                <ProtectRoute>
                  <MyItems />
                </ProtectRoute>
              } />
                <Route path="/order-history" element={
                <ProtectRoute>
                  <OrderHistory />
                </ProtectRoute>
              } 
              />
              <Route path="/cart" element={
                <ProtectRoute>
                  <Cart />
                </ProtectRoute>
              } 
              />
                <Route path="/wishlist" element={
                <ProtectRoute>
                  <WishList />
                </ProtectRoute>
              } />
            </Route>
          </Routes>
      </Router>
  );
};

export default App;
