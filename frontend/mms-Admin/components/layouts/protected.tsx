
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  children: React.ReactElement;
};

/*
  add the requireAuth property to the page component
  to protect the page from unauthenticated users
  e.g.:
  OrderDetail.requireAuth = true;
  export default OrderDetail;
 */

export const ProtectedLayout = ({ children }: Props): JSX.Element => {
  const router = useRouter();

  let token:any;
  try {
    token = localStorage.getItem("token") || ""
  } catch (error) {}


  // const token  = window.localStorage.getItem("user");
  
  useEffect(() => {
    // check if the session is loading or the router is not ready


    // if the user is not authorized, redirect to the login page
    // with a return url to the current page
    if (!token) {
      console.log("not authorized");
      router.push({
        pathname: "/login"
      });
    }
  }, [router]);

  // if the user refreshed the page or somehow navigated to the protected page
 
  // if the user is authorized, render the page
  // otherwise, render nothing while the router redirects him to the login page
  return token ? <div>{children}</div> : <></>;
};
