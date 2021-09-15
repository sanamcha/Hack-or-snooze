"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */
  class Story {
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    // UNIMPLEMENTED: complete this function!
    //return "hostname.com";
    //added
    return new URL(this.url).host;
  }
}

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  static async getStories() {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });
    const stories = response.data.stories.map(story => new Story(story));
    return new StoryList(stories);
  }

  //async addStory( /* user, newStory */) {
    // UNIMPLEMENTED: complete this function!
    //added
  async addStory(user,{title, author, url}){
const token = user.loginToken;
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/stories`,
      data: { token, story: { title, author, url } },
    });

    const story = new Story(response.data.story);
    this.stories.unshift(story);
    user.myStories.unshift(story);

    return story;
  }
  async removeStory(user, storyId) {
    const token = user.loginToken;
    await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "DELETE",
      data: { token: user.loginToken }
    });

    this.stories = this.stories.filter(story => story.storyId !== storyId);

    user.myStories = user.myStories.filter(s => s.storyId !== storyId);
    user.favorites = user.favorites.filter(s => s.storyId !== storyId);
  }
}

class User {
  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                myStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    this.favorites = favorites.map(s => new Story(s));
    this.myStories = myStories.map(s => new Story(s));
    this.loginToken = token;
  }

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        myStories: user.stories
      },
      response.data.token
    );
  }

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        myStories: user.stories
      },
      response.data.token
    );
  }

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          myStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
// Add a story to the list 
//added
 async addFavorite(story) {
  this.favorites.push(story);
  await this._addOrRemoveFavorite("add", story)
}
// Remove a story to the list of user 
//added
async removeFavorite(story) {
  this.favorites = this.favorites.filter(f => f.storyId !== story.storyId);
  await this._addOrRemoveFavorite("remove", story);
}

//Update API with favorite/not-favorite.
//added
async _addOrRemoveFavorite(newState, story) {
  const method = newState === "add" ? "POST" : "DELETE";
  const token = this.loginToken;
  await axios({
    url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
    method: method,
    data: { token },
  });
}
//added
isFavorite(story) {
  return this.favorites.some(s => (f.storyId === story.storyId));
 }
}
