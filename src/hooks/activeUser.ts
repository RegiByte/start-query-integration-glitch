import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export const cookieKey = "active_user";

export function useActiveUser() {
  const [activeUser, setActiveUser] = useState<string | null>(null);

  useEffect(() => {
    if (typeof "window" === "undefined") return;
    const storedUser = Cookies.get(cookieKey);
    console.log({ storedUser });

    if (storedUser?.length) {
      setActiveUser(storedUser);
    }
  }, []);

  const setUser = (newUser: string) => {
    Cookies.set(cookieKey, newUser, {
      sameSite: "lax",
    });
    setActiveUser(newUser);
  };

  const clearUser = () => {
    Cookies.remove(cookieKey);
    setActiveUser(null);
  };

  return {
    activeUser,
    setUser,
    clearUser,
  };
}
