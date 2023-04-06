var controlContent = null;
var bHideGobackButton = 0;

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

bHideGobackButton = getUrlParam("flag");
if (bHideGobackButton == null) {
    bHideGobackButton = 1;
}

function playerOnLoad(sender, args)
{
  document.getElementById("szReachPlayer").settings.MaxFrameRate = 90;
  controlContent = sender.getHost().content;
  showGobackButton();
}

function showGobackButton()
{
  var sUrl = new String(location);
  sUrl = sUrl.substring(0, 4);

  if ((sUrl != "http") || (bHideGobackButton == 1))
  {
      controlContent.findName('GoBackButton').Visibility = "Collapsed";
  }
}

function fnGoBackLive(sUrl)
{
	window.location = sUrl;
}

function onSilverlightError(sender, args)
{
	var appSource = "";
	if (sender != null && sender != 0) {
		appSource = sender.getHost().Source;
	}
	var errorType = args.ErrorType;
	var iErrorCode = args.ErrorCode;

	if (errorType == "ImageError" || errorType == "MediaError")
		return;

	var errMsg = "Silverlight unsettled error " +	appSource + "\n" ;

	errMsg += "Code: "+ iErrorCode + "\n";
	errMsg += "Category: " + errorType + "\n";
	errMsg += "Message: " + args.ErrorMessage + "\n";

	if (errorType == "ParserError")
	{
		errMsg += "File: " + args.xamlFile + "\n";
		errMsg += "Line: " + args.lineNumber + "\n";
		errMsg += "Position: " + args.charPosition + "\n";
	}
	else if (errorType == "RuntimeError")
	{
		if (args.lineNumber != 0)
		{
			errMsg += "Line: " + args.lineNumber + "\n";
			errMsg += "Position: " +	args.charPosition + "\n";
		}
		errMsg += "MethodName: " + args.methodName + "\n";
	}

	throw new Error(errMsg);
}