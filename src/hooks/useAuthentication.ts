import { useSession } from "@/contexts/SessionContext";

export function useAuthentication() {
  return useSession();
}
