// if we have a current yt tab then it will show the video bookmark time stamp but when we are not in
// the yt vidoe it show this is not a yt video

export async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });
  
    return tabs[0];
}
