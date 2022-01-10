const http = require('http');
// a simple TeX-input example
let mjAPI = require("mathjax-node");
mjAPI.config({
  MathJax: {
    // traditional MathJax configuration
  }
});
mjAPI.start();

port = 23456;

let server = http.createServer(function (request, response) {
  const { url } = request;
  if (url.search(/^\/\?latex=/) < 0) {
    response.statusCode = 404
    response.end()
    return;
  }

  const params = new URLSearchParams(url.substring(2));
  const myMath = decodeURI(params.get('latex'));
  console.log(myMath);

  mjAPI.typeset({
    math: myMath,
    format: "TeX", // or "inline-TeX", "MathML"
    svg: true,      // or svg:true, or html:true
  }, function (data) {
    if (!data.errors) {
      //回调数据
      response.setHeader("content-disposition", "attachment;filename=latex.svg")
      response.write(data.svg)
      response.end()
    }
  });
})

server.listen(port, '0.0.0.0')
console.log("Listening at http://localhost:4000")