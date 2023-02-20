import { Component } from "react";
import "./styles.css";

import { Posts } from "../../components/Posts";
import { loadPosts } from "../../utils/load-posts.js";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/TextInput";

export class Home extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postPerPage: 10,
    searchValue: "",
  };

  async componentDidMount() {
    await this.loadPosts();
  }
  loadPosts = async () => {
    const { page, postPerPage } = this.state;
    const postsAndPhotos = await loadPosts();
    this.setState({
      posts: postsAndPhotos.slice(page, postPerPage),
      allPosts: postsAndPhotos,
    });
  };
  loadMorePosts = () => {
    const { page, postPerPage, allPosts, posts } = this.state;
    const nextPage = page + postPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postPerPage);
    posts.push(...nextPosts);
    this.setState({ posts, page: nextPage });
  };
  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });
  };

  render() {
    const { posts, page, postPerPage, allPosts, searchValue } = this.state;
    const noMorePosts = page + postPerPage >= allPosts.length;

    const filteredposts = !!searchValue?
    allPosts.filter(post => {
      return post.title.toLowerCase().includes(
        searchValue.toLowerCase()
        )
        //inclides e ele contem no caso vai pegar todos os titulos dos post e ver se tem oque esta escrito em searchValue  caso tenha ele vai ser filtrado e retornado em uma lista abaixo ^^
    })
    :posts;

    return (
      <section className="container">
      <div className="search-container">
        {!!searchValue && (
            <h1>Search value:{searchValue}</h1>
        )}

       <TextInput searchValue={searchValue} handleChange={this.handleChange}/>
       </div>
        {filteredposts.length>0 &&(
        <Posts posts={filteredposts} />
        )}
        {filteredposts.length === 0 &&(
        <p>Não existem posts =(</p>
        )}
        <div className="button-container">
          {!searchValue && (
            <Button
              text="Load more posts"
              onClick={this.loadMorePosts}
              disabled={noMorePosts}
            />
          )}
        </div>
      </section>
    );
  }
}
