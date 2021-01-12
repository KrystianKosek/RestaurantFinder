import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import RestaurantReviews from './routes/RestaurantReviews';
import UpdatePage from './routes/UpdatePage';
import RestaurantDetailPage from './routes/RestaurantDetailPage';
import RestaurantReservation from './routes/RestaurantReservation';
import RestaurantEvents from './routes/RestaurantEvents';
import Home from './routes/Home';
import Register from './routes/RegisterPage';
import ClientsList from './routes/ClientsListPage';
import { RestaurantsContextProvider } from './context/RestaurantsContext';

const App = () => {
  return (
    <RestaurantsContextProvider>
      <div className="container">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/clients" component={ClientsList} />
            <Route exact path="/restaurants/:id" component={RestaurantDetailPage} />
            <Route exact path="/restaurants/:id/update" component={UpdatePage} />
            <Route exact path="/restaurants/:id/reviews" component={RestaurantReviews} />
            <Route exact path="/restaurants/:id/reservation" component={RestaurantReservation} />
            <Route exact path="/restaurants/:id/events" component={RestaurantEvents} />
          </Switch>
        </Router>
      </div>
    </RestaurantsContextProvider>
  )
}

export default App;