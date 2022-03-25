//**STORIES contains code for UI about listing stories. */

"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

// function generateStoryMarkup(story) {
//   // console.debug("generateStoryMarkup", story);

//   const hostName = story.getHostName();
//   return $(`
//       <li id="${story.storyId}">
//         <a href="${story.url}" target="a_blank" class="story-link">
//           ${story.title}
//         </a>
//         <small class="story-hostname">(${hostName})</small>
//         <small class="story-author">by ${story.author}</small>
//         <small class="story-user">posted by ${story.username}</small>
//       </li>
//     `);
// }Tried adding 2 functions but made sense to combine into one as seen below

function generateStoryMarkupAndDelete(story) {
  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);
  const showDeleteBtn = Boolean(currentUser);
  const username = localStorage.getItem("username");
  if (story.username !== username){
    return $(`
      <li id="${story.storyId}">
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  } else {
    return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkupAndDelete(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** PART 2A/B: Submit new story from form logged in user fills out */
async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  const author = $("#new-author").val();
  const title = $("#new-title").val();
  const url = $("#new-url").val();
  const username = currentUser.username
  const storyData = {author, title, url, username};
  const story = await storyList.addStory(currentUser, storyData);
  const $story = generateStoryMarkupAndDelete(story);
  $allStoriesList.prepend($story);
  $submitForm.trigger('reset');
  $submitForm.hide();
}

$submitForm.on("submit", submitNewStory);


function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");
  $ownStories.empty();
  for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkupAndDelete(story);
      $ownStories.append($story);
    }

  $ownStories.show();
}

/** Put favorites list on page. */

function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");
  $favoriteStories.empty();
  for (let story of currentUser.favorites) {
      const $story = generateStoryMarkupAndDelete(story);
      $favoriteStories.append($story);
    }

  $favoriteStories.show();
  $navFavorites.show();
}

/** PART 3 favorite/unfavorite stories by logged in user */

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far"; //Font Awesome Star Solid/Regular
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

function toggleFav(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <b class="${starType} fa-star"></b>
      </span>`;
}

async function favUnfavStory(evt) {
  console.debug("favUnfavStory");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($tgt.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesList.on("click", ".star", favUnfavStory);

/**PART 4 Removing stories */

function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  putMyStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);