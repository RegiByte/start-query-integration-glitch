import { createFileRoute } from "@tanstack/react-router";
import { useActiveUser } from "~/hooks/activeUser";
import { useUserData } from "~/queries/userData";

export const Route = createFileRoute("/")({
  component: Home,
  ssr: false,
});

function Home() {
  const { activeUser, setUser } = useActiveUser();

  const { data } = useUserData()
  return (
    <div className="p-2">
      <h3>Welcome Home!!!</h3>

      <div>Active User: {activeUser || "None"}</div>
      <div style={{ display: "flex" }}>
        <button onClick={() => setUser("user_1")}>Set user 1</button>
        <button onClick={() => setUser("user_2")}>Set user 2</button>
      </div>

      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
