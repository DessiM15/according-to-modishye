import type { StructureResolver } from "sanity/structure";
import { BookIcon } from "@sanity/icons/Book";
import { DocumentIcon } from "@sanity/icons/Document";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { StackCompactIcon } from "@sanity/icons/StackCompact";
import { shelves } from "./shelves";

// What she sees in the left column. Nothing else.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Modishye")
    .items([
      S.listItem()
        .title("Articles")
        .icon(DocumentTextIcon)
        .child(S.documentTypeList("article").title("Articles").defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
      S.listItem()
        .title("Articles by shelf")
        .icon(StackCompactIcon)
        .child(
          S.list()
            .title("Shelves")
            .items(
              shelves.map((s) =>
                S.listItem()
                  .title(s.title)
                  .child(
                    S.documentList()
                      .title(s.title)
                      .schemaType("article")
                      .filter('_type == "article" && shelf == $shelf')
                      .params({ shelf: s.value })
                      .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
                  )
              )
            )
        ),
      S.divider(),
      S.listItem().title("Guides (shop)").icon(BookIcon).child(S.documentTypeList("guide").title("Guides").defaultOrdering([{ field: "order", direction: "asc" }])),
      S.listItem().title("Legal pages").icon(DocumentIcon).child(S.documentTypeList("legalPage").title("Legal pages")),
    ]);
