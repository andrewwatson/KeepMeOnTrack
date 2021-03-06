
var running = false;


$.when( $.ready ).then(function() {

  var dropbox;

  dropbox = document.getElementById("dropbox");
  dropbox.addEventListener("dragenter", dragenter, false);
  dropbox.addEventListener("dragover", dragover, false);
  dropbox.addEventListener("drop", drop, false);

  $("#startButton").on('click', handleStartButton);
  $("#stopButton").attr('disabled', true);

  $("#stopButton").on('click', handleStopButton);
  $("#stepButton").on('click', rollUp);

});

function handleStopButton() {
  $(this).attr('disabled', true);
  $("#startButton").attr('disabled', false);
  running = false;
}

function handleStartButton() {

  $(this).attr('disabled', true);
  $("#stopButton").attr('disabled', false);

  var nextRow = $("#tableBody tr:first-child");
  var lastCell = $("#tableBody tr:first-child td:last-child");

  running = true;
  console.log(lastCell.text());
}

function rollUp() {
  $("#tableBody tr:first-child").remove();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(
    files,
    function(csvData) {

      $("#scheduleform").fadeOut(500, function() {

        $("#times").fadeIn(500, function() {
          $("#controls").fadeIn(500);
        });
      });

      var lines = csvData.split('\n');

      $("#pagetitle").text(lines[0]);
      for(var line = 1; line < lines.length; line++){

        if (lines[line] !== "") {
          var columns = lines[line].split(",");

          newRow = "<tr class="+ columns[1] +"><td>" + columns[0] + "</td><td>" + columns[1] + "</td><td>" + columns[2] + "</td><td>" + columns[3] + "</td></tr>"
          $(newRow).appendTo('#tableBody');
        }
      }

    },
    function(errorString) {
      $("#alert").text(errorString);
      $("#alert").fadeIn(200);
    }
  );
}

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function handleFiles(files, successCallback, failCallBack) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    var imageType = /^text\/csv/;

    if (!imageType.test(file.type)) {
      failCallBack("You must use CSV files only!");
      return;
    }

    var scheduleTable = document.getElementById('timetable');

    var reader = new FileReader();
    reader.onload = (function(schedule) {

      return function(e) {
        successCallback(this.result);
      };

    })(scheduleTable);

    reader.readAsText(file);

  }
}
