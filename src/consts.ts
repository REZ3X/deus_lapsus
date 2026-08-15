import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Rejaka Abimanyu Susanto",
  EMAIL: "abim@rejaka.id",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION:
    "Portfolio of Rejaka Abimanyu Susanto, a full-stack developer and tech enthusiast from Yogyakarta, Indonesia. MTCNA certified, open for freelance works.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of my projects, with links to repositories and demos.",
};

export const RESUME: Metadata = {
  TITLE: "Resume",
  DESCRIPTION:
    "CV / Resume of Rejaka Abimanyu Susanto, a full-stack developer from Yogyakarta, Indonesia.",
};

export const ACHIEVEMENTS: Metadata = {
  TITLE: "Achievements",
  DESCRIPTION:
    "A collection of my achievements in web development competitions.",
};

export const SOCIALS: Socials = [
  {
    NAME: "github",
    HREF: "https://github.com/REZ3X",
  },
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/rejaka-me/",
  },
  {
    NAME: "instagram",
    HREF: "https://instagram.com/rejakasusanto",
  },
];
