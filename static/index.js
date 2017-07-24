function setupWordCloud(frequencies) {
    var setScale = function (element, scale){
      element.style.transform = "scale(" + scale + ")";
    };
    var options =
    {
      rotateRatio: 0,
      list : frequencies,
      gridSize: Math.round(16 * $("#chart").width() / 1024),
      weightFactor: function (size) {
        return Math.pow(size, 1.9) * $("#chart").width() / 1024;
      },
      hover: function(item, dim, event, spans){
          if(spans)
            setScale(spans[0], 1.5);
      },
      hoverRelease: function(spans) {
          if(spans)
            setScale(spans[0], 1);
      },
      click: function(item) {
        var clickedWord = item[0];
        $("#search-query").val(clickedWord);
        $("#search-query-form").submit();
      }
    };
    WordCloud(document.getElementById('chart'), options);

    function onWordCloudStop(){
        var elements = $("#chart").find("span");
        elements.css("transition", "transform 0.3s ease-out");
        elements.css("cursor", "pointer");
    }

    // element creation is delayed so I need to wait for the wordcloudstop event
    document.getElementById('chart').addEventListener('wordcloudstop', onWordCloudStop)
}

Array.max = function(array){
    return Math.max.apply(Math, array);
};

Array.min = function(array){
    return Math.min.apply(Math, array);
};

function getValues(object){
    var values = [];
    for(var i in object)
        values = values.concat(object[i][1]);
    return values;
}

function capWeights(weights){
    var values = getValues(weights);
    var valueMin = Array.min(values);
    var valueMax = Array.max(values);
    var valueSpread = valueMax - valueMin;
    var cappedWeights = [];
    // freqRangeの最小値が3以下だとIssue #14が発生する
    var capRange = [4, 10];
    var capMin = capRange[0];
    var capSpread = capRange[1] - capRange[0];
    for(var i in weights){
        var w = weights[i];
        var k = w[0];
        var v = w[1];
        var fraction = 0.5;
        if(valueSpread)
            fraction = (v - valueMin) / valueSpread;
        v = capMin + (capSpread * fraction);
        cappedWeights = cappedWeights.concat([[k, v]])
    }
    return cappedWeights;
}

function setupSearch(){
    function createSearchResultNode(datum){
        var node = $("#search-result-template").find("#search-result-row").clone();
        node.find("#search-result-user").text(datum.user);
        node.find("#search-result-tweet").text(datum.text);
        return node;
    }

    function populateSearchResults(data){
      var searchView = $("#search-view");
      searchView.empty();
      for(var i in data)
          searchView.append(createSearchResultNode(data[i]));
    }

    function sendQuery(){
        $.ajax({
               dataType: "json",
               type: "POST",
               url: "search",
               data: $(this).serialize(),
               success: populateSearchResults
             });
    }

    var searchQueryForm = $("#search-query-form");
    searchQueryForm.submit(function(e) {
        $('#modal').modal('show');
        $("#modal-search-query").val($("#search-query").val());
        sendQuery();
        e.preventDefault();
    });

    var modalSearchQueryForm = $("#modal-search-query-form");
    modalSearchQueryForm.submit(function(e) {
        sendQuery();
        e.preventDefault();
    });
}

function onLoad(weights){
    setupWordCloud(capWeights(weights));
    setupSearch();
}
