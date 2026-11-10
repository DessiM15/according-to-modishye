import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  (await draftMode()).disable();
  const back = req.headers.get("referer");
  let path = "/";
  if (back) {
    try {
      const u = new URL(back);
      if (u.origin === new URL(req.url).origin) path = u.pathname;
    } catch {}
  }
  redirect(path);
}
