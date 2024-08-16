import { getSession, Session } from "@auth0/nextjs-auth0";

export default async function ProfileServer() {
  const session = await getSession();

  if (!session || !session.user) {
    return <div>user was not found</div>;
  }

  const { user } = session;
  return (
    <div>
      <img src={user.picture || ""} alt={user.name || "user not found"} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
