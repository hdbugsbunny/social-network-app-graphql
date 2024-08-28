import React, { Component } from "react";
import Image from "../../../components/Image/Image";
import "./SinglePost.css";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  };

  componentDidMount() {
    const postId = window.location.pathname.substring(1);
    const graphqlQuery = {
      query: `
        {
          userPost(id: "${postId}") {
            title
            content
            imageUrl
            creator {
              name
            }
            createdAt
          }
        }
      `,
    };
    fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Failed to fetch status");
        }
        this.setState({
          title: resData.data.userPost.title,
          author: resData.data.userPost.creator.name,
          image: `http://localhost:8080/${resData.data.userPost.imageUrl}`,
          date: new Date(resData.data.userPost.createdAt).toLocaleDateString(
            "en-US"
          ),
          content: resData.data.userPost.content,
        });
      })
      .catch((err) => {
        console.log("🚀 ~ SinglePost ~ componentDidMount ~ err:", err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
