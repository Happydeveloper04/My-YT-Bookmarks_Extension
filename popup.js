import { getActiveTabURL } from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarks, bookmark)  => {
    // we aree going here to create two element one is going to be for title, which is going to display in the UI of each bookmark
    // second for whole bookmarks element that containn dekete play button
    const bookmarkTitleElement = document.createElement("div");
      // create an element that holds all our buttons
    const controlsElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");

  

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    controlsElement.className = "bookmark-controls";
    setBookmarkAttributes("play", onPlay,controlsElement);
    // after this append to a newbookmarkelement in line 28;
       // for del ->
       setBookmarkAttributes("delete", onDelete,controlsElement);
    
    newBookmarkElement.id = "bookmark-" + bookmark.time; 
    // so if you save any bookmark what,s goona hapoen is there is going to be a row assosciated eith new bookmark element 
    // uniquely identify each specific row 
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp",bookmark.time);

  

    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);
    bookmarks.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks = []) => {
    const BookmarkElement = document.getElementById("bookmarks");
    BookmarkElement.innerHTML = "";

    // if there are any bookmarks let just set it to nothing
    //if curent bookmark length is greter than zero -- iterate overevery bomalkrs in aloop and then we are
    // going to grab the bookmarks un the curret indexing 
    if(currentBookmarks.length > 0){
        for(let i = 0; i< currentBookmarks.length;i++){
            const bookmark = currentBookmarks[i];
            addNewBookmark(BookmarkElement,bookmark)
        }
    } else{
        // else a messgae there is no bookmark o show
        BookmarkElement.innerHTML = '<i class = "row"> No bookmarks to show </i>';
    }
    return;
};

const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    //grab the active tab
    const activeTab = await getActiveTabURL();

    chrome.tabs.sendMessage(activeTab.id,{
        type: "PLAY",
        value : bookmarkTime
    });
};

const onDelete = async e => {
    
    const activeTab = await getActiveTabURL();
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const BookmarkElementToDelete = document.getElementByid("bookmark-" + bookmarkTime);

    BookmarkElementToDelete.parentNode.removeChild(BookmarkElementToDelete);

    // send mesge to prform a deletion
    chrome.tabs.sendMessage(activeTab.id,{
        type : " DELETE",
        value : bookmarkTime
    }, viewBookmarks)
    // viewbookmak just a call back func optionally  tjats going tp refresh  our bookmark, so many deletion 
    // shown uop immdeiately, then in our content

};

const setBookmarkAttributes =  (src , eventlistener, controlParentElement) => {
    const controlElement = document.createElement("img");
  // controol element will be linked to a image
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventlistener);
    controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
      // to get the active tab
    const activeTab = await getActiveTabURL();
     // to get the video with  unique identifier
    const queryParameters = activeTab.url.split("?")[1];
    //url search prams to get unique idntofier
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");
// any active tab yt video contains yt.watch
    if(activeTab.url.includes("youtube.com/watch") && currentVideo){
        chrome.storage.sync.get([currentVideo],(data) => {
            const cuurentVideoBoomarks = data[currentVideo] ? JSON.parse(data[currentVideo]): [];

            viewBookmarks(cuurentVideoBoomarks);
        })

    }else{
              // if there is any bookmark int the video then it will so that otherwise an empty array
      // else condition when we are in a  youtube video page
      // then it will say a msg to that this is not a yt video
        const container = document.getElementsByClassName("container")[0];

        container.innerHTML = '<div class = "tittle"> This is not a youtube video page</>'
    }
});

// now  to make play  button for time stamp that we hace saved for each video to start off, 
//function or eventlistener that will perform the logic tpo set a vido at particular timestamo