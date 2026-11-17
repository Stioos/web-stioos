import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";

async function main() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync("/tmp/stioos_flat.png");
  const dataUrl = `data:image/png;base64,${imageBuffer.toString("base64")}`;

  const response = await zai.images.generations.edit({
    prompt:
      "Replace the blue gradient word 'STioos' with the word 'JOBSONN' spelled J-O-B-S-O-N-N, in the exact same glossy rounded futuristic blue gradient techno font style, same letter height, same position, same baseline. Keep the glossy 3D globe with orbiting swoosh ring and the small floating pixel squares on the left exactly unchanged. Keep pure black background. Crisp clean sharp edges, no artifacts, no color noise, no fringing.",
    images: [{ url: dataUrl }],
    size: "1440x720",
  });

  const base64 = response.data[0].base64;
  fs.writeFileSync("/tmp/jobsonn_edit_raw.png", Buffer.from(base64, "base64"));
  console.log("saved /tmp/jobsonn_edit_raw.png bytes:", Buffer.from(base64, "base64").length);
}

main().catch((e) => {
  console.error("EDIT FAILED:", e?.message || e);
  process.exit(1);
});
