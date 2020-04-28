
//module is an obj and we can create some reuseable method here by using exports.

exports.getDate =function(){
  const today = new Date();

  const options ={
    weekday: "long",
    day: "numeric",
    month:"long"
  }
//function that genernate a date by giving some options input
  return today.toLocaleString("en-US", options);

}

exports.getDay =function(){
  const today = new Date();

  const options ={
    weekday: "long",
  }

  return today.toLocaleString("en-US", options);
}
