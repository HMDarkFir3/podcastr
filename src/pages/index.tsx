//React
import React, { useEffect } from "react";

//SSG

export default function Home(props) {
  /// SPA
  /*useEffect(() => {
    fetch("http://localhost:3333/episodes")
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, []);*/
  /* ------------------------------------------ */
  ///SSR
  /*return (
   <div>
      <p>{JSON.stringify(props.episodes)}</p>
   </div> 
  );*/

  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  );
}

///SSR
/*
export async function getServerSideProps() {
  const response = await fetch("http://localhost:3333/episodes");
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
  };
}
*/

//SSG
export async function getStaticProps() {
  const response = await fetch("http://localhost:3333/episodes");
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  };
}
