Instructions to setup the server
1. Install and configure the latest JDK 1.7.x
	a. Open http://java.oracle.com in a browser
	b. Go to the Java SE Downloads section
	c. Download and install the latest 64 or 32 bit Java Development Kit (JDK) 1.7 for your platform
	d. Add an environment variable for JAVA_HOME to the location where you installed the JDK. This can be anywhere on your system depending on how you installed it, but is typically a location such as:
		c:\Program Files\Java\jdk1.7.0_17 (if using Windows)
		/Library/Java/JavaVirtualMachines/jdk1.7.0_17.jdk/Contents/Home (if using OSX)
		/opt/jdk1.7.0_17 (if using Linux)
		/home/Administrator/jdk1.7.0_17 (if using Linux)
	e. Add the bin directory inside that to your path so that you can run “java -version” and “javac” from a command prompt

2. Install and configure the latest Maven 3.0.x
	a. Open http://maven.apache.org in a browser
	b. Go to the Download section
	c. Download and install the latest Maven 3.0.x for your platform
	d. Add an M2_HOME environment variable for your Maven install folder, for example:
		c:\apache-maven-3.0.5 (if using Windows)	
		/Users/Administrator/Downloads/apache-maven-3.0.5 (if using OSX)
		/home/Administrator/apache-maven-3.0.5 (if using Linux)
	e. Add an M2 environment variable for the bin folder inside M2_HOME
	f. Add M2’s value to your path so that you can run “mvn -version” from a command prompt

3. Download the code from github and start the server
	a. Download the code from github into a new folder under your home folder. For example if your user name was “Administrator” you could be extract into:
		c:\Users\Administrator\ (if using Windows)
		/Users/Administrator/ (if using OSX)
		/home/Administrator/ (if using Linux)
	b. Open a command prompt and cd into the new directory.
	c. Enter the following Maven command there:
		mvn jetty:run
	d. Accept the default answer for any prompts. You should receive a “Started Jetty Server” message at this point. If not, go back and review your steps.
	e. You should now find two new pages to test if everything works fine:
		i. http://localhost:8080/Blog/index.html - validates system is up, just says “It works!”
		ii. http://localhost:8080/Blog/test.html - simple form for populating your blog with test data. After
	f. Leave the prompt open with Jetty running, for future steps


+++++++++++++++++++++++++++++++++++++++++++++++++++++++=

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