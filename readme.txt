Visually UNDP 2017 Interactive Map


****************************************************************
Requirements:
****************************************************************

	This project was built in a node.js/NPM development enviroment.  Tooling through that enviroment are used for JS bundling and SASS conversion to CSS.

	The following dependancies are needed in build enviroment

	- Node.js
	- SASS command line
	- webpack command line



	The following dependancies installed via NPM and are indicated in the package.json file

	- jquery



	When working with this build package, and after the enviroment dependancies are taken care of, run the following command for NPM to download dependancies.

	npm update



****************************************************************
NPM Build Scripts
****************************************************************

	- run 'npm run dev_watch' from CLI in project root to have NPM watch for updates to JS and SCSS files to rebuild CSS and bundle.js for development and testing.
	- run 'npm run build' to have the CSS and bundle.js file minimized.
	- other options defined in package.json





****************************************************************
Embedding Instructions
****************************************************************


	To embed on the UNDP website via iframe the following code has to be used on the hosting page.  Everything here is ESSENTIAL!  With out the CSS styles and the iframe in the 'viz-container' DIV the iframe height will not work properly.

	The iframe src path will have to be updated to reflect the actual location of the interaction.

	Only the contents of the 'public' folder need to be copied to the web server (and container.html can be removed).


	<style>
			/* frame container */
			.viz-container { position: relative; height: 550px; overflow: overflow; margin-bottom: 25px; }
			@media only screen and (min-width: 410px) { .viz-container { height: 600px; } }
			@media only screen and (min-width: 768px) { .viz-container { height: 850px; } }
			@media only screen and (min-width: 800px) { .viz-container { height: 0; padding-bottom: 110%; } }
			@media only screen and (min-width: 900px) { .viz-container { height: 0; padding-bottom: 90%; } }
			@media only screen and (min-width: 1007px) { .viz-container { height: 0; padding-bottom: 75%; } }
			@media only screen and (min-width: 1100px) { .viz-container { height: 700px; padding-bottom: 0; } }
			.viz-container iframe { border: 1px solid #f9f9f9; position: absolute; top:0; left: 0; width: 1px; min-width: 100%; max-width: 100%; height: 1px; min-height: 100%; }
			/* END frame container */
		</style>

	<div class="viz-container iframe-container">
        <iframe id="viz-iframe" src="PATH/TO/INTERACTION/index.html" scrolling="no" frameborder="0"></iframe>
    </div>