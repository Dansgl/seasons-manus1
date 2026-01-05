// Product schemas
import brand from "./brand";
import product from "./product";

// Blog schemas
import author from "./author";
import category from "./category";
import post from "./post";

// Settings
import siteSettings from "./siteSettings";
import aboutPage from "./aboutPage";

export const schemaTypes = [
  // Products
  brand,
  product,
  // Blog
  author,
  category,
  post,
  // Settings
  siteSettings,
  aboutPage,
];
