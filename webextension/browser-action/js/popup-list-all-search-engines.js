/**
 * Created by Deekshith Allamaneni on 11/28/15.
 * Copyright 2016 Deekshith Allamaneni
 */

"use strict";

function getDefPrefsRestorePopupListAllSearchEnginesOptions () {
    textFileLoad(chrome.extension.getURL("../../data/data.json")).then(function(response) {
        chrome.storage.local.get({
            user_config: response
        }, function (items) {
            restoreListAllSearchEnginesPopupOptions(
                new UserConfig(JSON.parse(items.user_config))
            );
        });
    }, function(Error) {
        console.log(Error);
    });
}

function restoreListAllSearchEnginesPopupOptions (thisUserConfig) {
    function processSearchEngineButtonClick(thisEvent) {
        if (thisEvent.target !== thisEvent.currentTarget) {
            let searchButtonID = thisEvent.target.id;
            if (searchButtonID !== null && searchButtonID.startsWith("search-item-open-in-tab-")){
                let searchUrl = thisUserConfig.getSearchEngineById(
                    thisEvent.target.getAttribute("search-id")
                ).api.replace(/\%s/,encodeURIComponent(thisUserConfig.getLastSearchInput()));
                chrome.tabs.query( { active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.update(tabs.id, {
                        url: searchUrl
                    });
                });
            } else if (thisEvent.target.classList.contains("btn-pin-this-item")) {
                let thisSearchID = thisEvent.target.getAttribute("search-id");
                thisUserConfig.toggleSearchEnginePinnedById(thisSearchID);
                let pinnedToggleBtnNode = document.getElementById("search-item-pinned-toggle-"+thisSearchID);

                pinnedToggleBtnNode.classList.remove("icon-heart");
                pinnedToggleBtnNode.classList.remove("icon-heart-empty");
                let thisSearchItem = thisUserConfig.getSearchEngineById(thisSearchID);
                pinnedToggleBtnNode.classList.add(thisSearchItem.pinned? "icon-heart": "icon-heart-empty");
                pinnedToggleBtnNode.title=thisSearchItem.pinned? "Remove_from_favorites": "Add_to_favorites";

                chrome.storage.local.set({
                    user_config: JSON.stringify(thisUserConfig.getPreferences())
                }, function () {
                });
            }
            else if (thisEvent.target.classList.contains("btn-expand-this-item")) {
                //console.log("Target: ");
                let thisSearchID = thisEvent.target.getAttribute("search-id");
                // console.log(thisEvent.target);
                // console.log("Target Parents: ");
                // console.log(thisEvent.target.parentNode.parentNode.parentNode)
                let categoryListItem = thisEvent.target.parentNode.parentNode.parentNode
                //console.log(categoryListItem.getElementsByClassName("food-list")['length']);
                if (categoryListItem.getElementsByClassName("food-list")['length'] == 0) {
                  categoryListItem.appendChild(document.createRange().createContextualFragment(
                    `<ul class="food-list">
                      <li>Coffee</li>
                      <li>Tea</li>
                      <li>Milk</li>
                    </ul>`
                  ))
                } else {
                  categoryListItem.removeChild(categoryListItem.getElementsByClassName("food-list")[0])
              }
            }
        }
    }

    function generateSearchEngineListNodes(searchEngineList) {
        let searchEngineListFrag = document.createDocumentFragment();
        searchEngineList.forEach(searchEngineItem => {
            searchEngineListFrag.appendChild(document.createRange().createContextualFragment(
                `<div>
                <a id="search-item-open-in-tab-${generateUuid()}" search-id="${searchEngineItem.id}" class="main-pinned-item">
                     ${searchEngineItem.name}
                     <span class="pull-right">
                         <i class="btn btn-sm ${searchEngineItem.pinned? "icon-heart": "icon-heart-empty"} btn-pin-this-item" search-id="${searchEngineItem.id}" id="search-item-pinned-toggle-${searchEngineItem.id}"
                             title=${searchEngineItem.pinned? "Unfavorite": "Favorite"}></i>
                         <i class="btn btn-sm btn-expand-this-item fa fa-arrow-down" search-id="${searchEngineItem.id}" id="main-item-menu" title="caption"></i>
                     </span>
                 </a>
                 </div>`
            ));
        });
        return searchEngineListFrag;
    }

    let accordionNode = document.getElementById("accordion");
    while (accordionNode.firstChild) { // Delete all children previously rendered (but we dont expect any previous children)
        accordionNode.removeChild(accordionNode.firstChild);
    }
    accordionNode.appendChild(generateSearchEngineListNodes(thisUserConfig.getSearchEnginesByCategory("NetflixCategories")));
    document.getElementById("accordion").addEventListener("click", processSearchEngineButtonClick);

    let categoryItem = document.getElementById("main-item-menu")



}

document.addEventListener('DOMContentLoaded', getDefPrefsRestorePopupListAllSearchEnginesOptions);
