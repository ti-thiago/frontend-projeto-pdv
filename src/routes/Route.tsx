import React from "react";
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from "react-router-dom";

interface RouteProps extends ReactDOMRouteProps {
  path?: string;
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  console.log(isPrivate);
  return (
    <ReactDOMRoute
      {...rest}
      render={() => {
        // return isPrivate ? (
        return <Component />;
        // ) : (
        //   <Redirect
        //     to={{
        //       pathname: "/",
        //     }}
        // />
        // );
      }}
    />
  );
};

export default Route;
