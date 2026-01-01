import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || "";
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || "production";

export default defineConfig({
  name: "seasons",
  title: "Seasons - Content Studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Products")
              .child(
                S.list()
                  .title("Products")
                  .items([
                    S.listItem()
                      .title("All Products")
                      .child(S.documentTypeList("product").title("All Products")),
                    S.listItem()
                      .title("By Brand")
                      .child(
                        S.documentTypeList("brand")
                          .title("Brands")
                          .child((brandId) =>
                            S.documentList()
                              .title("Products")
                              .filter('_type == "product" && brand._ref == $brandId')
                              .params({ brandId })
                          )
                      ),
                    S.divider(),
                    S.listItem()
                      .title("Brands")
                      .child(S.documentTypeList("brand").title("Brands")),
                  ])
              ),
            S.divider(),
            S.listItem()
              .title("Blog")
              .child(
                S.list()
                  .title("Blog")
                  .items([
                    S.listItem()
                      .title("Posts")
                      .child(S.documentTypeList("post").title("Posts")),
                    S.listItem()
                      .title("Categories")
                      .child(S.documentTypeList("category").title("Categories")),
                    S.listItem()
                      .title("Authors")
                      .child(S.documentTypeList("author").title("Authors")),
                  ])
              ),
            S.divider(),
            S.listItem()
              .title("Settings")
              .child(
                S.list()
                  .title("Settings")
                  .items([
                    S.listItem()
                      .title("Site Settings")
                      .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
