Name: Amit Kumar Bansal
Email: amit.k.bansal26@gmail.com

I have tested this application on Chrome, Firefox, IE9 and IE10. Also Tested on multiple device like ipad 2/3/mini, iPhone 6, dektop (using devTool in Chrome, IE and Firefox). 

This application uses below Libraries / Frameworks  - 
	- Knockput 3.3.0 (using knockout framework for this Single Page Applicaton)
	- Bootstrap v3.3.4 (bootstrap is used for responsive layout)
	- jQuery (knockout has dependency on jQuery)
	- Knockout External Template Engine (Using this library to load external template so that We can divide our application into mutliple reusable template)
	- Require (Using require for asynchronously loading all the required libraries.)
	- Font Awesome (For all icons.)

Below is the architecture / structure of this application.
	./
	|
	|--- css
	|	|
	|	|--	blog.css                      	[Main Application CSS file]
	|	|--	bootstrap.css  				  	[Bootstrap CSS file]	
	|	
	|--- fonts
	|	|
	|	|-- font-awesome (version 4.3.0)  
	|	
	|--- js
	|	|
	|	|-- component
	|	|	|
	|	|	|-- blog						[Blog component for blog-container]
	|	|	|	|
	|	|	|	|-- container.html
	|	|	|	|-- container.js
	|	|	|
	|	|	|-- ComponentRegistration.js	[Knockout Component Registration Javascript file.]
	|	|
	|	|-- helper
	|	|	|
	|	|	|-- Modal-Util.js 				[Modal Helper Utility]
	|	|	|-- Rest-Util.js 				[Rest Service Helper Utility]
	|	|	
	|	|-- lib 							[All Third Party Libraries]
	|	|	|
	|	|	|-- bootstrap
	|	|	|-- jquery
	|	|	|-- knockout
	|	|	|-- koexternaltemplateengine
	|	|	|-- requrie
	|	|	
	|	|-- blog.js 						[Main Application JS file]
	|	|-- main.js 						[Require config file - load all dependent files.]
	|	
	|--- templates							[All External resuable Templates files]
	|	|
	|	|-- app_header.tmpl
	|	|-- app_sidebar.tmpl
	|	|-- createPostTemplate.tmpl
	|	|-- editPostTemplate.tmpl
	|	|-- summaryPostTemplate.tmpl	
	|
	|-- blog.html							[Main Application HTML file]
	|-- readme.txt