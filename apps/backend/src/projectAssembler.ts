import { BASE_TEMPLATE } from "./baseTemplate.js";

export type GeneratedFile = {
  path: string;
  content: string;
};

export type ProjectFiles = Record<string, string>;

export function assembleProject(
  generatedFiles: GeneratedFile[]
): ProjectFiles {
  const project: ProjectFiles = structuredClone(BASE_TEMPLATE);

  for (const file of generatedFiles) {
    // Never allow App.css imports (Tailwind-only system)
    let content = file.content.replace(
      /import\s+["']\.\/App\.css["'];?\n?/g,
      ""
    );

    project[file.path] = content;
  }

  return project;
}
