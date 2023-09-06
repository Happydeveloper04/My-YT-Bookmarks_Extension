// we want to do here is listen to any updates in our tab system and
// find the most recent tab and see if it is a yt page
chrome.tabs.onUpdated.addListener((tabId,tab) =>{
    // every yt vidoe has an url of yt.com/watch
    if(tab.url && tab.url.includes("youtube.com/watch")){
       
        //after watch ?v  that will be youy unique to store value uniquely
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);

        // console.log(urlParameters);

        //final thing -  we will send a mesage to content script
        // that unique video url we saw in video

        chrome.tabs.sendMessage(tabId,{
            type : "NEW",
            videoId: urlParameters.get("v"),
        });
    }
});


// now in our content script , we're going to add a listener that is going to listen to any of these incoming messages




