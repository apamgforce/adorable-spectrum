import { redirect } from "next/navigation";

// Old address. The owner dashboard now lives at /admin.
export default function Page() {
  redirect("/admin");
}
