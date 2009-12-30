<%@page pageEncoding="UTF-8"%><%@page import="java.util.Hashtable, java.util.Enumeration, java.util.ArrayList, java.util.Collections, java.io.*, java.util.Calendar, java.util.SimpleTimeZone, java.lang.StringBuilder"%><%!

/****************************************************
* A starter version of a package service.
* You will probably want to rewrite this since I'm no java expert.
****/

private String readFileAsString(String filePath) throws java.io.IOException {
    byte[] buffer = new byte[(int) new File(filePath).length()];
	FileInputStream f = new FileInputStream(filePath);
    f.read(buffer);
    return new String(buffer);
}

/**
* Returns true if the specified filepath is allowed
* to be output in the Response.
*/
private Boolean inWhiteList(String filepath) {
	String path = filepath.toLowerCase();
	return path.indexOf("./") == -1 && 
			path.indexOf("~") == -1 &&
			path.startsWith("jquery") &&
			(
				path.endsWith(".js") ||
				path.endsWith(".css")
			);
}

%><%

// get all request parameter names in order of dependencies
Enumeration enumParamNames = request.getParameterNames();
ArrayList<String> sortedParamNames = new ArrayList<String>();
while (enumParamNames.hasMoreElements()) {
	sortedParamNames.add((String)enumParamNames.nextElement());
}
Collections.sort(sortedParamNames);

if (sortedParamNames.size() == 0) {
	response.sendError(HttpServletResponse.SC_NOT_FOUND);
	return;
}


	
// headers
// far future expires header
Calendar cal = Calendar.getInstance(new SimpleTimeZone(0, "GMT"));
cal.add(Calendar.YEAR, 10);
response.setDateHeader("Expires", cal.getTime().getTime() );

// contentType
String contentType = (request.getParameter(sortedParamNames.get(0))).toLowerCase().endsWith(".js") ?
	"text/javascript" : "text/css";
response.setContentType(contentType);



// build up the output. 
String pathToPkgAssets = "lib/1-0-0/";
String appPath = application.getRealPath("/") + pathToPkgAssets; 
String requestedFile = "";
String fullFilePath = "";
StringBuilder sb = new StringBuilder();

for (String param :sortedParamNames )
{	
	requestedFile = request.getParameter(param);
	
	if (!inWhiteList(requestedFile)) {
		response.sendError(HttpServletResponse.SC_NOT_FOUND);
		break;
	}
	
	fullFilePath = appPath + requestedFile;
		
	if ( (new File(fullFilePath)).exists() ) {
		
		sb.append(readFileAsString(fullFilePath));
			
	} else {
		
		response.sendError(HttpServletResponse.SC_NOT_FOUND);	
		break;
	}
}

// TODO - instead of printing immediately, build up all the
// files in memory and cache them to disk. Look up the files
// from disk first next time - if not found then do this
// loop.

out.print(sb.toString());

%>