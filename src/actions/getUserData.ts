import { createServerFn } from "@tanstack/react-start";
import { getCookie, getHeader } from "@tanstack/react-start/server";
import { cookieKey } from "~/hooks/activeUser";

const tasks = {
  user_1: [
    {
      id: 1,
      name: "User 1 Task 1",
      completed: false,
    },
    {
      id: 2,
      name: "User 1 Task 2",
      completed: false,
    },
  ],
  user_2: [
    {
      id: 1,
      name: "User 2 Task 1",
      completed: false,
    },
    {
      id: 2,
      name: "User 2 Task 2",
      completed: false,
    },
  ],
};

export const getUserData = createServerFn({
  method: "GET",
}).handler(async () => {
  const activeUser = getCookie(cookieKey);
  console.log("activeUser", activeUser);
  
  if (!activeUser) {
    return {
      activeUser: null,
      data: null,
    };
  }

  await new Promise((resolve) => {
    // wait for 5 seconds to see the bug
    return setTimeout(resolve, 1000 * 3);
  });

  if (!tasks[activeUser as keyof typeof tasks]) {
    return {
      activeUser,
      data: null,
    };
  }

  return {
    activeUser,
    data: tasks[activeUser as keyof typeof tasks],
  };
});
