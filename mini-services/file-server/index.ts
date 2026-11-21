// Lightweight file server — serves the Excel CTA file on port 3030
// Access via: /stioos-all-ctas.xlsx?XTransformPort=3030

const PORT = 3030;
const FILE_PATH = "/home/z/my-project/public/stioos-all-ctas.xlsx";

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === "/stioos-all-ctas.xlsx" || url.pathname === "/") {
      const file = Bun.file(FILE_PATH);
      if (await file.exists()) {
        return new Response(file, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=\"stioos-all-ctas.xlsx\"",
            "Content-Length": file.size.toString(),
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
      return new Response("File not found", { status: 404 });
    }
    
    return new Response("OK - File server running. Download: /stioos-all-ctas.xlsx", {
      headers: { "Content-Type": "text/plain" },
    });
  },
});

console.log(`File server running on port ${PORT}`);
console.log(`Download: http://localhost:${PORT}/stioos-all-ctas.xlsx`);
