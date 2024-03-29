//React
import React, { useContext } from "react";

//Next
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";

//date-fns
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

//Hook
import { usePlayer } from "../../hooks/usePlayer";

//Api
import api from "../../services/api";

//Utils
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

//Style
import styles from "./episode.module.scss";

//Interface
interface EpisodesProps {
  episode: Episode;
}

interface Episode {
  id: string;
  title: string;
  members: string;
  published_at: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  url: string;
  duration: number;
  durationAsString: string;
}

export default function Episodes(props: EpisodesProps) {
  const { episode } = props;

  const { play } = usePlayer();

  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando</p>;
  }

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          src={episode.thumbnail}
          alt={episode.title}
          width={700}
          height={160}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const paths = data.map((episode) => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    thumbnail: data.thumbnail,
    description: data.description,
    url: data.file.url,
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, //24horas
  };
};
