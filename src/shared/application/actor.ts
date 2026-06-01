export enum ActorRole {
  USER = "USER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
}

export type Actor = {
  id: string;
  role: ActorRole;
};
