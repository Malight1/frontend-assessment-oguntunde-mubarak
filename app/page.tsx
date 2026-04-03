/**
 * Root page — immediately redirects to the movie listing.
 */
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/movies");
}
