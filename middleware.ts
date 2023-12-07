import { withAuth } from "next-auth/middleware";
import { DEBUG } from "./auth/options";

export default withAuth(function middleware() {}, {
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized: ({ token }) => {
      if (DEBUG) {
        console.log("Authorized middleware callback token: ", !!token);
      }
      return !!token;
    }
  }
});

/** The following routes will not work if there is no session in cookies.
 * Note: The access token does not need to be stored in the session or anywhere that
 * could be read in-browser. The cookie should be an http-only cookie.
 */

export const config = {
  matcher: ["/api/auth/:path*", "/dashboard/:path*"]
};
