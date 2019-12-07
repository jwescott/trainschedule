// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB0wrEB6sE8qA8gf5g-k9Iygq8h0CWSpdA",
    authDomain: "train-4a743.firebaseapp.com",
    databaseURL: "https://train-4a743.firebaseio.com",
    projectId: "train-4a743",
    storageBucket: "train-4a743.appspot.com",
    messagingSenderId: "90084238237",
    appId: "1:90084238237:web:188cbb174540a1d9e54574"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var startTime = $("#startTime").val().trim()
    var frequency = $("#frequency").val().trim();

    // Assume the following situations.

    // (TEST 1)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 3 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Use your brain first)
    // It would be 3:18 -- 2 minutes away

    // (TEST 2)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 7 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Use your brain first)
    // It would be 3:21 -- 5 minutes away


    // ==========================================================

    // Solved Mathematically
    // Test case 1:
    // 16 - 00 = 16
    // 16 % 3 = 1 (Modulus is the remainder)
    // 3 - 1 = 2 minutes away
    // 2 + 3:16 = 3:18

    // Solved Mathematically
    // Test case 2:
    // 16 - 00 = 16
    // 16 % 7 = 2 (Modulus is the remainder)
    // 7 - 2 = 5 minutes away
    // 5 + 3:16 = 3:21

    // Assumptions
    var tFrequency = frequency;

    // Time is 3:30 AM
    var firstTime = startTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment().format("hh:mm A"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        trainName: trainName,
        destination: destination,
        frequency: tFrequency,
        nextArrival: moment(nextTrain).format("hh:mm A"),
        minutesAway: tMinutesTillTrain
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.nextArrival);
    console.log(newTrain.minutesAway);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#trainName").val("");
    $("#destination").val("");
    $("#startTime").val("");
    $("#frequency").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var nextArrival = childSnapshot.val().nextArrival;
    var minutesAway = childSnapshot.val().minutesAway;

    // Employee Info
    console.log(trainName);
    console.log(destination);
    console.log(nextArrival);
    console.log(minutesAway);



    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway)
    );

    // Append the new row to the table
    $("tbody").append(newRow);
});