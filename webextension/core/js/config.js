/**
 * Created by Deekshith Allamaneni on 11/23/15.
 * Copyright 2016 Deekshith Allamaneni
 */

"use strict";

function UserConfig (userPreferencesJSON) {
    this.userPreferencesJSON_ = userPreferencesJSON;
}

UserConfig.prototype.getUserPrefVersion = function() {
    return this.userPreferencesJSON_.user_preferences.version;
};

UserConfig.prototype.isExtensionEnabled = function() {
    return this.userPreferencesJSON_.user_preferences.extension_enable;
};

UserConfig.prototype.setExtensionEnable = function (userInput) {
    if(typeof(userInput) !== "boolean") {console.log("Invalid input params"); return false;}
    this.userPreferencesJSON_.user_preferences.extension_enable = userInput;
    return true;
};

UserConfig.prototype.getSearchEngineCategories = function () {
    let searchEngineCategories = this.userPreferencesJSON_.search_engines
        .map(eachSearchEngine => eachSearchEngine.category);
    return Array.from(new Set(searchEngineCategories));
};

UserConfig.prototype.getSearchEnginesByCategory = function (searchEngineCategory) {
    return this.userPreferencesJSON_.search_engines
        .filter(eachSearchEngine => eachSearchEngine.category === searchEngineCategory);
};

UserConfig.prototype.getLastSearchInput = function () {
    return this.userPreferencesJSON_.user_data.last_search_input;
};

UserConfig.prototype.setLastSearchInput = function (searchInput) {
    this.userPreferencesJSON_.user_data.last_search_input = searchInput;
};

UserConfig.prototype.isInitialSetupCompleted = function () {
    let initialSetupCompleted = this.userPreferencesJSON_.user_data.completed_initial_setup;
    return (initialSetupCompleted != null)? initialSetupCompleted: false;
};

UserConfig.prototype.setInitialSetupCompleted = function (isCompletedFlag) {
    this.userPreferencesJSON_.user_data.completed_initial_setup = isCompletedFlag;
};

UserConfig.prototype.assignUniqueIDsToAllSearchEngines = function () {
    return this.userPreferencesJSON_.search_engines
        .map(eachSearchEngine => {
            eachSearchEngine.id = generateUuid();
            return eachSearchEngine;
        });
};

UserConfig.prototype.getPrivacyCollectStatsStatus = function () {
    return this.userPreferencesJSON_.user_preferences.privacy.collect_stats;
};
UserConfig.prototype.setPrivacyCollectStatsStatus = function (userInput) {
    if(typeof(userInput) !== "boolean") {console.log("Invalid input params"); return false;}
    this.userPreferencesJSON_.user_preferences.privacy.collect_stats = userInput;
};
UserConfig.prototype.getPreferences = function () {
    return this.userPreferencesJSON_;
};
