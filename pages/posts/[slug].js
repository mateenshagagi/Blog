import styles from "../../styles/Slug.module.css";
import { GraphQLClient, gql } from "graphql-request";

const graphcms = new GraphQLClient(
  "https://api-us-west-2.hygraph.com/v2/clj3g0ogl0d6x01t93u4n1rus/master"
);

const QUERY = gql`
    query Post($slug: String!){
        post(where: {slug: $slug}){
            id,
            title,
            slug,
            datePublished,
            author{
                id,
                name,
                avatar{
                    url
                }
            }
            content{
                html
            }
            coverPhoto{
                id
                url
            }
        }
    }
`;

const SLUGLIST = gql`
    {
        posts{
            slug
        }
    }
`;

export async function getStaticPaths(){
    const {posts} = await graphcms.request(SLUGLIST);
    return {
        paths: posts.map((post) => ({params : {slug: post.slug}})),
        fallback: false,
    };
}


export async function getStaticProps({params}) {
    const slug = params.slug;
    const data = await graphcms.request(QUERY, {slug});
    const post = data.post
  return {
    props: {
      post,
    },
    revalidate: 10,
  };
}

export default function BlogPost({post}){
    return(
        <main className={styles.blog}>
            <img src={post.coverPhoto.url} className={styles.cover} priority="true" alt='' />
            <div className={styles.title}>
                <img src={post.author.avatar.url} width="100" height="100" alt="" />
                <div className={styles.authText}>
                    <h6>By {post.author.name}</h6>
                    <h6 className={styles.data}>{post.datePublished}</h6>
                </div>
            </div>
            <h2>{post.title}</h2>
            <div className={styles.content} dangerouslySetInnerHTML={{__html: post.content.html}}>
            </div>
        </main>
    )
}