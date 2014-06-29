function JobController($scope, $q, $http, $modal) {
    var createJobViewModel = function(jobmodel) {
        jobmodel.isEditing = false
        jobmodel.isExpanded = false
        jobmodel.tags = jobmodel.tags.map(function(tag) {
            return {
                text: tag
            }
        })

        if(jobmodel.startdate)
            jobmodel.startdate = new Date(Date.parse(jobmodel.startdate));
        if(jobmodel.enddate)
            jobmodel.enddate = new Date(Date.parse(jobmodel.enddate));
        return jobmodel;
    }

    var createJobModel = function(jobviewmodel) {
        return {
            number: jobviewmodel.number,
            name: jobviewmodel.name,
            folder: jobviewmodel.folder,
            startdate: jobviewmodel.startdate,
            enddate: jobviewmodel.enddate,
            photofilepath: jobviewmodel.photofilepath,
            clientfaviconfilepath: jobviewmodel.clientfaviconfilepath,
            activejob: jobviewmodel.activejob,
            tags: jobviewmodel.tags.map(function(tag) {
                return tag.text;
            }),
            description: jobviewmodel.description
        }
    }

    $scope.PreviousClickWasExpansion = true;

    $scope.jobs = jobs.map(function(jobmodel) {
        return createJobViewModel(jobmodel)
    })

    $scope.categories = categories;
    $scope.newjob = {};
    $scope.numberPredicate = '-number'
    $scope.activeJobPredicate = '-activejob'
    $scope.addjob = function() {
        $scope.jobs.push({
            number: 0,
            name: "New Job",
            isEditing: true,
            isExpanded: true,
            activejob: false,
            tags: [],
        });
    };
    var deletejob = function(job) {
        var index = $scope.jobs.indexOf(job);
        $scope.jobs.splice(index, 1);
    }
    $scope.getTagsMatchingQuery = function($query) {
        tags = []
        $scope.jobs.forEach(function(job) {
            job.tags.filter(function(tag) {
                return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1
            }).forEach(function(tag) {
                tags.push(tag);
            });
        });
        var deferred = $q.defer();
        deferred.resolve(tags)
        return deferred.promise;
    };
    $scope.setSearchText = function(text) {
        $scope.searchtext = text;
    };
    $scope.getphotopathforjob = function(job) {
        if (job.photofilepath)
            return job.photofilepath;
        else
            return 'img/backup.png'
    };
    $scope.opentarget = function(target) {
        $http.post('/open', {
            "target": target
        })
    };

    $scope.savejobs = function(jobViewModels) {
        var jobmodels = jobViewModels.map(function(jobviewmodel) {
            return createJobModel(jobviewmodel)
        })
        $http.post('/save', jobmodels)
    };

    $scope.$watch('jobs', $scope.savejobs, true)
    $scope.openConfirmDeleteModal = function(job) {
        var modalInstance = $modal.open({
            templateUrl: 'templates/confirmDeleteModal.html',
            size: 'sm',
        });
        modalInstance.result.then(function(shouldDelete) {
                deletejob(job);
            },
            function() {});
    };

    $scope.editJob = function(job) {
        job.isExpanded = true
        job.isEditing = true
    };
    $scope.openTimesheet = function() {
        $http.post('/openTimesheet')
    };

    $scope.expandAll = function(jobViewModels) {
        jobViewModels.forEach(function(jobViewModel) {
            jobViewModel.isExpanded = true
        });
        $scope.PreviousClickWasExpansion = true
        
    };
    $scope.collapseAll = function(jobViewModels) {
        jobViewModels.forEach(function(jobViewModel) {
            jobViewModel.isExpanded = false;
            
        });
        $scope.PreviousClickWasExpansion = false
        
    };

    $scope.orderToggle = function(predicate) {
        if (predicate == '') {
            return predicate;
        }
        if (predicate[0] == '+') {
            return predicate.replace('+', '-');
        }
        if (predicate[0] == '-') {
            return predicate.replace('-', '+');
        }

    }

    $scope.toggleActiveFilter = function(activeJobPredicate) {
        if (activeJobPredicate !== '') {
            $scope._oldActiveJobPredicate = activeJobPredicate;
            return '';
        }
        else {
            return $scope._oldActiveJobPredicate;
        } 

    }
    $scope.resourceTypeClass = function(currentLinkType) {
        if (currentLinkType == 'link') {
            return 'resource-bullet-link'
        }
        if (currentLinkType == 'website') {
            return 'resource-bullet-website'
        }
        else {
            return 'resource-bullet-no-type'
        }
    }
}