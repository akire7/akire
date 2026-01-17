import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
};

import { notFound } from "next/navigation";

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    notFound();
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    subtitle: data.subtitle || "",
    publishedAt: data.publishedAt,
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || [],
    team: data.team || [],
    link: data.link || "",
  };

  return { metadata, content };
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir);
}

/**
 * Generates a random integer between the provided minimum and the provided maximum.
 *
 * @param minimum - The absolute minimum integer that can be generated.
 * @param includeMinimum - Whether to include the minimum value.
 * @param maximum - The absolute maximum integer that can be generated.
 * @param includeMaximum - Whether to include the maximum value.
 * @return A random integer.
 */
function generateRandomInteger(minimum: number, includeMinimum: boolean, maximum: number, includeMaximum: boolean) {
    let randomInteger = Math.random();
    randomInteger *= includeMaximum ? maximum - minimum + 1: maximum - minimum;
    randomInteger = Math.floor(randomInteger);
    randomInteger += includeMinimum ? minimum : minimum + 1;

    return randomInteger;
}

/*
export function randomizeArray(array: Array<any>): Array<any> {
    let randomIndex;

    for (let i = 0; i < array.length; i++) {
        randomIndex = generateRandomInteger(i, true, array.length, false);
        // Assign value at array[i] to now be array[randomIndex], and then vice versa (to swap)
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }

    return array;
}
*/
