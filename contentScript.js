(() =>{
   let youtubeLeftControls, youtubePlayer;
   //one for accesing youtube player and one for accesig te control
    let currentVideo = "";  // emptystrig but works when mesag egot recieves
    let currentVideoBookmarks =[];

    // to resol ve this asynchrosally
   const fetchBookmarks = () =>{
      return new Promise((resolve) => {
         chrome.storage.sync.get([currentVideo],(obj) => {
            // basically look in storage to see if our current video has any bookmarks, or it it exist in storage
            //thats what happent ,,... if ot does not exist we're to going to JSON dot parse  if it dosrs not exist we w
            //will return an empty array
   
            resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]):[]);
   
         });
      });
     };

     const addNewBookmarkEventHandler = async () => {
      const currentTime = youtubePlayer.currentTime;
      const newBookmark = {
         time : currentTime,
         desc: "Bookmark at " + getTime(currentTime),
         // gettime func help us to convert second into time
   
      };
   
      currentVideoBookmarks = await fetchBookmarks();
      // now what we are going to do is set crome storage wit each bookmark
      // each video with its video identification number will also map back to set up a book in chrome storage sync
   
     
   
   
      chrome.storage.sync.set({
        [currentVideo]: JSON.stringify([...currentVideoBookmarks,newBookmark].sort((a,b) => a.time-b.time))
      });
   
      //sort on basis of saved timestamp in their storage
     };
      //create a function named  newVideoLoaded
   const newVideoLoaded = async () => {
      // so we're going to do is to grab the first element that matches its class name
      // and iy's just going to exist on every single youtube vidoo page
      const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
      currentVideoBookmarks = await fetchBookmarks();
     //  console.log(bookmarkBtnExists);
      
      if(!bookmarkBtnExists){
         // so we are gooing to create an image element that is going to be  the image we click on for bookmark buttons
         const bookmarkBtn = document.createElement("img");
         // image
        
         bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
         bookmarkBtn.className =  "ytp-button" + "bookmark-btn";
         // also oon hoveer there is a title also
         bookmarkBtn.title = "Click to boomark current timestamp";
   
         // next we going to get a way to grab youtue controls
         //s o we can add a bookmark button
   
         youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
         youtubePlayer= document.getElementsByClassName('video-stream')[0];
   
         youtubeLeftControls.appendChild(bookmarkBtn);
   
         // add a listebner
         bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
   
   
      }
     };
    
   
 
   chrome.runtime.onMessage.addListener((obj,sender,response) => {
      // when a meesge is being sent to the content script, we can  also send a respose back where
      // the message is coming from
      //destructuring the values-
      const { type, value, videoId} =obj;
 
      if(type === "NEW"){
         currentVideo = videoId;
         newVideoLoaded();
      }
      else if(type == "PLAY"){
         youtubePlayer.currentTime = value;
      }
      else if(type == " DELETE"){
         currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
         // chrome storage -> so  if this page reloads , this deleted boommark di=oes not show up
         chrome.storage.sync.set({[currentVideo]: JSON.stringify(currentVideoBookmarks)});
              // last thing we want to do  is add a way to send the updated bookmark back to our POPup.js file in order to display the most recent bookmark
         response(currentVideoBookmarks);
      }

 
 
      // set current video as a top level variable
       
   });
   newVideoLoaded();

 })();
  const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);
 
    return date.toISOString().substring(11,8);
  };