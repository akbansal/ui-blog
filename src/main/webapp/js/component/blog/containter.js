 /**
 *
 * @Blog Container Component JS File.
 * This JS file creates a viewModel which binds with Blog Container Template.
 * @author amit.k.bansal@gmail.com
 */

define(['jquery','knockout','text!./container.html','RestUtil', 'Modal'], 
    function($,ko, htmlString, RestUtil, Modal) {
        'use strict';
        
        /**
         * A Rest Invoker Object.
         * Passing rest service URL in the config of RestUil Constructor.
         */
        var restInvoker = new RestUtil({
             url: '/Blog/api'
        }); 
        
        /**
         * A constructor Function for a POST object.
         * @name Post
         * @param {Post Id, Post Timestamp, Post title, Post Text}
         * 
         */
        function Post(id, timestamp, title, text) {
            this.id = id;
            this.timestamp = ko.observable(timestamp);
            this.title = ko.observable(title);
            this.text = ko.observable(text);
            this.currentTemplate = ko.observable('templates/summaryPostTemplate');
            this.displayTimestamp= ko.pureComputed(function() {
                var monthNames = [  "January", "February", "March", "April", "May", "June",
                                    "July", "August", "September", "October", "November",
                                    "December"
                                ];
                var date = new Date(this.timestamp());
                return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
            }, this);
        }
        /*=====================================================================*/

        /**
         * View model for Bootstrap Modal Dialog.
         * @name ModalViewModel  
         */
        var ModalViewModel = function() {
            var self = this;
            self.text = ko.observable();
            self.title = ko.observable();
        };
        /**
         * Handler for Save button on Modal Dialog
         * @returns- the modal content (entered by user, title and Text) .
         * @name savePost  
         */
        ModalViewModel.prototype.savePost = function () {
            var self = this, text = self.text(), title=self.title();

            if( typeof(text) === "undefined" || 
                typeof(title) === "undefined" ||
                text === "" || title === ""){
                if(typeof(title) === "undefined" || title === ""){
                    $("#inputTitle").parent().parent().addClass('has-error');   
                }
                if(typeof(text) === "undefined" || text === ""){
                    $("#inputText").parent().parent().addClass('has-error');   
                } 
            }else{

                    var data = {
                    text: self.text(),
                    title: self.title()
                };

                self._requireModal();
                self.modal.close(data);
            }
        };
        /**
         * Handler for Cancel button on Modal Dialog
         * @name cancel  
         */
        ModalViewModel.prototype.cancel = function () {
            var self = this;
            self._requireModal();
            self.modal.close();
        };

        ModalViewModel.prototype._requireModal = function() {
            if (!this.modal) {
                throw new Error("ModalViewModel must be used with the `showModal` helper function.");
            }
        }; 

        /*=====================================================================*/
        /**
         * View model for Blog Container Knockout Component.
         * @name BlogViewModel  
         */

        var BlogViewModel = function() {
            var self = this;
            self.posts = ko.observableArray();
            self.loadPosts();
            $('#sidebar').affix({
                offset: {
                    top: 120
                }
            });
        };

        /**
         * Method to selecte which Template (Edit or Summary Post) should display to the user.
         * This method is called when user clicks Edit Button on any post.
         * @name templateToUse  
         * @param Post Object
         * @returns TemplateName - Edit Tempalte or Summary Template 
         */
        BlogViewModel.prototype.templateToUse = function(post) {
            return post === post.currentTemplate() ? 'templates/editPostTemplate' : "templates/summaryPostTemplate";
        };
        
        /**
         * handler to do post Template rendering processing e.g. reset any test input field.
         * @name TemplatePostProcessing  
         */
        BlogViewModel.prototype.TemplatePostProcessing = function() {
            $('.editInputTitle, .editInputText').on('keyup',function(){
                if($(this).val().length > 0){
                    $(this).parent().removeClass('has-error');
                }
            });
        };
  
        /**
         * Method to Load all posts from the backend (Rest Service) and save it in a
         * observable array self.posts
         * @name loadPosts  
         */
        BlogViewModel.prototype.loadPosts = function(){
            var self = this;
            
            restInvoker.get().done(function(JSONdataFromServer) { 
                if(JSONdataFromServer && JSONdataFromServer.length > 0){
                    //Parse the JSON data from server into Javascript object. 
                    var dataFromServer = ko.utils.parseJson(JSONdataFromServer);
                    //create a New Post JS Object for UI and map it to a array.  
                    var mappedData = ko.utils.arrayMap(dataFromServer.blog.posts, function(post) {
                        return new Post(post.id, post.timestamp, post.title, post.text);
                    });
                }
                // store the knockout posts aray with mapped Array. 
                self.posts(mappedData);
            },function(){
                //Error Scenario in case Rest Call Fails
            });
        }; 

        /**
         * handler for Create New Post button. 
         * This method is called when user clicks Create new Post button on UI.
         * @name showModal  
         * @returns call createPost method once Modal dialog is closed. 
         */
        BlogViewModel.prototype.showModal = function() {
            var self = this;
            Modal.showModal({
                viewModel: new ModalViewModel(),
                context: self,
                template: 'templates/createPostTemplate'
            }).then(self.createPost);
        };

        /**
         * Method to save newly created post at backend.
         * @name createPost  
         * @param data - Data passed by Modal dialog.
         */
        BlogViewModel.prototype.createPost = function(data){
            var self = this;
            //Serialize the Modal Form data before sending it to the server. 
            data = $.param(data);
            restInvoker.add(data).done(function() { 
                 // Load the post again from the server so that UI can be updated 
                 // with the newly created post. 
                 self.loadPosts();
            },function(e){
                //Error Scenario in case Rest Call Fails
            });
        };

        /**
         * Method to remove All Post from the server and update knockout Posts array.
         * This method is called when user clicks Remove All Posts button on UI..
         * @name removeAllPost  
         */
        BlogViewModel.prototype.removeAllPost = function(){
            var self = this;
            //We can use some fancy Dialog box but for now I am using simple JS confirm dialog box. 
            var response = window.confirm("Are you sure you want to remove all posts? ");
            if(response === true){
                restInvoker.remove().done(function(){ 
                    self.posts.removeAll();
                },function(){
                //Error Scenario in case Rest Call Fails
                });
            }
        };
        
        /**
         * Method to remove a selected post.
         * This method is called when user clicks remove Post Button on any post.
         * @name removePost  
         * @param Parent ViewModel (Parent VM is BlogViewModel )
         */        

        BlogViewModel.prototype.removePost = function(parentVM){
            var post = this;
            restInvoker.remove({'id': post.id}).done(function(){ 
                parentVM.posts.remove(post);
            },function(){
                //Error Scenario in case Rest Call Fails
            });
        }; 
        /**
         * Method to update and existing post.
         * This method is called when user clicks Save Button on Edit Post Screen.
         * @name savePost  
         * @param Parent ViewModel (Parent VM is BlogViewModel )
         */
        BlogViewModel.prototype.savePost = function(parentVM){
            var post = this, text = post.text(), title=post.title();
            $(".editInputTitle, .editInputText").parent().removeClass('has-error');   
            
            if( typeof(text) === "undefined" || typeof(title) === "undefined" ||
                text === "" || title === ""){
                if(typeof(title) === "undefined" || title === ""){
                    $(".editInputTitle").parent().addClass('has-error');   
                }
                if(typeof(text) === "undefined" || text === ""){
                    $(".editInputText").parent().addClass('has-error');   
                } 
            }else{
                var data = "text="+text+"&title="+title;
                restInvoker.add(data, {'id': post.id}).done(function() { 
                    post.currentTemplate('templates/summaryPostTemplate');
                },function(){
                    //Error Scenario in case Rest Call Fails
                });
            }
        };  

        /**
         * Method to Cancel the edit mode of a post.
         * This method is called when user clicks Cancel Button on Edit Post Screen.
         * @name cancelEditPost  
         * @param Parent ViewModel (Parent VM is BlogViewModel )
         */
        BlogViewModel.prototype.cancelEditPost = function(parentVM){
            this.currentTemplate('templates/summaryPostTemplate');
        };     

        return { viewModel: BlogViewModel, template: htmlString };
    }
);

