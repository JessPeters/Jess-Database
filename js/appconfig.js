var app = angular.module('myApp', ['ngTagsInput', 'ui.bootstrap'])
    .config([
        '$compileProvider',
        function($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data|file):/);
        }
    ])
    .filter('multiJobFilter', function() {
        return function(input, searchText) {
            if(!searchText) return input;
            var getSearchTermsFromJob = function(job) {
            	var searchTerms = [job.name, job.number.toString()]
            	job.tags.forEach(function(tag) {
            		searchTerms.push(tag.text);
            	});
                return searchTerms;
            };
        
            var itemContainsAllSearchTerms = function(job, searchTextSplit) {
                var searchTerms = getSearchTermsFromJob(job);
                return searchTextSplit.every(function(curSearchText) {
                    return searchTerms.some(function(curSearchTerm) {
                        return curSearchTerm.toLowerCase().indexOf(curSearchText) !== -1;
                    });
                });
            };

                                     
            var searchTextSplit = searchText.toLowerCase().split(' ');
            return input.filter(function(item) {
                return itemContainsAllSearchTerms(item, searchTextSplit);   
            });
        }
    });
