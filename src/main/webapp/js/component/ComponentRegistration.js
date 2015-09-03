 /**
 *
 * @param jquery
 * @param knockout
 * @Register a Knockout component 
 *		Such as registration of knockout custom components,
 * 		any custom binding handler etc can be put in this file.
 *
 * @author amit.k.bansal@gmail.com
 */
define(['jquery', 'knockout'], function($, ko) {
    //Add initialization logic here
    ko.components.register('blog-container', {
        synchronous: true,
        require: 'js/component/blog/containter'
    });
});