// ==UserScript==
// @name         Animeheaven Enhanced
// @version      2.0
// @description  Autoplay, fullscreen and keyboard controls for "animeheaven.eu"
// @author       Bobocato
// @match        http://animeheaven.eu/watch.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function changeEpisode(url){
        if(typeof(url) != "undefined"){
            window.location.href = url;
        } else {
            normalscreen();
        }
    }

    function setControlOpacity1(){
        document.getElementById("controls").style.opacity = "1";
    }

    function setControlOpacity0(){
        document.getElementById("controls").style.opacity = "0";
    }

    function fullscreen(){
        //Set fullscreen to style
        //Video Style
        var videoDiv = document.getElementById("videocon");
        videoDiv.style.position = "fixed";
        videoDiv.style.top = "0";
        videoDiv.style.left = "0";
        videoDiv.style.width = "100%";
        videoDiv.style.height = "100%";
        videoDiv.style.maxHeight = "5000px";
        //Control Style
        var controlDiv = document.getElementById("controls");
        controlDiv.style.position = "absolute";
        controlDiv.style.bottom = "15px";
        let left = (window.innerWidth - controls.clientWidth) /2;
        controlDiv.style.left = left + "px";
        controlDiv.addEventListener("mouseenter", setControlOpacity1, false);
        controlDiv.addEventListener("mouseleave", setControlOpacity0, false);
        setControlOpacity0();
    }

    function normalscreen(){
        //Reset CSS
        //Video Style
        var videoDiv = document.getElementById("videocon");
        videoDiv.style.position = "";
        videoDiv.style.top = "";
        videoDiv.style.left = "";
        videoDiv.style.width = "";
        videoDiv.style.height = "";
        videoDiv.style.maxHeight = "";
        //Control Style
        var controlDiv = document.getElementById("controls");
        controlDiv.style.position = "";
        controlDiv.style.bottom = "";
        let left = (window.innerWidth - controls.clientWidth) /2;
        controlDiv.style.left = "";
        controlDiv.style.opacity = "";
        controlDiv.removeEventListener("mouseenter", setControlOpacity1, false);
        controlDiv.removeEventListener("mouseleave", setControlOpacity0, false);
    }

    function showCurrEpisode() {
        var currEp = -1;
        var prevLink = document.getElementsByClassName("prew2");
        if (prevLink.length != 1) {
            var nextLink = document.getElementsByClassName("next2");
            if (nextLink.length != 1) {
                console.log("Couldn't find current episode.");
                return;
            }
            let parts = nextLink[0].textContent.split(" ");
            currEp = parseInt(parts[parts.length - 1]) - 1;
        } else {
            let parts = prevLink[0].textContent.split(" ");
            currEp = parseInt(parts[parts.length - 1]) + 1;
        }

        var divToShow = document.createElement("span");
        divToShow.innerHTML = "Episode " + currEp;
        divToShow.style.fontSize = "300%";
        divToShow.style.position = "absolute";
        divToShow.style.top = ".75em";
        divToShow.style.left = "1em";
        divToShow.style.color = "white";
        divToShow.style.textShadow = "-1px 0 black, 0 1.5px black, 1.5px 0 black, 0 -1px black";
        var videoDiv = document.getElementById("videocon");
        videoDiv.style.position = "relative";
        videoDiv.appendChild(divToShow);
        setTimeout(function() { divToShow.parentElement.removeChild(divToShow); }, 5000);
    }

    console.log("Jump to Script");
    showCurrEpisode();
    //Get the needed variables...
    var video = document.getElementById("videodiv");
    var nextLink, prevLink;
    var links = document.getElementsByTagName("A");
    for(let i =0; i < links.length; i++){
        if(links[i].rel == "next"){
            nextLink = links[i].href;
        } else if(links[i].rel == "prev"){
            prevLink = links[i].href;
        }
    }
    //Was fullscreen used before?
    if(localStorage.getItem("fullscreen") === "true"){
        fullscreen();
    }
    //Video events
    //At the End
    video.onended = function() {
        changeEpisode(nextLink);
    };
    //Safe volume
    video.onvolumechange = function() {
        localStorage.setItem("volume", video.volume);
    };
    //Set volume and playbackrate as soon as video starts playing
    video.onplaying = function() {
        if (localStorage.getItem("volume") !== null){
            video.volume = localStorage.getItem("volume");
        }
        if (localStorage.getItem("playrate") !== null){
            video.playbackRate = localStorage.getItem("playrate");
        }
        //Safe Playback Rate
        video.onratechange = function() {
            localStorage.setItem("playrate", video.playbackRate);
        };
    };
    document.addEventListener("keydown", keyDownTextField, false);
    function keyDownTextField(e){
        var search = document.getElementsByClassName("searchinput")[0];
        if(document.activeElement !== search){
            switch(e.which) {
                case 86: // "v"
                    if (localStorage.getItem("fullscreen") === null){
                        localStorage.setItem("fullscreen", true);
                        fullscreen();
                        console.log("Fullscreen enabled");
                    } else {
                        localStorage.removeItem("fullscreen");
                        normalscreen();
                        console.log("Fullscreen disabled");
                    }
                    break;
                case 66: // "b"
                    changeEpisode(prevLink);
                    break;
                case 78: // "n"
                    changeEpisode(nextLink);
                    break;
                case 38: // "Arrow Up"
                    try{
                        video.volume = (Math.round((video.volume + 0.05)*100))/100;
                    } catch (err){}
                    console.log("Volume: " + (video.volume * 100) +"%");
                    break;
                case 40: // "Arrow Down"
                    try{
                        video.volume = (Math.round((video.volume - 0.05)*100))/100;
                    } catch (err){}
                    console.log("Volume: " + (video.volume * 100) +"%");
                    break;
                case 37: // "Arrow Left"
                    video.currentTime = video.currentTime - 5;
                    console.log("Current Time: " +(video.currentTime /60));
                    break;
                case 39: // "Arrow Right"
                    video.currentTime = video.currentTime + 5;
                    console.log("Current Time: " +(Math.round(video.currentTime /60)));
                    break;
                case 77: // "m"
                    video.currentTime = video.currentTime + 85;
                    console.log("Current Time: " +(Math.round(video.currentTime /60)));
                    break;
                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action
        } else if (e.which == 32) {
            search.value += " ";
            e.preventDefault();
        }
        return;
    }

})();