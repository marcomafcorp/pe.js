/// <reference path='../pe2.d.ts' />
/// <reference path='mscorlib.ts' />

declare var startPageLoading: number;

module pe.tool {

  function getTime() {
    if (Date.now)
      return Date.now();
    else
      return new Date().getTime();
  }
  
  function beginProcessHeaders(buffer: Uint32Array) {
    var ctx = new pe.LoaderContext();
    var reader = ctx.beginRead('mscorlib.dll');
    reader.parseNext(buffer, 0, buffer.length);
  }
  
  export function init() {
    try {
      var mscStart = getTime();
      var pageLoadTime = (mscStart - startPageLoading)/1000;
      log('page '+pageLoadTime+'s.');
  
      pe.tool.loadMscorlib(
        (buffer: Uint32Array, error: Error) => {
          var mscTime = (getTime() - mscStart)/1000;
          if (error) {
            log(error+' '+error.message+' '+mscTime+'s.');
          }
          else {
            log('mscorlib['+buffer.length+'] '+buffer[0].toString(16).toUpperCase()+'h '+mscTime+'s.');
            beginProcessHeaders(buffer);
          }
        },
        25,
        log);
    }
    catch (error) {
      alert(error+' '+error.message);
    }
  
    function log(txt) {
      var logElement = document.createElement('div');
      if ('textContent' in logElement)
        logElement.textContent = txt;
      else if ('innerText' in logElement)
        logElement.innerText = txt;
      document.body.appendChild(logElement);
      
      if (logElement.scrollIntoView)
        logElement.scrollIntoView();
    }
  }

}

window.onload = pe.tool.init;
