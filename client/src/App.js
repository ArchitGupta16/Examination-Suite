import React, { Fragment, useState } from "react";
import { Route, Switch, useLocation, Redirect } from "react-router-dom";
import Taketest from "./components/TakeTest";
import dashboard from "./components/Dashboard";
import Ques from "./components/Question.component";
import Landing from "./components/Landing";
import TestResults from "./components/Results";

function App() {
  const [loggedin, setloggedin] = useState(false);

  let location = useLocation();
  return (
    <React.Fragment>
      <main>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/taketest" component={Taketest} />
          <Route exact path="/dashboard" component={dashboard} />
          <Route exact path="/test" component={Ques} />
          <Route exact path="/test-results" component={TestResults} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </main>
    </React.Fragment>
  );
}

export default App;