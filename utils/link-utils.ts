import { decode } from "html-entities";

const REGEX_GET_TITLE_TAG_CONTENT = /(?<=<title>)(.*?)(?=<\/title>)/;
const REGEX_GET_OG_TITLE_CONTENT =
  /(?<=<meta\s+property=["']og:title["']\s+content=["'])(.*?)(?=["'])/;
const REGEX_GET_OG_DESC_CONTENT =
  /(?<=<meta\s+property=["']og:description["']\s+content=["'])(.*?)(?=["'])/;
const REGEX_GET_META_TAG_DESC =
  /(?<=meta\s+name="description"\s+content=["'])(.*?)(?=["'])/;
const REGEX_GET_OG_IMAGE_CONTENT =
  /(?<=<meta\s+property=["']og:image["']\s+content=["'])(.*?)(?=["'])/;
const REGEX_CONTENT_TYPE_IMAGE = /image\/*/g;

const sanitizeHTMLContent = (content: string) => {
  const trimmedContent = content.trim();
  if (!trimmedContent) return;
  return decode(trimmedContent);
};

const getSiteTitle = (content: string) => {
  const ogTagContent = sanitizeHTMLContent(
    content.match(REGEX_GET_OG_TITLE_CONTENT)?.[0] || ""
  );
  if (ogTagContent) return ogTagContent;
  const titleTagContent = sanitizeHTMLContent(
    content.match(REGEX_GET_TITLE_TAG_CONTENT)?.[0] || ""
  );
  if (!titleTagContent) return titleTagContent;
};
const getSiteDescription = (content: string) => {
  const ogTagContent = sanitizeHTMLContent(
    content.match(REGEX_GET_OG_DESC_CONTENT)?.[0] || ""
  );
  if (ogTagContent) return ogTagContent;

  const titleTagContent = sanitizeHTMLContent(
    content.match(REGEX_GET_META_TAG_DESC)?.[0] || ""
  );
  if (titleTagContent) return titleTagContent;
};

const getImageUrl = (content: string, currUrl: string) => {
  if (content.startsWith("data")) return content;
  const ogImage = sanitizeHTMLContent(
    content.match(REGEX_GET_OG_IMAGE_CONTENT)?.[0] || ""
  );
  if (ogImage) {
    return ogImage.startsWith("/") ? `${currUrl}${ogImage}` : ogImage;
  }
};

export const getLinkData = async (url: string, signal: AbortSignal) => {
  try {
    const linkData = { title: "", image: "", desc: "" };
    const response = await fetch(url, { signal });
    const contentType = response.headers.get("content-type") ?? "";

    if (REGEX_CONTENT_TYPE_IMAGE.test(contentType)) {
      linkData.image;
    } else {
      const content = await response.text();
      linkData.image = getImageUrl(content, url) || "";
      linkData.title = getSiteTitle(content) || "";
      linkData.desc = getSiteDescription(content) || "";
    }

    return linkData;
  } catch (error) {
    throw new Error("Something went wrong");
    return null;
  }
};
