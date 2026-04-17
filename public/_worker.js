export default {
  async fetch(request, env) {
    const accept = request.headers.get("Accept") || "";

    if (!accept.includes("text/markdown")) {
      return env.ASSETS.fetch(request);
    }

    const htmlRequest = new Request(request.url, {
      method: request.method,
      headers: new Headers({ Accept: "text/html" }),
    });

    const htmlResponse = await env.ASSETS.fetch(htmlRequest);

    if (!htmlResponse.ok) {
      return htmlResponse;
    }

    const contentType = htmlResponse.headers.get("Content-Type") || "";
    if (!contentType.includes("text/html")) {
      return htmlResponse;
    }

    const html = await htmlResponse.text();
    const markdown = convertHtmlToMarkdown(html);
    const tokenCount = Math.ceil(markdown.length / 4);

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": String(tokenCount),
      },
    });
  },
};

function convertHtmlToMarkdown(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gis, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gis, "")
    .replace(/<h1[^>]*>(.*?)<\/h1>/gis, "\n# $1\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, "\n## $1\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gis, "\n### $1\n")
    .replace(/<h4[^>]*>(.*?)<\/h4>/gis, "\n#### $1\n")
    .replace(/<h5[^>]*>(.*?)<\/h5>/gis, "\n##### $1\n")
    .replace(/<h6[^>]*>(.*?)<\/h6>/gis, "\n###### $1\n")
    .replace(/<p[^>]*>(.*?)<\/p>/gis, "\n$1\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gis, "**$2**")
    .replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gis, "_$2_")
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gis, "[$2]($1)")
    .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/gi, "![$1]($2)")
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, "![$2]($1)")
    .replace(/<img[^>]*>/gi, "")
    .replace(/<li[^>]*>(.*?)<\/li>/gis, "- $1\n")
    .replace(/<\/(ul|ol)>/gi, "\n")
    .replace(/<(ul|ol)[^>]*>/gi, "\n")
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, "> $1")
    .replace(/<pre[^>]*>(.*?)<\/pre>/gis, "\n```\n$1\n```\n")
    .replace(/<code[^>]*>(.*?)<\/code>/gis, "`$1`")
    .replace(/<hr\s*\/?>/gi, "\n---\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
