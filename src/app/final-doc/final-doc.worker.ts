/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  convertImgToBase64(data);
});


function convertImgToBase64(data) {
  toDataURL(data.url, (convertedurl) => {
    let x = convertedurl.split(';')
    let convertedObj={
      url:`data:image/png;${x[1]}`,
      index:data.index,
      type:data.type
    }
    console.log(convertedObj);
    postMessage(convertedObj);
  })
}

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
      console.log('test--->', reader);
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}