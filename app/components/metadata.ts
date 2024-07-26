// app/components/metadata.ts
export interface OpenGraph {
  title: string;
  description: string;
  url: string;
  images: { url: string; width: number; height: number; alt: string }[];
}

export interface Robots {
  index: boolean;
  follow: boolean;
  nocache?: boolean;
  googleBot: {
    index: boolean;
    follow: boolean;
    noimageindex?: boolean;
    'max-video-preview': number;
    'max-image-preview': string;
    'max-snippet': number;
  };
}

export interface Metadata {
  title: string;
  description: string;
  openGraph: OpenGraph;
  robots?: Robots | string;
}

interface GenerateMetadataParams {
  title: string;
  description: string;
  url: string;
  image: string;
  robots?: Robots | string;
}

export const generateMetadata = (params: GenerateMetadataParams): Metadata => {
  const { title, description, url, image, robots } = params;

  const defaultRobots: Robots = {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1918,
          height: 1078,
          alt: `${title} Image`,
        },
      ],
    },
    robots: robots || defaultRobots,
  };
};
