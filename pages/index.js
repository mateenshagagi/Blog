import Head from "next/head";
import styles from "../styles/Home.module.css";
import { GraphQLClient, gql } from "graphql-request";
import BlogCard from "../components/BlogCard";

const graphcms = new GraphQLClient(
  "https://api-us-west-2.hygraph.com/v2/clj3g0ogl0d6x01t93u4n1rus/master"
);

const QUERY = gql`
  {
    posts {
      id
      title
      datePublished
      slug
      content {
        html
      }
      author {
        name
        avatar {
          url
        }
      }
      coverPhoto {
        publishedAt
        createdBy {
          id
        }
        url
      }
    }
  }
`;

export async function getStaticProps() {
  const { posts } = await graphcms.request(QUERY);
  return {
    props: {
      posts,
    },
    revalidate: 30,
  };
}

export default function Home({ posts }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>My Blog</title>
        <meta name="description" content="A blog tutorial made with JAMstack" />
      </Head>

      <main className={styles.main}>
        {posts.map((post) => (
          <BlogCard
            title={post.title}
            author={post.author}
            coverPhoto={post.coverPhoto}
            key={post.id}
            datePublished={post.datePublished}
            slug={post.slug}
          />
        ))}
      </main>
        {/* <img style={{height:'100%' , width:'100vw', opacity:'0.3',top:'0px',position:'absolute'}} src={'https://cdn.pixabay.com/photo/2022/07/09/18/42/boho-7311551_1280.png'} layout='fill'  /> */}
    </div>
  )
}