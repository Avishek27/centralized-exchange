import { auth } from "@/auth";
import Navbar from "./Navbar";

const HomeNavbar =
  async () => {
    const session =
      await auth();

    const user =
      session?.user
        ? {
            name:
              session.user
                .name ??
              "User",

            email:
              session.user
                .email ??
              null,
          }
        : null;


    return (
      <Navbar
        user={user}
      />
    );
  };

export default HomeNavbar;