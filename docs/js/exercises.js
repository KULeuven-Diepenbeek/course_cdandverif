function toggleExercise(id) {
  if( id.charAt(id.length-1) == 'p') {
    var targetid = id.substr(0,id.length-1) + 'a';
  } else {
    var targetid = id.substr(0,id.length-1) + 'p';
  }
  document.getElementById(id).parentElement.classList.add("hide_answer");
  document.getElementById(targetid).parentElement.classList.remove("hide_answer");
}



function toggleAnswer(clicked_id) {
  let clicked_button = document.querySelector("#"+clicked_id);
  let solution = clicked_button.previousElementSibling;
  solution.classList.toggle('hiddenSolution');
}
