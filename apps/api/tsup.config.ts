import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/handlers/create-exam.ts",
    "src/handlers/fetch-exam-key.ts",
    "src/handlers/submit-answers.ts",
    "src/handlers/evaluate-exam.ts",
  ],
  format: ["esm"],
  target: "node20",
  platform: "node",
  splitting: false,
  clean: true,
  outDir: "dist",
});
