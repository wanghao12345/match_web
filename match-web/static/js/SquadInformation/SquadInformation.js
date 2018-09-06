function getDate(num){
  var date = new Date().getHours(),dateArr = [],d;
  for(var i=1;i<=num;i++){
    d = date-i
    if(d<0){d += num}

    dateArr[num-i] = addZero(d) + ":00";
  }
  return dateArr
}
function addZero(num){
    if(num<10){
      return "0"+num;
    }else{
      return num;
    }
  }